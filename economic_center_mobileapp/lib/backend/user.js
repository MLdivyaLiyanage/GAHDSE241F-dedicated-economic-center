const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'economic_center',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database by creating table if it doesn't exist
async function initDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Check if user table exists
        const [tables] = await connection.query('SHOW TABLES LIKE "user"');
        
        if (tables.length === 0) {
            // Create the user table if it doesn't exist
            await connection.query(`
                CREATE TABLE user (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    phone VARCHAR(20),
                    location VARCHAR(100),
                    bio TEXT,
                    user_type VARCHAR(20) DEFAULT 'seller',
                    profile_image_path VARCHAR(255),
                    rating INT DEFAULT 0,
                    posts INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `);
            console.log('User table created successfully');
        }
        
        connection.release();
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Routes

// Get user profile
app.get('/api/user/:email', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [req.params.email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const user = rows[0];
        if (user.profile_image_path) {
            // Check if file exists
            const fullPath = path.join(__dirname, user.profile_image_path);
            if (fs.existsSync(fullPath)) {
                user.profile_image_url = `${req.protocol}://${req.get('host')}/${user.profile_image_path}`;
            } else {
                // If the file doesn't exist anymore, clear the path
                user.profile_image_path = null;
                user.profile_image_url = null;
                await pool.query('UPDATE user SET profile_image_path = NULL WHERE id = ?', [user.id]);
            }
        }
        
        // Convert data types
        user.rating = Number(user.rating);
        user.posts = Number(user.posts);
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Create or update user profile
app.post('/api/user', upload.single('profile_image'), async (req, res) => {
    try {
        const { name, email, phone, location, bio, user_type, rating, posts } = req.body;
        
        // Check if the user already exists
        const [existingUsers] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        
        let userId;
        let profileImagePath = null;
        
        // If a file was uploaded, save the path
        if (req.file) {
            profileImagePath = `uploads/${req.file.filename}`;
        }
        
        if (existingUsers.length > 0) {
            // Update existing user
            userId = existingUsers[0].id;
            
            // If there's a new profile image and the user already has one, delete the old one
            if (profileImagePath && existingUsers[0].profile_image_path) {
                const oldImagePath = path.join(__dirname, existingUsers[0].profile_image_path);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            
            // Use the new profile image path or keep the existing one
            const finalImagePath = profileImagePath || existingUsers[0].profile_image_path;
            
            await pool.query(
                `UPDATE user SET 
                    name = ?, 
                    phone = ?, 
                    location = ?, 
                    bio = ?, 
                    user_type = ?, 
                    profile_image_path = ?,
                    rating = ?,
                    posts = ?
                WHERE id = ?`,
                [name, phone, location, bio, user_type, finalImagePath, rating, posts, userId]
            );
        } else {
            // Create new user
            const [result] = await pool.query(
                `INSERT INTO user 
                    (name, email, phone, location, bio, user_type, profile_image_path, rating, posts) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, email, phone, location, bio, user_type, profileImagePath, rating, posts]
            );
            
            userId = result.insertId;
        }
        
        // Fetch the updated user data
        const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [userId]);
        const user = rows[0];
        
        // Add the profile image URL
        if (user.profile_image_path) {
            user.profile_image_url = `${req.protocol}://${req.get('host')}/${user.profile_image_path}`;
        }
        
        // Convert data types
        user.rating = Number(user.rating);
        user.posts = Number(user.posts);
        
        res.json(user);
    } catch (error) {
        console.error('Error creating/updating user profile:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Delete user profile
app.delete('/api/user/:email', async (req, res) => {
    try {
        // Find the user
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [req.params.email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const user = rows[0];
        
        // Delete profile image if exists
        if (user.profile_image_path) {
            const imagePath = path.join(__dirname, user.profile_image_path);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        // Delete user from database
        await pool.query('DELETE FROM user WHERE id = ?', [user.id]);
        
        res.json({ message: 'User deleted successfully', email: req.params.email });
    } catch (error) {
        console.error('Error deleting user profile:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Initialize database when server starts
initDatabase().then(() => {
    // Start server
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Failed to initialize database:', error);
});
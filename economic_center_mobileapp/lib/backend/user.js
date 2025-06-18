const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'a526cdc5998a8d0ed930ab4cf517a302b55ae6172c5991640e7bebad1b028706';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://10.0.2.2:3001', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dedicated_economic_center'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Initialize database by creating table if it doesn't exist
async function initDatabase() {
    try {
        // Create the users table if it doesn't exist
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('farmer', 'customer', 'administrator') NOT NULL DEFAULT 'farmer',
                phone VARCHAR(20),
                address TEXT,
                city VARCHAR(100),
                country VARCHAR(100),
                bio TEXT,
                social_provider VARCHAR(50),
                social_id VARCHAR(255),
                email_verified BOOLEAN DEFAULT FALSE,
                verification_token VARCHAR(255),
                verification_token_expires DATETIME,
                reset_password_token VARCHAR(255),
                reset_password_expires DATETIME,
                last_login DATETIME,
                status ENUM('active', 'suspended', 'pending') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_role (role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `;
        
        db.query(createUsersTable, (err) => {
            if (err) {
                console.error('Error creating users table:', err);
            } else {
                console.log('Users table created/verified successfully');
            }
        });

        // Create admin table if it doesn't exist
        const createAdminTable = `
            CREATE TABLE IF NOT EXISTS admin (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `;
        
        db.query(createAdminTable, (err) => {
            if (err) {
                console.error('Error creating admin table:', err);
            } else {
                console.log('Admin table created/verified successfully');
                
                // Check if default admin exists, if not create one
                db.query('SELECT * FROM admin WHERE email = ?', ['admin@economic.com'], (err, results) => {
                    if (err) {
                        console.error('Error checking admin:', err);
                    } else if (results.length === 0) {
                        // Create default admin
                        const hashedPassword = bcrypt.hashSync('admin123', 10);
                        db.query('INSERT INTO admin (email, password) VALUES (?, ?)', 
                            ['admin@economic.com', hashedPassword], (err) => {
                            if (err) {
                                console.error('Error creating default admin:', err);
                            } else {
                                console.log('Default admin created: admin@economic.com / admin123');
                            }
                        });
                    }
                });
            }
        });
        
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
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Register Route
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    console.log('Registration attempt:', { username, email, role });

    // Validation
    if (!username || !email || !password || !role) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters' 
      });
    }

    // Valid roles check
    const validRoles = ['farmer', 'customer', 'administrator'];
    if (!validRoles.includes(role.toLowerCase())) {
      console.log('Invalid role:', role);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid role selected' 
      });
    }

    // Check if user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Server error' 
        });
      }

      if (results.length > 0) {
        console.log('User already exists with email:', email);
        return res.status(400).json({ 
          success: false, 
          error: 'User already exists with this email' 
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const insertUserQuery = `
        INSERT INTO users (name, email, password, role, created_at, updated_at) 
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `;

      console.log('Inserting user with role:', role);

      db.query(insertUserQuery, [username, email, hashedPassword, role.toLowerCase()], (err, result) => {
        if (err) {
          console.error('Database error during insert:', err);
          return res.status(500).json({ 
            success: false, 
            error: 'Server error during registration' 
          });
        }

        console.log('User registered successfully with ID:', result.insertId);

        const userData = {
          id: result.insertId,
          name: username,
          email: email,
          role: role.toLowerCase(),
          status: 'active'
        };

        console.log('Sending registration response with user data:', userData);

        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          user: userData
        });
      });
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt for username:', username);

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      });
    }

    // Check if user exists (by email or name)
    const getUserQuery = 'SELECT * FROM users WHERE email = ? OR name = ?';
    db.query(getUserQuery, [username, username], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Server error' 
        });
      }

      if (results.length === 0) {
        console.log('No user found with username:', username);
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid credentials' 
        });
      }

      const user = results[0];
      console.log('Found user:', { id: user.id, name: user.name, email: user.email, role: user.role });

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Invalid password for user:', username);
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid credentials' 
        });
      }

      // Check account status
      if (user.status === 'suspended') {
        return res.status(401).json({ 
          success: false, 
          error: 'Account is suspended. Please contact support.' 
        });
      }

      // Update last login
      const updateLoginQuery = 'UPDATE users SET last_login = NOW() WHERE id = ?';
      db.query(updateLoginQuery, [user.id], (err) => {
        if (err) {
          console.error('Error updating last login:', err);
        }
      });

      console.log('User logged in successfully:', { id: user.id, name: user.name, email: user.email, role: user.role });

      // Create JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const userData = {
        id: user.id,
        userId: user.id, // Ensure both id and userId are included
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      };

      console.log('Sending login response with user data:', userData);

      res.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: userData
      });
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Admin Login Route
app.post('/api/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Admin login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    const getAdminQuery = 'SELECT * FROM admin WHERE email = ?';
    db.query(getAdminQuery, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Server error' 
        });
      }

      if (results.length === 0) {
        console.log('No admin found with email:', email);
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid admin credentials' 
        });
      }

      const admin = results[0];
      console.log('Found admin:', { id: admin.id, email: admin.email });

      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        console.log('Invalid password for admin:', email);
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid admin credentials' 
        });
      }

      const updateLoginQuery = 'UPDATE admin SET updated_at = NOW() WHERE id = ?';
      db.query(updateLoginQuery, [admin.id], (err) => {
        if (err) {
          console.error('Error updating admin last login:', err);
        }
      });

      console.log('Admin logged in successfully:', { id: admin.id, email: admin.email });

      const token = jwt.sign(
        { 
          userId: admin.id, 
          email: admin.email, 
          role: 'admin',
          isAdmin: true
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const adminData = {
        id: admin.id,
        name: 'Administrator',
        email: admin.email,
        role: 'admin'
      };

      console.log('Sending admin login response with admin data:', adminData);

      res.json({
        success: true,
        message: 'Admin login successful',
        token: token,
        user: adminData
      });
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get User Profile Route
app.get('/api/profile', verifyToken, (req, res) => {
  const getUserQuery = 'SELECT id, name, email, role, phone, address, city, country, bio, created_at, last_login FROM users WHERE id = ?';
  db.query(getUserQuery, [req.user.userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Server error' 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      user: results[0]
    });
  });
});

// Update Profile Route
app.put('/api/profile', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, country, bio } = req.body;
    const userId = req.user.userId;

    console.log('Profile update request for user:', userId, req.body);

    if (!firstName) {
      return res.status(400).json({ 
        success: false, 
        error: 'First name is required' 
      });
    }

    const fullName = lastName ? `${firstName} ${lastName}` : firstName;

    const updateProfileQuery = `
      UPDATE users SET 
        name = ?,
        phone = ?,
        address = ?,
        city = ?,
        country = ?,
        bio = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    db.query(updateProfileQuery, [
      fullName,
      phone,
      address,
      city,
      country,
      bio,
      userId
    ], (err, result) => {
      if (err) {
        console.error('Database error during profile update:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Server error during profile update' 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      console.log('Profile updated successfully for user:', userId);

      const getUserQuery = 'SELECT id, name, email, role FROM users WHERE id = ?';
      db.query(getUserQuery, [userId], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            success: false, 
            error: 'Server error' 
          });
        }

        if (results.length === 0) {
          return res.status(404).json({ 
            success: false, 
            error: 'User not found' 
          });
        }

        res.json({
          success: true,
          message: 'Profile updated successfully',
          user: results[0]
        });
      });
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Economic Center API is running!',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// Initialize database when server starts
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
        console.log(`✅ API Health check: http://localhost:${PORT}/api/health`);
        console.log(`✅ Database: economic_center`);
    });
}).catch(error => {
    console.error('Failed to initialize database:', error);
});
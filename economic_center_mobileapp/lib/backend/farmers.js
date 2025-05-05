const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5300;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost', 'http://127.0.0.1', 'http://10.0.2.2'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Replace with your MySQL password
  database: 'economic_center',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database schema
async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    // Check if rating column exists first, then add it if it doesn't
    const [columns] = await connection.query(`SHOW COLUMNS FROM users LIKE 'rating'`);
    if (columns.length === 0) {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN rating DECIMAL(3,2) DEFAULT 0
      `);
      console.log('Added rating column to users table');
    }

    // Create feedback table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        farmer_id INT NOT NULL,
        user_id INT NOT NULL,
        rating DECIMAL(2,1) NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES users(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('Database schema initialized successfully');
  } catch (err) {
    console.error('Error initializing database schema:', err);
  } finally {
    connection.release();
  }
}

// Verify database connection and initialize schema
pool.getConnection()
  .then(async (connection) => {
    console.log('Connected to MySQL database');
    connection.release();
    await initializeDatabase();
  })
  .catch(err => {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  });

// Configure storage for profile images
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/profiles';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
  }
});

// Configure storage for product images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/products';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, 'product-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadProfile = multer({ storage: profileStorage });
const uploadProduct = multer({ storage: productStorage });

// Helper function for database queries
async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

// API Routes
app.post('/api/upload-profile', uploadProfile.single('profileImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  res.json({ 
    success: true, 
    filePath: `/uploads/profiles/${req.file.filename}`
  });
});

app.post('/api/upload-products', uploadProduct.array('productImages', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, error: 'No files uploaded' });
  }
  
  const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
  res.json({ 
    success: true, 
    filePaths: filePaths
  });
});

// Create/Update User Profile
app.post('/api/user-profile', async (req, res) => {
  const { 
    username, 
    email, 
    age, 
    aboutMe, 
    address, 
    idNumber, 
    phoneNumber, 
    location, 
    workExperience, 
    facebookLink, 
    instagramLink,
    profileImagePath,
    isUpdate
  } = req.body;

  try {
    const results = await query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (results.length > 0 && !isUpdate) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }

    if (results.length > 0) {
      const userId = results[0].id;
      await query(
        `UPDATE users SET 
          email = ?, age = ?, about_me = ?, address = ?, id_number = ?, 
          phone_number = ?, location = ?, work_experience = ?, 
          facebook_link = ?, instagram_link = ?, profile_image = ?
        WHERE id = ?`,
        [email, age, aboutMe, address, idNumber, phoneNumber, location, 
         workExperience, facebookLink, instagramLink, profileImagePath, userId]
      );
      
      res.json({ 
        success: true, 
        message: 'User profile updated successfully', 
        userId: userId 
      });
    } else {
      const insertResult = await query(
        `INSERT INTO users 
        (username, email, age, about_me, address, id_number, phone_number, 
         location, work_experience, facebook_link, instagram_link, profile_image) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, email, age, aboutMe, address, idNumber, phoneNumber, 
         location, workExperience, facebookLink, instagramLink, profileImagePath]
      );
      
      res.json({ 
        success: true, 
        message: 'User profile created successfully', 
        userId: insertResult.insertId 
      });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: 'Database operation failed' });
  }
});

// Get User Profile by Username
app.get('/api/user-profile/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const results = await query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      user: results[0] 
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: 'Database operation failed' });
  }
});

// Get all user profiles with their products and feedback
app.get('/api/all-profiles', async (req, res) => {
  try {
    const users = await query('SELECT * FROM users');
    
    if (users.length === 0) {
      return res.json({ success: true, profiles: [] });
    }

    const userIds = users.map(user => user.id);
    
    // Get products with images
    const productResults = await query(
      `SELECT p.*, pi.image_path 
       FROM products p 
       LEFT JOIN product_images pi ON p.id = pi.product_id 
       WHERE p.user_id IN (?)`,
      [userIds]
    );

    // Get feedback counts and average ratings
    const feedbackStats = await query(
      `SELECT 
         farmer_id, 
         COUNT(*) as feedback_count, 
         AVG(rating) as average_rating 
       FROM feedback 
       WHERE farmer_id IN (?) 
       GROUP BY farmer_id`,
      [userIds]
    );

    const usersWithData = users.map(user => {
      // Get products for this user
      const products = productResults
        .filter(product => product.user_id === user.id)
        .reduce((acc, product) => {
          const existingProduct = acc.find(p => p.id === product.id);
          if (existingProduct) {
            if (product.image_path) {
              existingProduct.images.push(product.image_path);
            }
          } else {
            acc.push({
              id: product.id,
              name: product.name,
              price: product.price,
              details: product.details,
              images: product.image_path ? [product.image_path] : []
            });
          }
          return acc;
        }, []);

      // Get feedback stats for this user
      const userFeedback = feedbackStats.find(f => f.farmer_id === user.id) || {
        feedback_count: 0,
        average_rating: 0
      };

      return {
        ...user,
        rating: parseFloat(userFeedback.average_rating) || 0,
        products: products,
        feedback_count: userFeedback.feedback_count
      };
    });

    res.json({ 
      success: true, 
      profiles: usersWithData 
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch profiles' });
  }
});

// Product Management Endpoints
app.post('/api/add-product', async (req, res) => {
  const { 
    userId, 
    productId, 
    productName, 
    productPrice, 
    productDetails, 
    productImagePaths 
  } = req.body;
  
  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }
  
  try {
    if (productId) {
      await query(
        `UPDATE products SET name = ?, price = ?, details = ? 
         WHERE id = ? AND user_id = ?`,
        [productName, productPrice, productDetails, productId, userId]
      );
      
      if (productImagePaths?.length > 0) {
        await query('DELETE FROM product_images WHERE product_id = ?', [productId]);
        const imageValues = productImagePaths.map(path => [productId, path]);
        await query('INSERT INTO product_images (product_id, image_path) VALUES ?', [imageValues]);
      }
      
      res.json({ 
        success: true, 
        message: 'Product updated successfully', 
        productId: productId 
      });
    } else {
      const insertResult = await query(
        `INSERT INTO products (user_id, name, price, details) 
         VALUES (?, ?, ?, ?)`,
        [userId, productName, productPrice, productDetails]
      );
      
      const newProductId = insertResult.insertId;
      
      if (productImagePaths?.length > 0) {
        const imageValues = productImagePaths.map(path => [newProductId, path]);
        await query('INSERT INTO product_images (product_id, image_path) VALUES ?', [imageValues]);
      }
      
      res.json({ 
        success: true, 
        message: 'Product added successfully', 
        productId: newProductId 
      });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: 'Database operation failed' });
  }
});

app.get('/api/user-products/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const products = await query('SELECT * FROM products WHERE user_id = ?', [userId]);
    
    if (products.length === 0) {
      return res.json({ success: true, products: [] });
    }
    
    const productIds = products.map(product => product.id);
    const imageResults = await query(
      `SELECT product_id, image_path FROM product_images WHERE product_id IN (?)`,
      [productIds]
    );
    
    const productsWithImages = products.map(product => {
      const images = imageResults
        .filter(img => img.product_id === product.id)
        .map(img => img.image_path);
      
      return {
        ...product,
        images: images
      };
    });
    
    res.json({ 
      success: true, 
      products: productsWithImages 
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: 'Database operation failed' });
  }
});

app.delete('/api/delete-product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    
    const results = await query(
      'SELECT * FROM products WHERE id = ? AND user_id = ?',
      [productId, userId]
    );
    
    if (results.length === 0) {
      return res.status(403).json({ success: false, error: 'Unauthorized or product not found' });
    }
    
    await query('DELETE FROM product_images WHERE product_id = ?', [productId]);
    await query('DELETE FROM products WHERE id = ?', [productId]);
    
    res.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: 'Database operation failed' });
  }
});

// Feedback Endpoints
app.post('/api/submit-feedback', async (req, res) => {
  const { farmerId, userId, rating, comment } = req.body;

  if (!farmerId || !userId || !rating) {
    return res.status(400).json({ 
      success: false, 
      error: 'Farmer ID, User ID and Rating are required' 
    });
  }

  try {
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert new feedback
      await connection.query(
        'INSERT INTO feedback (farmer_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [farmerId, userId, rating, comment || null]
      );

      // Calculate new average rating
      const [ratingResult] = await connection.query(
        `SELECT 
           COUNT(*) as feedback_count,
           AVG(rating) as avg_rating 
         FROM feedback 
         WHERE farmer_id = ?`,
        [farmerId]
      );

      const avgRating = parseFloat(ratingResult[0].avg_rating) || 0;

      // Update farmer's rating
      await connection.query(
        'UPDATE users SET rating = ? WHERE id = ?',
        [avgRating, farmerId]
      );

      // Commit transaction
      await connection.commit();
      
      res.json({ 
        success: true, 
        message: 'Feedback submitted successfully',
        averageRating: avgRating,
        feedbackCount: ratingResult[0].feedback_count
      });
    } catch (err) {
      // Rollback on error
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit feedback',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.get('/api/farmer-feedback/:farmerId', async (req, res) => {
  try {
    const farmerId = req.params.farmerId;

    const feedback = await query(
      `SELECT 
         f.id, f.rating, f.comment, f.created_at,
         u.id as user_id, u.username, u.profile_image
       FROM feedback f
       JOIN users u ON f.user_id = u.id
       WHERE f.farmer_id = ?
       ORDER BY f.created_at DESC`,
      [farmerId]
    );

    res.json({ 
      success: true, 
      feedback: feedback 
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch feedback',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ 
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (err) {
    res.json({ 
      status: 'Degraded',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: err.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start the server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    pool.end();
    console.log('Server stopped');
    process.exit(0);
  });
});
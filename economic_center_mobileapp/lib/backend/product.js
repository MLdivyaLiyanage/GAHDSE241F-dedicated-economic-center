const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://10.0.2.2:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'economic_center',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
})();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/products';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png) are allowed'));
    }
  }
});

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM product');
    
    const products = rows.map(product => ({
      ...product,
      is_local: product.is_local || true,
      rating: product.rating || 4.0,
      seller: product.seller || 'Local Seller',
      review_count: product.review_count || 0,
      stock_quantity: product.stock || 0
    }));
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error.message 
    });
  }
});

// GET single product with reviews
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Get product
    const [productRows] = await pool.query('SELECT * FROM product WHERE id = ?', [productId]);
    
    if (productRows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }
    
    const product = productRows[0];
    
    // Get reviews for this product
    const [reviewRows] = await pool.query(
      'SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC',
      [productId]
    );
    
    // Calculate average rating
    let averageRating = 4.0;
    if (reviewRows.length > 0) {
      const totalRating = reviewRows.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / reviewRows.length;
    }
    
    // Update product with reviews and average rating
    const productWithReviews = {
      ...product,
      stock_quantity: product.stock || 0,
      rating: averageRating,
      review_count: reviewRows.length,
      reviews: reviewRows
    };
    
    res.status(200).json(productWithReviews);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error.message 
    });
  }
});

// POST a new review
app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const productId = req.params.id;
    const { username, rating, comment } = req.body;
    
    // Validate input
    if (!username || !rating || !comment) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false,
        error: 'Rating must be between 1 and 5' 
      });
    }
    
    // Check if product exists
    const [productRows] = await pool.query('SELECT id FROM product WHERE id = ?', [productId]);
    if (productRows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }
    
    // Insert review
    const [result] = await pool.execute(
      `INSERT INTO product_reviews 
       (product_id, username, rating, comment) 
       VALUES (?, ?, ?, ?)`,
      [productId, username, rating, comment]
    );
    
    // Get the newly created review
    const [reviewRows] = await pool.query(
      'SELECT * FROM product_reviews WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: reviewRows[0]
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error.message 
    });
  }
});

// UPDATE product stock
app.put('/api/products/:id/stock', async (req, res) => {
  try {
    const productId = req.params.id;
    const { stock } = req.body;

    if (stock === undefined || stock === null || isNaN(stock)) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid stock quantity is required' 
      });
    }

    const [result] = await pool.execute(
      'UPDATE product SET stock = ? WHERE id = ?',
      [stock, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Stock updated successfully' 
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error.message 
    });
  }
});

// Handle product purchase and update stock
app.post('/api/products/:id/purchase', async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;

    // Validate input
    if (quantity === undefined || quantity === null || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid quantity is required (must be greater than 0)' 
      });
    }

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check current stock with row lock
      const [productRows] = await connection.query(
        'SELECT stock FROM product WHERE id = ? FOR UPDATE', 
        [productId]
      );

      if (productRows.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ 
          success: false,
          error: 'Product not found' 
        });
      }

      const currentStock = productRows[0].stock;
      
      // Verify sufficient stock
      if (currentStock < quantity) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ 
          success: false,
          error: 'Insufficient stock available' 
        });
      }

      // Update stock
      const [result] = await connection.query(
        'UPDATE product SET stock = stock - ? WHERE id = ?',
        [quantity, productId]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ 
          success: false,
          error: 'Product not found' 
        });
      }

      // Commit transaction
      await connection.commit();
      connection.release();

      res.status(200).json({ 
        success: true,
        message: 'Purchase successful',
        remaining_stock: currentStock - quantity
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error.message 
    });
  }
});

// Upload Product
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Product image is required' 
      });
    }

    const { name, price, stock, category, description } = req.body;

    if (!name || !price || !stock || !category || !description) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }

    const imageUrl = `uploads/products/${req.file.filename}`;
    
    const [result] = await pool.execute(
      `INSERT INTO product 
       (name, price, stock, category, description, image_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name, 
        parseFloat(price), 
        parseInt(stock), 
        category, 
        description, 
        imageUrl
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Product uploaded successfully',
      product: {
        id: result.insertId,
        name,
        price: parseFloat(price),
        stock_quantity: parseInt(stock),
        category,
        description,
        image_url: imageUrl,
        is_local: true,
        rating: 4.0,
        seller: 'Local Seller',
        review_count: 0
      }
    });
  } catch (error) {
    console.error('Error uploading product:', error);
    
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Server is running' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      success: false,
      error: err.message 
    });
  } else if (err) {
    return res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api/products`);
});
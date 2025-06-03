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

// PRODUCT ENDPOINTS //

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

// Handle product purchase
// Handle product purchase
app.post('/api/products/:id/purchase', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const productId = req.params.id;
    const { quantity } = req.body;

    // Validate input
    if (quantity === undefined || quantity === null || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid quantity is required (must be greater than 0)' 
      });
    }

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

// CART ENDPOINTS //

// Add to cart
app.post('/api/cart', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { productId, quantity } = req.body;
    
    // Validate input
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid productId and quantity are required' 
      });
    }
    
    // Check if product exists and has enough stock
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
    if (currentStock < quantity) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ 
        success: false,
        error: 'Insufficient stock available' 
      });
    }
    
    // Check if item already in cart
    const [existingCartItems] = await connection.query(
      'SELECT * FROM cart_items WHERE product_id = ?',
      [productId]
    );
    
    let cartItemId;
    if (existingCartItems.length > 0) {
      // Update existing cart item
      const existingItem = existingCartItems[0];
      const newQuantity = existingItem.quantity + quantity;
      await connection.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItem.id]
      );
      cartItemId = existingItem.id;
    } else {
      // Add new cart item
      const [result] = await connection.query(
        'INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)',
        [productId, quantity]
      );
      cartItemId = result.insertId;
    }

    // Fetch the newly added/updated cart item to return it
    const [newCartItemRows] = await connection.query(`
      SELECT c.id as cart_id, c.quantity, p.*
      FROM cart_items c
      JOIN product p ON c.product_id = p.id
      WHERE c.id = ?
    `, [cartItemId]);
    
    await connection.commit();
    connection.release();
    
    if (newCartItemRows.length === 0) {
      // This should ideally not happen if insert/update was successful
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve the cart item after adding/updating.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product added/updated in cart successfully',
      cartItem: newCartItemRows[0] // Send back the cart item
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Error adding to cart:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error.message 
    });
  }
});

// Get cart items
app.get('/api/cart', async (req, res) => {
  try {
    const [cartItems] = await pool.query(`
      SELECT c.id as cart_id, c.quantity, p.* 
      FROM cart_items c
      JOIN product p ON c.product_id = p.id
    `);
    
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error.message 
    });
  }
});

// Update cart item quantity
app.put('/api/cart/:cartItemId', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const cartItemId = req.params.cartItemId;
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid quantity is required' 
      });
    }
    
    // Get current cart item
    const [cartItemRows] = await connection.query(
      'SELECT * FROM cart_items WHERE id = ?',
      [cartItemId]
    );
    
    if (cartItemRows.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ 
        success: false,
        error: 'Cart item not found' 
      });
    }
    
    const cartItem = cartItemRows[0];
    
    // Check product stock
    const [productRows] = await connection.query(
      'SELECT stock FROM product WHERE id = ? FOR UPDATE',
      [cartItem.product_id]
    );
    
    if (productRows[0].stock < quantity) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ 
        success: false,
        error: 'Insufficient stock available' 
      });
    }
    
    // Update cart item
    await connection.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, cartItemId]
    );
    
    await connection.commit();
    connection.release();
    
    res.status(200).json({ 
      success: true,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Error updating cart:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error.message 
    });
  }
});

// Remove from cart
// Clear all items from cart
app.delete('/api/cart/clear', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items');
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Remove from cart
app.delete('/api/cart/:cartItemId', async (req, res) => {
  try {
    const cartItemId = req.params.cartItemId;
    
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE id = ?',
      [cartItemId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Batch purchase (checkout)
// Batch purchase (checkout)
app.post('/api/cart/checkout', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Get all cart items with product details
    const [cartItems] = await connection.query(`
      SELECT c.id as cart_id, c.quantity, p.* 
      FROM cart_items c
      JOIN product p ON c.product_id = p.id
      FOR UPDATE
    `);
    
    if (cartItems.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ 
        success: false,
        error: 'Cart is empty' 
      });
    }
    
    // Validate stock for all items
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ 
          success: false,
          error: `Insufficient stock for ${item.name}`,
          productId: item.id
        });
      }
    }
    
    // Update stock for all products
    for (const item of cartItems) {
      await connection.query(
        'UPDATE product SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    }
    
    // Clear the cart
    await connection.query('DELETE FROM cart_items');
    
    await connection.commit();
    connection.release();
    
    res.status(200).json({ 
      success: true,
      message: 'Checkout successful',
      purchasedItems: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Error during checkout:', error);
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

// CREATE TABLE IF NOT EXISTS product (
//     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     price DECIMAL(10, 2) NOT NULL,
//     stock INT NOT NULL DEFAULT 0,
//     category VARCHAR(50) NOT NULL,
//     description TEXT NOT NULL,
//     image_url VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


// CREATE TABLE product_reviews (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   product_id INT NOT NULL,
//   username VARCHAR(100) NOT NULL,
//   rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
//   comment TEXT NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
// );


// CREATE TABLE cart_items (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   product_id INT,
//   quantity INT NOT NULL DEFAULT 1,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   FOREIGN KEY (product_id) REFERENCES product(id)
// );
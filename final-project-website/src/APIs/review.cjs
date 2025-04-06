// server.js - Main server file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'economic_center'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create feedback table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database initialized successfully');
    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

// Initialize database on startup
initializeDatabase();

// Routes
// GET all feedback for a specific product
app.get('/api/feedback', async (req, res) => {
  const { productId } = req.query;
  
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }
  
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM feedback WHERE product_id = ? ORDER BY date DESC',
      [productId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// POST new feedback
app.post('/api/feedback', async (req, res) => {
  const { productId, name, rating, comment } = req.body;
  
  // Validate input
  if (!productId || !name || !rating || !comment) {
    return res.status(400).json({ message: 'Please provide product ID, name, rating, and comment' });
  }
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO feedback (product_id, name, rating, comment) VALUES (?, ?, ?, ?)',
      [productId, name, rating, comment]
    );
    
    const [newFeedback] = await pool.execute(
      'SELECT * FROM feedback WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newFeedback[0]);
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Error saving feedback', error: error.message });
  }
});

// GET product details
app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
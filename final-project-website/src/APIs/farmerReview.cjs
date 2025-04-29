const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5100;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// MySQL Connection Pool with better configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'economic_center',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'utc'
});

// Database initialization with better error handling
async function initDb() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
}

// Initialize database
initDb();

// Enhanced API Routes with better error handling
// Get all feedback entries
app.get('/api/feedback', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT id, name, rating, comment, date FROM feedback ORDER BY date DESC'
    );
    
    res.json({
      success: true,
      data: rows.map(row => ({
        ...row,
        date: new Date(row.date).toISOString()
      }))
    });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch feedback',
      error: err.message 
    });
  } finally {
    if (connection) connection.release();
  }
});

// Create new feedback with validation
app.post('/api/feedback', async (req, res) => {
  let connection;
  try {
    const { name, rating, comment } = req.body;
    
    // Validate input
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid name' 
      });
    }
    
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid rating between 1 and 5' 
      });
    }
    
    if (!comment || typeof comment !== 'string' || comment.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide valid feedback comments' 
      });
    }
    
    connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO feedback (name, rating, comment) VALUES (?, ?, ?)',
      [name.trim(), parseInt(rating), comment.trim()]
    );
    
    // Get the newly created feedback
    const [rows] = await connection.query(
      'SELECT id, name, rating, comment, date FROM feedback WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      data: {
        ...rows[0],
        date: new Date(rows[0].date).toISOString()
      }
    });
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to save feedback',
      error: err.message 
    });
  } finally {
    if (connection) connection.release();
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server with better logging
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database: ${process.env.DB_NAME || 'economic_center'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
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
        name VARCHAR(100) NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
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
// GET all feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM feedback ORDER BY date DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// POST new feedback
app.post('/api/feedback', async (req, res) => {
  const { name, rating, comment } = req.body;
  
  // Validate input
  if (!name || !rating || !comment) {
    return res.status(400).json({ message: 'Please provide name, rating, and comment' });
  }
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO feedback (name, rating, comment) VALUES (?, ?, ?)',
      [name, rating, comment]
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
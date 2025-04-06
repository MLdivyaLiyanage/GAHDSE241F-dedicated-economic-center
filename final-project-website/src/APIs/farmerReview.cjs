// server.js - Main server file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'economic_center', // replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database - create table if not exists
async function initDb() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized');
    connection.release();
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Call the initialization function
initDb();

// API Routes
// Get all feedback entries
app.get('/api/feedback', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM feedback ORDER BY date DESC');
    
    // Format the response to match the expected structure in the React component
    const formattedRows = rows.map(row => ({
      id: row.id,
      name: row.name,
      rating: row.rating,
      comment: row.comment,
      date: row.date
    }));
    
    res.json(formattedRows);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    
    // Validate input
    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide name, rating, and comment' });
    }
    
    // Insert into database
    const [result] = await pool.query(
      'INSERT INTO feedback (name, rating, comment) VALUES (?, ?, ?)',
      [name, rating, comment]
    );
    
    // Get the newly created feedback
    const [rows] = await pool.query('SELECT * FROM feedback WHERE id = ?', [result.insertId]);
    
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
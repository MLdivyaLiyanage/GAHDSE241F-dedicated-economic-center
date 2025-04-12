// server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'economic_center' // replace with your database name
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Signup API Endpoint
app.post('/api/signup', (req, res) => {
  const { username, email, password, role } = req.body;

  // Validate input
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if email already exists
  db.query(
    'SELECT * FROM register WHERE email = ?',
    [email],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.length > 0) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      // Insert new user
      db.query(
        'INSERT INTO register (username, email, pwrd, role) VALUES (?, ?, ?, ?)',
        [username, email, password, role.toLowerCase()], // Convert role to lowercase to match enum
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to register user' });
          }
          res.status(201).json({ message: 'User registered successfully', userId: results.insertId });
        }
      );
    }
  );
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
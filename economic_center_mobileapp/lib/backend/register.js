const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

// Enhanced CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database configuration with error handling
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Make sure this matches your MySQL password
  database: 'economic_center',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');
    connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1); // Exit if database connection fails
  }
}
testConnection();

// Login API with enhanced validation
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Username and password are required' 
      });
    }

    const [rows] = await pool.execute(
      'SELECT userid, username, email, role FROM register WHERE username = ? AND pwrd = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid username or password' 
      });
    }

    const user = rows[0];
    res.status(200).json({ 
      success: true,
      message: 'Login successful',
      user: {
        userid: user.userid,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Signup API with enhanced validation
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate all required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    // Check if email already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM register WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        success: false,
        error: 'Email or username already exists' 
      });
    }

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO register (username, email, pwrd, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role.toLowerCase()]
    );

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully', 
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to register user' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});
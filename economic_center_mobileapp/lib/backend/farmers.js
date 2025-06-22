const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 5300;

// Middleware
app.use(cors({
  origin: ['http://localhost', 'http://127.0.0.1', 'http://10.0.2.2'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database Connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dedicated_economic_center',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to ensure numeric values
function ensureNumbers(data) {
  return {
    ...data,
    id: parseInt(data.id),
    user_id: parseInt(data.user_id),
    age: data.age ? parseInt(data.age) : null,
    location_lat: data.location_lat ? parseFloat(data.location_lat) : null,
    location_lng: data.location_lng ? parseFloat(data.location_lng) : null,
    average_rating: data.average_rating ? parseFloat(data.average_rating) : 0,
    feedback_count: data.feedback_count ? parseInt(data.feedback_count) : 0
  };
}

// Get all farmer profiles
app.get('/api/farmer-profiles', async (req, res) => {
  try {
    const [profiles] = await pool.query(`
      SELECT 
        fp.*,
        COUNT(f.id) as feedback_count,
        IFNULL(AVG(f.rating), 0) as average_rating
      FROM farmer_profiles fp
      LEFT JOIN feedback f ON fp.user_id = f.farmer_id
      GROUP BY fp.id
    `);

    const formattedProfiles = profiles.map(profile => ensureNumbers(profile));
    res.json({ success: true, profiles: formattedProfiles });
  } catch (err) {
    console.error('Error fetching farmer profiles:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Get single farmer profile
app.get('/api/farmer-profiles/:id', async (req, res) => {
  try {
    const [profile] = await pool.query(`
      SELECT 
        fp.*,
        COUNT(f.id) as feedback_count,
        IFNULL(AVG(f.rating), 0) as average_rating
      FROM farmer_profiles fp
      LEFT JOIN feedback f ON fp.user_id = f.farmer_id
      WHERE fp.id = ?
      GROUP BY fp.id
    `, [req.params.id]);

    if (profile.length === 0) {
      return res.status(404).json({ success: false, error: 'Farmer not found' });
    }

    const formattedProfile = ensureNumbers(profile[0]);
    res.json({ success: true, profile: formattedProfile });
  } catch (err) {
    console.error('Error fetching farmer profile:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Submit feedback
app.post('/api/farmer-feedback', async (req, res) => {
  const { farmerId, userId, rating, comment } = req.body;

  try {
    await pool.query(
      `INSERT INTO feedback (farmer_id, user_id, rating, comment) 
       VALUES (?, ?, ?, ?)`,
      [farmerId, userId, rating, comment]
    );

    res.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ success: false, error: 'Failed to submit feedback' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', database: 'connected' });
  } catch (err) {
    res.json({ status: 'Degraded', database: 'disconnected' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
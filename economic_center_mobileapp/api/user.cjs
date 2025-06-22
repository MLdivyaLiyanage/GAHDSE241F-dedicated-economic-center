const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // set your password
  database: 'your_database', // set your database
});

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET user by email
router.get('/api/user/:email', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [req.params.email]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE or UPDATE user
router.post('/api/user', upload.single('profile_image'), async (req, res) => {
  try {
    const {
      name, email, phone, location, bio, user_type, rating, posts
    } = req.body;
    let profile_image_url;
    if (req.file) {
      profile_image_url = `/uploads/${req.file.filename}`;
    }

    // Check if user exists
    const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    if (rows.length > 0) {
      // Update
      let updateFields = [
        name, phone, location, bio, user_type, rating || 0, posts || 0
      ];
      let sql = `UPDATE user SET name=?, phone=?, location=?, bio=?, user_type=?, rating=?, posts=?`;
      if (profile_image_url) {
        sql += `, profile_image_url=?`;
        updateFields.push(profile_image_url);
      }
      sql += ` WHERE email=?`;
      updateFields.push(email);
      await pool.query(sql, updateFields);
    } else {
      // Insert
      await pool.query(
        `INSERT INTO user (name, email, phone, location, bio, user_type, profile_image_url, rating, posts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, email, phone, location, bio, user_type, profile_image_url || null, rating || 0, posts || 0
        ]
      );
    }
    // Return updated/created user
    const [result] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user by email
router.delete('/api/user/:email', async (req, res) => {
  try {
    // Optionally, delete the profile image file from disk
    const [rows] = await pool.query('SELECT profile_image_url FROM user WHERE email = ?', [req.params.email]);
    if (rows.length > 0 && rows[0].profile_image_url) {
      const imgPath = path.join(__dirname, '..', rows[0].profile_image_url);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await pool.query('DELETE FROM user WHERE email = ?', [req.params.email]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
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
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// GET product data
app.get('/api/products/:id', async (req, res) => {
  try {
    const [productRows] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );
    
    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Get product images
    const [imageRows] = await pool.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
      [req.params.id]
    );
    
    const product = {
      ...productRows[0],
      images: imageRows.map(img => img.image_url)
    };
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET shipping options
app.get('/api/shipping-options', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM shipping_options WHERE active = TRUE');
    
    // Convert to the format expected by the frontend
    const shippingOptions = {};
    rows.forEach(row => {
      shippingOptions[row.id] = {
        name: row.name,
        price: parseFloat(row.price),
        days: row.delivery_days
      };
    });
    
    res.json(shippingOptions);
  } catch (error) {
    console.error('Error fetching shipping options:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST place order
app.post('/api/orders', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { 
      name, 
      email, 
      address, 
      city, 
      zipCode, 
      productId, 
      quantity, 
      shippingMethod, 
      paymentMethod,
      unitPrice,
      subtotal,
      shippingCost,
      tax,
      total
    } = req.body;
    
    // Check if customer exists, otherwise create
    let customerId;
    const [existingCustomers] = await connection.query(
      'SELECT id FROM customers WHERE email = ?',
      [email]
    );
    
    if (existingCustomers.length > 0) {
      customerId = existingCustomers[0].id;
    } else {
      const [customerResult] = await connection.query(
        'INSERT INTO customers (name, email) VALUES (?, ?)',
        [name, email]
      );
      customerId = customerResult.insertId;
    }
    
    // Save customer address
    await connection.query(
      'INSERT INTO customer_addresses (customer_id, address, city, zip_code, is_default) VALUES (?, ?, ?, ?, ?)',
      [customerId, address, city, zipCode, true]
    );
    
    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
        (customer_id, product_id, shipping_option_id, quantity, unit_price, subtotal, shipping_cost, tax, total, payment_method) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customerId, productId, shippingMethod, quantity, unitPrice, subtotal, shippingCost, tax, total, paymentMethod]
    );
    
    await connection.commit();
    
    res.status(201).json({
      message: 'Order placed successfully',
      orderId: orderResult.insertId
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  } finally {
    connection.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
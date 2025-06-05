// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password if you have one
  database: 'economic_center',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4' // Important for proper character encoding
});

// Shipping options
const SHIPPING_OPTIONS = [
  { id: 1, name: 'Standard Delivery', price: 50.00, days: '3-5' },
  { id: 2, name: 'Express Delivery', price: 100.00, days: '1-2' },
  { id: 3, name: 'Free Delivery', price: 0.00, days: '5-7' }
];

// Initialize database tables with proper column lengths
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Drop tables if they exist (for development only - remove in production)
    // await connection.query('DROP TABLE IF EXISTS order_item');
    // await connection.query('DROP TABLE IF EXISTS `order`');
    // await connection.query('DROP TABLE IF EXISTS customer_address');
    // await connection.query('DROP TABLE IF EXISTS product');
    // await connection.query('DROP TABLE IF EXISTS customer');
    
    // Create customer table with shorter email length
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customer (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Create customer_address table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customer_address (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(50) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        is_default BOOLEAN DEFAULT false,
        FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Create product table (uncommented and fixed)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS prod (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        stock INT DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Create order table with backticks around 'order' (reserved keyword)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`order\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        address_id INT NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        payment_method VARCHAR(50) NOT NULL,
        shipping_method VARCHAR(50) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        shipping_cost DECIMAL(10,2) NOT NULL,
        tax DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
        FOREIGN KEY (address_id) REFERENCES customer_address(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Create order_item table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_item (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES \`order\`(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Insert some sample products if they don't exist
    await connection.query(`
      INSERT IGNORE INTO prod (id, name, price, description, image_url, stock)
      VALUES
        (1, 'Sample Product', 299.99, 'This is a sample product', 'https://via.placeholder.com/150', 100),
        (2, 'Another Product', 199.99, 'Another sample product', 'https://via.placeholder.com/150', 50)
    `);
    
    connection.release();
    console.log('Database tables initialized and seeded');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error; // Re-throw to prevent server from starting with bad DB state
  }
}

// Initialize database when starting the server
initializeDatabase().then(() => {
  console.log('Database initialization complete');
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1); // Exit if database initialization fails
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    
    res.json({ 
      status: 'OK', 
      database: 'connected',
      timestamp: new Date() 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Order endpoint
app.post('/api/orders', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Request body is empty' 
      });
    }

    const { customerInfo, shippingMethod, paymentMethod, cartItems, subtotal, shipping, tax, total } = req.body;

    // Validate required fields
    if (!customerInfo || !shippingMethod || !paymentMethod || !cartItems) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        details: 'Required fields: customerInfo, shippingMethod, paymentMethod, cartItems'
      });
    }

    // Check if customer exists or create new one
    let [customer] = await connection.query(
      'SELECT id FROM customer WHERE email = ?',
      [customerInfo.email]
    );

    let customerId;
    if (customer.length === 0) {
      // Create new customer
      [customer] = await connection.query(
        'INSERT INTO customer (name, email) VALUES (?, ?)',
        [customerInfo.name, customerInfo.email]
      );
      customerId = customer.insertId;
    } else {
      customerId = customer[0].id;
    }

    // Create shipping address
    const [address] = await connection.query(
      'INSERT INTO customer_address (customer_id, address, city, zip_code) VALUES (?, ?, ?, ?)',
      [customerId, customerInfo.address, customerInfo.city, customerInfo.zipCode]
    );
    const addressId = address.insertId;

    // Verify shipping option exists
    const selectedShipping = SHIPPING_OPTIONS.find(
      option => option.name === shippingMethod.name
    );

    if (!selectedShipping) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid shipping option',
        details: `Available options: ${SHIPPING_OPTIONS.map(o => o.name).join(', ')}`
      });
    }

    // Create the order (using backticks around 'order')
    const [order] = await connection.query(
      `INSERT INTO \`order\` (
        customer_id, 
        address_id, 
        payment_method, 
        shipping_method, 
        subtotal, 
        shipping_cost, 
        tax, 
        total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        addressId,
        paymentMethod,
        shippingMethod.name,
        parseFloat(subtotal),
        parseFloat(shipping),
        parseFloat(tax),
        parseFloat(total)
      ]
    );
    const orderId = order.insertId;

    // Insert order items
    for (const item of cartItems) {
      await connection.query(
        `INSERT INTO order_item (
          order_id, 
          product_id, 
          quantity, 
          price
        ) VALUES (?, ?, ?, ?)`,
        [
          orderId,
          item.product.id,
          item.quantity,
          item.product.price
        ]
      );

      // Update product stock in the 'product' table
      const [updateResult] = await connection.query(
        'UPDATE product SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [item.quantity, item.product.id, item.quantity]
      );

      if (updateResult.affectedRows === 0) {
        // This means either product not found or insufficient stock after the check
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          success: false,
          error: `Insufficient stock or product not found for ID: ${item.product.id} (${item.product.name})`
        });
      }
    }

    await connection.commit();

    // Return success response
    res.status(201).json({
      success: true,
      orderId: orderId,
      message: 'Order created successfully',
      order: {
        id: orderId,
        customerId: customerId,
        total: total,
        paymentMethod: paymentMethod
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Order processing error:', error);
    
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check endpoint: http://localhost:${PORT}/api/health`);
});
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'economic_center',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to generate transaction ID
const generateTransactionId = () => {
  return 'TXN-' + Date.now().toString() + '-' + Math.random().toString(36).substr(2, 8).toUpperCase();
};

// Helper function to detect card brand
const getCardBrand = (cardNumber) => {
  if (!cardNumber) return 'unknown';
  const cleaned = cardNumber.toString().replace(/\D/g, '');
  
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  
  return 'unknown';
};

/**
 * @route POST /api/orders
 * @desc Create a new order with payment
 * @access Public
 */
app.post('/api/orders', async (req, res) => {
  try {
    const {
      customerInfo,
      shippingMethod,
      paymentMethod,
      cardDetails,
      cartItems,
      subtotal,
      shipping,
      tax,
      total
    } = req.body;

    // Validate required fields
    if (!customerInfo || !shippingMethod || !paymentMethod || !cartItems || !total) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate cart items structure
    if (!Array.isArray(cartItems)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid cart items format'
      });
    }

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // First, create or find customer
      const [customerResult] = await connection.execute(
        `INSERT INTO customers (name, email) 
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name)`,
        [customerInfo.name, customerInfo.email]
      );
      
      // Get customer ID - handle both insert and update cases
      let customerId;
      if (customerResult.insertId) {
        customerId = customerResult.insertId;
      } else {
        // If no insertId, this was an update - we need to get the existing ID
        const [existingCustomer] = await connection.execute(
          `SELECT id FROM customers WHERE email = ?`,
          [customerInfo.email]
        );
        customerId = existingCustomer[0]?.id;
      }

      if (!customerId) {
        throw new Error('Failed to get customer ID');
      }

      // Add/update customer address
      await connection.execute(
        `INSERT INTO customer_addresses 
         (customer_id, address, city, zip_code, is_default)
         VALUES (?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE 
         address=VALUES(address), city=VALUES(city), zip_code=VALUES(zip_code)`,
        [
          customerId,
          customerInfo.address,
          customerInfo.city,
          customerInfo.zipCode || '' // Ensure zipCode is not null
        ]
      );

      // Create order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (
          customer_id, shipping_option_id, quantity,
          unit_price, subtotal, shipping_cost, 
          tax, total, payment_method, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customerId,
          shippingMethod.id || 1,
          cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0), // Calculate total quantity
          subtotal,
          subtotal,
          shipping || 0,
          tax || 0,
          total,
          paymentMethod,
          paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid'
        ]
      );

      const orderId = orderResult.insertId;

      // Add order items
      for (const item of cartItems) {
        if (!item.product || !item.product.id || !item.quantity || !item.product.price) {
          throw new Error('Invalid cart item structure');
        }

        await connection.execute(
          `INSERT INTO order_items (
            order_id, product_id, quantity, price
          ) VALUES (?, ?, ?, ?)`,
          [
            orderId,
            item.product.id,
            item.quantity || 1, // Default to 1 if quantity is missing
            item.product.price || 0 // Default to 0 if price is missing
          ]
        );
      }

      // Commit transaction
      await connection.commit();
      connection.release();

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: {
          id: orderId,
          customerId: customerId,
          total: total,
          paymentMethod: paymentMethod,
          status: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid'
        }
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error('Transaction error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process order',
        details: error.message
      });
    }
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Payment API server running on port ${PORT}`);
  console.log("API Endpoints:");
  console.log(`- POST http://localhost:${PORT}/api/orders`);
  console.log(`- GET http://localhost:${PORT}/api/orders/:orderId`);
});

/*
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  shipping_address_id INT NOT NULL,
  payment_method ENUM('credit_card', 'google_pay', 'cash_on_delivery') NOT NULL,
  shipping_method INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (shipping_address_id) REFERENCES customer_addresses(id),
  FOREIGN KEY (shipping_method) REFERENCES shipping_methods(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE customer_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  is_default TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
*/
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

// Enhanced CORS configuration for Flutter app
const corsOptions = {
  origin: ['http://localhost:3000', 'http://10.0.2.2:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

// MySQL Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password if you have one
  database: 'dedicated_economic_center',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
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
    
    // Create products table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Create customer table
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Create order table
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
        FOREIGN KEY (address_id) REFERENCES customer_address(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Create order_item table with proper foreign key constraints
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_item (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES \`order\`(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Create payment table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payment (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        card_number VARCHAR(32),
        card_expiry VARCHAR(10),
        card_cvv VARCHAR(10),
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES \`order\`(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    connection.release();
    console.log('Payment system database tables initialized');
  } catch (error) {
    console.error('Payment database initialization error:', error);
    throw error;
  }
}

// Initialize database when starting the server
initializeDatabase().then(() => {
  console.log('Database initialization complete');
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
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
      timestamp: new Date(),
      server: 'Payment API Server',
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'ERROR',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date()
    });
  }
});

// Order endpoint
app.post('/api/orders', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Request body is empty' 
      });
    }

    const { customerInfo, shippingMethod, paymentMethod, cartItems, subtotal, shipping, tax, total } = req.body;

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

    // Create the order
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

      // Update product stock if products table exists
      try {
        await connection.query(
          'UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
          [item.quantity, item.product.id, item.quantity]
        );
      } catch (updateError) {
        console.warn('Could not update product stock - products table might not exist:', updateError.message);
      }
    }

    await connection.commit();

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

// Enhanced payment endpoint with better error handling
app.post('/api/payments', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    console.log('Processing payment request...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    if (!req.body || Object.keys(req.body).length === 0) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false,
        error: 'Request body is empty',
        timestamp: new Date()
      });
    }

    const { customerInfo, shippingMethod, paymentMethod, cartItems, subtotal, shipping, tax, total, cardDetails } = req.body;

    // Enhanced validation
    const missingFields = [];
    if (!customerInfo) missingFields.push('customerInfo');
    if (!shippingMethod) missingFields.push('shippingMethod');
    if (!paymentMethod) missingFields.push('paymentMethod');
    if (!cartItems || cartItems.length === 0) missingFields.push('cartItems');
    if (subtotal === undefined || subtotal === null) missingFields.push('subtotal');
    if (shipping === undefined || shipping === null) missingFields.push('shipping');
    if (tax === undefined || tax === null) missingFields.push('tax');
    if (total === undefined || total === null) missingFields.push('total');

    if (missingFields.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields: missingFields,
        timestamp: new Date()
      });
    }

    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address || !customerInfo.city || !customerInfo.zipCode) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        error: 'Incomplete customer information',
        details: 'All customer fields (name, email, address, city, zipCode) are required',
        timestamp: new Date()
      });
    }

    // Check if customer exists or create new one
    let [customer] = await connection.query(
      'SELECT id FROM customer WHERE email = ?',
      [customerInfo.email]
    );

    let customerId;
    if (customer.length === 0) {
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

    // Create the order
    const [order] = await connection.query(
      `INSERT INTO \`order\` (
        customer_id, 
        address_id, 
        payment_method, 
        shipping_method, 
        subtotal, 
        shipping_cost, 
        tax, 
        total,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
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

    // Insert order items with proper error handling
    for (const item of cartItems) {
      if (!item.product || !item.product.id || !item.quantity || !item.product.price) {
        throw new Error(`Invalid cart item data: ${JSON.stringify(item)}`);
      }

      // Check if product exists before inserting order item
      const [productCheck] = await connection.query(
        'SELECT id, quantity, name FROM products WHERE id = ?',
        [item.product.id]
      );

      if (productCheck.length === 0) {
        throw new Error(`Product with ID ${item.product.id} not found`);
      }

      const product = productCheck[0];
      
      // Check stock availability
      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`);
      }

      // Insert order item
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
          parseInt(item.quantity),
          parseFloat(item.product.price)
        ]
      );

      // Update product stock
      const [updateResult] = await connection.query(
        'UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
        [item.quantity, item.product.id, item.quantity]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error(`Failed to update stock for product "${product.name}". Insufficient quantity available.`);
      }

      console.log(`Order item created: Product ID ${item.product.id}, Quantity ${item.quantity}, Price ${item.product.price}`);
    }

    // Insert payment record
    let card_number = null, card_expiry = null, card_cvv = null;
    if (paymentMethod === 'credit_card' && cardDetails) {
      card_number = cardDetails.number ? cardDetails.number.replace(/\s/g, '').substring(cardDetails.number.replace(/\s/g, '').length - 4) : null;
      card_expiry = cardDetails.expiry || null;
      card_cvv = null; // Don't store CVV for security
    }

    const paymentStatus = paymentMethod === 'cash_on_delivery' ? 'pending' : 'completed';
    const orderStatus = paymentMethod === 'cash_on_delivery' ? 'confirmed' : 'completed';

    const [paymentResult] = await connection.query(
      `INSERT INTO payment (
        order_id, payment_method, card_number, card_expiry, card_cvv, amount, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        paymentMethod,
        card_number,
        card_expiry,
        card_cvv,
        parseFloat(total),
        paymentStatus
      ]
    );

    // Update order status
    await connection.query(
      'UPDATE `order` SET status = ? WHERE id = ?',
      [orderStatus, orderId]
    );

    await connection.commit();
    
    const responseData = {
      success: true,
      orderId: orderId,
      paymentId: paymentResult.insertId,
      message: 'Order and payment processed successfully',
      order: {
        id: orderId,
        customerId: customerId,
        total: parseFloat(total),
        paymentMethod: paymentMethod,
        status: orderStatus,
        paymentStatus: paymentStatus,
        itemCount: cartItems.length
      },
      timestamp: new Date()
    };

    console.log('Payment processed successfully:', responseData);
    res.status(201).json(responseData);

  } catch (error) {
    await connection.rollback();
    console.error('Payment processing error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date()
    });
  } finally {
    connection.release();
  }
});

// Add endpoint to get order details with order items
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    
    // Get order details
    const [orderResult] = await pool.query(`
      SELECT 
        o.*,
        c.name as customer_name,
        c.email as customer_email,
        ca.address,
        ca.city,
        ca.zip_code,
        p.payment_method,
        p.amount as payment_amount,
        p.status as payment_status,
        p.card_number,
        p.created_at as payment_date
      FROM \`order\` o
      LEFT JOIN customer c ON o.customer_id = c.id
      LEFT JOIN customer_address ca ON o.address_id = ca.id
      LEFT JOIN payment p ON o.id = p.order_id
      WHERE o.id = ?
    `, [orderId]);

    if (orderResult.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get order items with product details
    const [orderItems] = await pool.query(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.description as product_description,
        p.image_url,
        p.category,
        u.name as farmer_name
      FROM order_item oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN users u ON p.farmer_id = u.id
      WHERE oi.order_id = ?
      ORDER BY oi.id
    `, [orderId]);

    // Calculate order totals from items
    const itemsTotal = orderItems.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)), 0);

    res.json({
      success: true,
      order: {
        ...orderResult[0],
        items: orderItems,
        itemsTotal: itemsTotal,
        itemCount: orderItems.length
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Add endpoint to get all orders with basic info
app.get('/api/orders', async (req, res) => {
  try {
    const customerId = req.query.customer_id;
    
    let sql = `
      SELECT 
        o.id,
        o.order_date,
        o.status,
        o.total,
        o.payment_method,
        c.name as customer_name,
        c.email as customer_email,
        COUNT(oi.id) as item_count
      FROM \`order\` o
      LEFT JOIN customer c ON o.customer_id = c.id
      LEFT JOIN order_item oi ON o.id = oi.order_id
    `;
    
    let params = [];
    
    if (customerId) {
      sql += ' WHERE o.customer_id = ?';
      params.push(parseInt(customerId));
    }
    
    sql += ' GROUP BY o.id ORDER BY o.created_at DESC';
    
    const [orders] = await pool.query(sql, params);
    
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message
    });
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
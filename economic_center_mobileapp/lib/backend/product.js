const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(uploadsDir));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dedicated_economic_center'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
  
  // Check and add missing columns
  checkAndAddColumns();
});

// Function to check and add missing columns
function checkAndAddColumns() {
  // Check if unit column exists
  db.query(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'dedicated_economic_center' 
    AND TABLE_NAME = 'products' 
    AND COLUMN_NAME = 'unit'
  `, (err, results) => {
    if (err) {
      console.error('Error checking unit column:', err);
      return;
    }
    
    if (results.length === 0) {
      // Add unit column if it doesn't exist
      db.query(`ALTER TABLE products ADD COLUMN unit VARCHAR(20) DEFAULT 'kg'`, (err) => {
        if (err) {
          console.error('Error adding unit column:', err);
        } else {
          console.log('Unit column added successfully');
        }
      });
    }
  });
  
  // Check if status column exists
  db.query(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'dedicated_economic_center' 
    AND TABLE_NAME = 'products' 
    AND COLUMN_NAME = 'status'
  `, (err, results) => {
    if (err) {
      console.error('Error checking status column:', err);
      return;
    }
    
    if (results.length === 0) {
      // Add status column if it doesn't exist
      db.query(`ALTER TABLE products ADD COLUMN status VARCHAR(20) DEFAULT 'active'`, (err) => {
        if (err) {
          console.error('Error adding status column:', err);
        } else {
          console.log('Status column added successfully');
        }
      });
    }
  });
}

// Multer for multiple images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage: storage });

// Product upload endpoint
app.post('/api/products/upload', upload.array('images', 5), (req, res) => {
  try {
    const {
      farmer_id,
      name,
      description,
      price,
      quantity,
      category,
      lat,
      lng,
      address,
      unit,
      status
    } = req.body;

    // Debug logging
    console.log('Upload request body:', req.body);
    console.log('Upload files:', req.files);

    if (!farmer_id || !name || !price || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let image_url = null;
    if (req.files && req.files.length > 0) {
      image_url = `uploads/${req.files[0].filename}`; // Remove http://localhost:5001/ prefix for mobile app
    }

    // First, check which columns exist
    db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'dedicated_economic_center' 
      AND TABLE_NAME = 'products'
    `, (err, columns) => {
      if (err) {
        console.error('Error checking columns:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const columnNames = columns.map(col => col.COLUMN_NAME);
      const hasUnit = columnNames.includes('unit');
      const hasStatus = columnNames.includes('status');

      let sql = `
        INSERT INTO products
        (farmer_id, name, description, price, quantity, category, image_url, lat, lng, address${hasUnit ? ', unit' : ''}${hasStatus ? ', status' : ''})
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?${hasUnit ? ', ?' : ''}${hasStatus ? ', ?' : ''})
      `;

      const values = [
        parseInt(farmer_id),
        name,
        description || null,
        parseFloat(price),
        parseInt(quantity),
        category || null,
        image_url,
        lat ? parseFloat(lat) : null,
        lng ? parseFloat(lng) : null,
        address || null
      ];

      if (hasUnit) values.push(unit || 'kg');
      if (hasStatus) values.push(status || 'active');

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        res.json({ success: true, productId: result.insertId });
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Product update endpoint - FIXED to check for existing columns
app.put('/api/products/:id', upload.array('images', 5), (req, res) => {
  try {
    const productId = req.params.id;
    
    // Debug logging
    console.log('Update request body:', req.body);
    console.log('Update files:', req.files);
    console.log('Product ID:', productId);

    // Safely destructure with default values
    const name = req.body.name || '';
    const description = req.body.description || '';
    const price = req.body.price || 0;
    const quantity = req.body.quantity || 0;
    const category = req.body.category || '';
    const lat = req.body.lat || null;
    const lng = req.body.lng || null;
    const address = req.body.address || '';
    const unit = req.body.unit || 'kg';
    const status = req.body.status || 'active';

    // Handle image URL
    let image_url = req.body.image_url || null;
    if (req.files && req.files.length > 0) {
      image_url = `uploads/${req.files[0].filename}`; // Remove http://localhost:5001/ prefix for mobile app
    }

    // Validate required fields
    if (!name || !price || !quantity) {
      return res.status(400).json({ error: 'Missing required fields: name, price, or quantity' });
    }

    // First, check which columns exist
    db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'dedicated_economic_center' 
      AND TABLE_NAME = 'products'
    `, (err, columns) => {
      if (err) {
        console.error('Error checking columns:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const columnNames = columns.map(col => col.COLUMN_NAME);
      const hasUnit = columnNames.includes('unit');
      const hasStatus = columnNames.includes('status');

      let sql = `
        UPDATE products SET
          name = ?,
          description = ?,
          price = ?,
          quantity = ?,
          category = ?,
          image_url = ?,
          lat = ?,
          lng = ?,
          address = ?
      `;

      const values = [
        name,
        description,
        parseFloat(price),
        parseInt(quantity),
        category,
        image_url,
        lat ? parseFloat(lat) : null,
        lng ? parseFloat(lng) : null,
        address
      ];

      if (hasUnit) {
        sql += ', unit = ?';
        values.push(unit);
      }

      if (hasStatus) {
        sql += ', status = ?';
        values.push(status);
      }

      sql += ' WHERE id = ?';
      values.push(parseInt(productId));

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Update error:', err);
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        console.log('Update successful, affected rows:', result.affectedRows);
        res.json({ success: true, affectedRows: result.affectedRows });
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Product upload endpoint for multiple products - UPDATED to not handle farmer_name
app.post('/api/products/multiple', upload.array('images'), (req, res) => {
  try {
    const { products } = req.body;
    console.log('Multiple products request:', { products, filesCount: req.files?.length });
    
    if (!products) {
      return res.status(400).json({ error: 'No products data provided' });
    }
    
    let productsData;
    try {
      productsData = typeof products === 'string' ? JSON.parse(products) : products;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid products data format' });
    }
    
    if (!Array.isArray(productsData) || productsData.length === 0) {
      return res.status(400).json({ error: 'Products must be a non-empty array' });
    }
    
    if (!req.files || req.files.length !== productsData.length) {
      return res.status(400).json({ 
        error: `Number of images (${req.files?.length || 0}) must match number of products (${productsData.length})` 
      });
    }

    // Check which columns exist (excluding farmer_name since we'll get it from users table)
    db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'dedicated_economic_center' 
      AND TABLE_NAME = 'products'
    `, (err, columns) => {
      if (err) {
        console.error('Error checking columns:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const columnNames = columns.map(col => col.COLUMN_NAME);
      const hasUnit = columnNames.includes('unit');
      const hasStatus = columnNames.includes('status');

      const insertPromises = productsData.map((product, index) => {
        return new Promise((resolve, reject) => {
          const {
            name,
            price,
            quantity,
            category,
            description,
            farmer_id,
            address
          } = product;

          // Validate required fields
          if (!name || !price || !quantity || !farmer_id) {
            reject(new Error(`Missing required fields for product ${index + 1}`));
            return;
          }

          const image_url = req.files[index] 
            ? `uploads/${req.files[index].filename}`
            : null;

          let sql = `
            INSERT INTO products
            (farmer_id, name, description, price, quantity, category, image_url, address${hasUnit ? ', unit' : ''}${hasStatus ? ', status' : ''})
            VALUES (?, ?, ?, ?, ?, ?, ?, ?${hasUnit ? ', ?' : ''}${hasStatus ? ', ?' : ''})
          `;

          const values = [
            parseInt(farmer_id),
            name,
            description || null,
            parseFloat(price),
            parseInt(quantity),
            category || null,
            image_url,
            address || null
          ];

          if (hasUnit) values.push('kg');
          if (hasStatus) values.push('active');

          db.query(sql, values, (err, result) => {
            if (err) {
              console.error(`Insert error for product ${index + 1}:`, err);
              reject(err);
            } else {
              resolve({ productId: result.insertId, name });
            }
          });
        });
      });

      Promise.all(insertPromises)
        .then(results => {
          res.status(201).json({
            success: true,
            message: `Successfully uploaded ${results.length} product(s)`,
            products: results
          });
        })
        .catch(error => {
          console.error('Multiple insert error:', error);
          res.status(500).json({ 
            error: 'Failed to upload products: ' + error.message 
          });
        });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// GET endpoint to fetch products with farmer names from users table
app.get('/api/products', (req, res) => {
  const farmer_id = req.query.farmer_id;
  
  // First check which columns exist in products table
  db.query(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'dedicated_economic_center' 
    AND TABLE_NAME = 'products'
  `, (err, columns) => {
    if (err) {
      console.error('Error checking columns:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const columnNames = columns.map(col => col.COLUMN_NAME);
    const hasUnit = columnNames.includes('unit');
    const hasStatus = columnNames.includes('status');

    // Use JOIN to get farmer name from users table
    let sql = `
      SELECT 
        p.id, p.farmer_id, p.name, p.description, p.price, p.quantity, p.category, 
        p.image_url, p.lat, p.lng, p.address, p.created_at,
        u.name as farmer_name
        ${hasUnit ? ', p.unit' : ''}
        ${hasStatus ? ', p.status' : ''}
      FROM products p
      LEFT JOIN users u ON p.farmer_id = u.id
    `;
    
    let params = [];
    
    if (farmer_id) {
      sql += ' WHERE p.farmer_id = ? ORDER BY p.created_at DESC';
      params.push(parseInt(farmer_id));
    } else {
      sql += ' ORDER BY p.created_at DESC';
    }
    
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('Fetch error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Add default values for missing columns and ensure farmer_name is available
      const productsWithDefaults = results.map(product => ({
        ...product,
        unit: hasUnit ? product.unit : 'kg',
        status: hasStatus ? product.status : 'active',
        farmer_name: product.farmer_name || 'Unknown Farmer' // Fallback if user not found
      }));
      
      res.json(productsWithDefaults);
    });
  });
});

// GET single product by ID with farmer name and reviews
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  
  // First get the product with farmer name
  const productSql = `
    SELECT 
      p.*, 
      u.name as farmer_name
    FROM products p
    LEFT JOIN users u ON p.farmer_id = u.id
    WHERE p.id = ?
  `;
  
  db.query(productSql, [parseInt(productId)], (err, productResults) => {
    if (err) {
      console.error('Fetch product error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (productResults.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Get reviews for this product
    const reviewsSql = `
      SELECT id, username, rating, comment, created_at
      FROM product_reviews
      WHERE product_id = ?
      ORDER BY created_at DESC
    `;
    
    db.query(reviewsSql, [parseInt(productId)], (err, reviewResults) => {
      if (err) {
        console.error('Fetch reviews error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Format reviews with proper date formatting
      const reviews = reviewResults.map(review => ({
        ...review,
        date: new Date(review.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }));
      
      // Calculate average rating
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;
      
      const product = {
        ...productResults[0],
        farmer_name: productResults[0].farmer_name || 'Unknown Farmer',
        reviews: reviews,
        rating: avgRating
      };
      
      res.json(product);
    });
  });
});

// POST endpoint to add a product review
app.post('/api/products/:id/reviews', (req, res) => {
  const productId = req.params.id;
  const { username, rating, comment } = req.body;
  
  // Validate input
  if (!username || !rating || !comment) {
    return res.status(400).json({ error: 'Username, rating, and comment are required' });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  // Check if product exists
  const checkProductSql = 'SELECT id FROM products WHERE id = ?';
  
  db.query(checkProductSql, [parseInt(productId)], (err, results) => {
    if (err) {
      console.error('Check product error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Insert review
    const insertSql = `
      INSERT INTO product_reviews (product_id, username, rating, comment)
      VALUES (?, ?, ?, ?)
    `;
    
    db.query(insertSql, [parseInt(productId), username, parseInt(rating), comment], (err, result) => {
      if (err) {
        console.error('Insert review error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Get the newly created review
      const getReviewSql = 'SELECT * FROM product_reviews WHERE id = ?';
      
      db.query(getReviewSql, [result.insertId], (err, reviewResults) => {
        if (err) {
          console.error('Get new review error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        const newReview = {
          ...reviewResults[0],
          date: new Date(reviewResults[0].created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        };
        
        res.status(201).json({
          success: true,
          message: 'Review added successfully',
          review: newReview
        });
      });
    });
  });
});

// GET endpoint to fetch all reviews for a product
app.get('/api/products/:id/reviews', (req, res) => {
  const productId = req.params.id;
  
  const sql = `
    SELECT id, username, rating, comment, created_at
    FROM product_reviews
    WHERE product_id = ?
    ORDER BY created_at DESC
  `;
  
  db.query(sql, [parseInt(productId)], (err, results) => {
    if (err) {
      console.error('Fetch reviews error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    const reviews = results.map(review => ({
      ...review,
      date: new Date(review.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }));
    
    res.json(reviews);
  });
});

// DELETE endpoint to remove a review (optional - for moderation)
app.delete('/api/products/:productId/reviews/:reviewId', (req, res) => {
  const { productId, reviewId } = req.params;
  
  const sql = 'DELETE FROM product_reviews WHERE id = ? AND product_id = ?';
  
  db.query(sql, [parseInt(reviewId), parseInt(productId)], (err, result) => {
    if (err) {
      console.error('Delete review error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ success: true, message: 'Review deleted successfully' });
  });
});

// DELETE endpoint for products
// DELETE endpoint for products (Already exists, but here's the enhanced version)
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  
  // First, get the product to delete its image file
  const selectSql = 'SELECT image_url FROM products WHERE id = ?';
  
  db.query(selectSql, [parseInt(productId)], (err, results) => {
    if (err) {
      console.error('Select error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Extract filename from URL if exists
    const imageUrl = results[0].image_url;
    if (imageUrl) {
      const filename = imageUrl.split('/').pop();
      const filepath = path.join(uploadsDir, filename);
      
      // Delete the file if it exists
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log('Deleted image file:', filename);
      }
    }
    
    // Now delete the product from database
    const deleteSql = 'DELETE FROM products WHERE id = ?';
    
    db.query(deleteSql, [parseInt(productId)], (err, result) => {
      if (err) {
        console.error('Delete error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ success: true, affectedRows: result.affectedRows });
    });
  });
});

// Update product status endpoint
app.patch('/api/products/:id/status', (req, res) => {
  const productId = req.params.id;
  const { status } = req.body;
  
  if (!status || !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  // Check if status column exists
  db.query(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'dedicated_economic_center' 
    AND TABLE_NAME = 'products' 
    AND COLUMN_NAME = 'status'
  `, (err, results) => {
    if (err) {
      console.error('Error checking status column:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(400).json({ error: 'Status column does not exist in database' });
    }

    const sql = 'UPDATE products SET status = ? WHERE id = ?';
    
    db.query(sql, [status, parseInt(productId)], (err, result) => {
      if (err) {
        console.error('Status update error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ success: true, affectedRows: result.affectedRows });
    });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

// Cart endpoints

// GET all cart items with product details - Updated to handle user_id
app.get('/api/cart', (req, res) => {
  const user_id = req.query.user_id || null; // Optional user_id parameter
  
  let sql = `
    SELECT 
      c.id as cart_id, 
      c.user_id,
      c.quantity, 
      c.created_at as cart_created_at,
      p.id, 
      p.name, 
      p.description, 
      p.price, 
      p.quantity as stock_quantity, 
      p.category, 
      p.image_url, 
      p.farmer_id,
      u.name as farmer_name
    FROM cart_items c
    LEFT JOIN products p ON c.product_id = p.id
    LEFT JOIN users u ON p.farmer_id = u.id
  `;
  
  let params = [];
  
  if (user_id) {
    sql += ' WHERE c.user_id = ?';
    params.push(parseInt(user_id));
  } else {
    // For mobile app without user authentication, get items with null user_id
    sql += ' WHERE c.user_id IS NULL';
  }
  
  sql += ' ORDER BY c.created_at DESC';
  
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Fetch cart error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    
    res.json(results);
  });
});

// POST add item to cart - Updated to handle user_id
app.post('/api/cart', (req, res) => {
  const { productId, quantity, user_id = null } = req.body;
  
  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Product ID and valid quantity are required' });
  }
  
  // First check if product exists and has enough stock
  const checkProductSql = 'SELECT id, name, price, quantity as stock_quantity FROM products WHERE id = ?';
  
  db.query(checkProductSql, [parseInt(productId)], (err, productResults) => {
    if (err) {
      console.error('Check product error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    
    if (productResults.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = productResults[0];
    
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: `Only ${product.stock_quantity} items available in stock` });
    }
    
    // Check if item already exists in cart for this user (or null user)
    let checkCartSql, checkParams;
    if (user_id) {
      checkCartSql = 'SELECT id, quantity FROM cart_items WHERE product_id = ? AND user_id = ?';
      checkParams = [parseInt(productId), parseInt(user_id)];
    } else {
      checkCartSql = 'SELECT id, quantity FROM cart_items WHERE product_id = ? AND user_id IS NULL';
      checkParams = [parseInt(productId)];
    }
    
    db.query(checkCartSql, checkParams, (err, cartResults) => {
      if (err) {
        console.error('Check cart error:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      
      if (cartResults.length > 0) {
        // Item exists, update quantity
        const existingItem = cartResults[0];
        const newQuantity = existingItem.quantity + parseInt(quantity);
        
        if (newQuantity > product.stock_quantity) {
          return res.status(400).json({ 
            error: `Cannot add ${quantity} more items. Only ${product.stock_quantity - existingItem.quantity} more available` 
          });
        }
        
        const updateSql = 'UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        
        db.query(updateSql, [newQuantity, existingItem.id], (err, result) => {
          if (err) {
            console.error('Update cart error:', err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
          }
          
          // Return the updated cart item with product details
          const getUpdatedItemSql = `
            SELECT 
              c.id as cart_id, 
              c.user_id,
              c.quantity, 
              c.created_at as cart_created_at,
              p.id, 
              p.name, 
              p.description, 
              p.price, 
              p.quantity as stock_quantity, 
              p.category, 
              p.image_url, 
              p.farmer_id,
              u.name as farmer_name
            FROM cart_items c
            LEFT JOIN products p ON c.product_id = p.id
            LEFT JOIN users u ON p.farmer_id = u.id
            WHERE c.id = ?
          `;
          
          db.query(getUpdatedItemSql, [existingItem.id], (err, itemResults) => {
            if (err) {
              console.error('Get updated item error:', err);
              return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            
            res.json({
              success: true,
              message: 'Cart updated successfully',
              cartItem: itemResults[0]
            });
          });
        });
      } else {
        // Item doesn't exist, insert new
        const insertSql = 'INSERT INTO cart_items (product_id, quantity, user_id) VALUES (?, ?, ?)';
        
        db.query(insertSql, [parseInt(productId), parseInt(quantity), user_id], (err, result) => {
          if (err) {
            console.error('Insert cart error:', err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
          }
          
          // Return the new cart item with product details
          const getNewItemSql = `
            SELECT 
              c.id as cart_id, 
              c.user_id,
              c.quantity, 
              c.created_at as cart_created_at,
              p.id, 
              p.name, 
              p.description, 
              p.price, 
              p.quantity as stock_quantity, 
              p.category, 
              p.image_url, 
              p.farmer_id,
              u.name as farmer_name
            FROM cart_items c
            LEFT JOIN products p ON c.product_id = p.id
            LEFT JOIN users u ON p.farmer_id = u.id
            WHERE c.id = ?
          `;
          
          db.query(getNewItemSql, [result.insertId], (err, itemResults) => {
            if (err) {
              console.error('Get new item error:', err);
              return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            
            res.json({
              success: true,
              message: 'Item added to cart successfully',
              cartItem: itemResults[0]
            });
          });
        });
      }
    });
  });
});

// DELETE clear all cart items - Enhanced with user handling (MOVED BEFORE :id route)
app.delete('/api/cart/clear', (req, res) => {
  const { user_id = null } = req.query; // Get user_id from query params
  
  console.log(`Attempting to clear cart for user ${user_id || 'null'}`);
  
  let clearSql = 'DELETE FROM cart_items';
  let params = [];
  
  if (user_id) {
    clearSql += ' WHERE user_id = ?';
    params.push(parseInt(user_id));
  } else {
    clearSql += ' WHERE user_id IS NULL';
  }
  
  db.query(clearSql, params, (err, result) => {
    if (err) {
      console.error('Clear cart error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    
    console.log(`Cleared ${result.affectedRows} items from cart for user ${user_id || 'null'}`);
    res.json({
      success: true,
      message: 'Cart cleared successfully',
      deletedItems: result.affectedRows,
      user_id: user_id
    });
  });
});

// POST checkout - Enhanced with user handling (MOVED BEFORE :id route)
app.post('/api/cart/checkout', (req, res) => {
  const { user_id = null } = req.body;
  
  console.log(`Processing checkout for user ${user_id || 'null'}`);
  
  // Get all cart items with product details for this user
  let getCartSql = `
    SELECT 
      c.id as cart_id, 
      c.quantity, 
      p.id as product_id, 
      p.quantity as stock_quantity,
      p.name as product_name
    FROM cart_items c
    LEFT JOIN products p ON c.product_id = p.id
  `;
  
  let params = [];
  
  if (user_id) {
    getCartSql += ' WHERE c.user_id = ?';
    params.push(parseInt(user_id));
  } else {
    getCartSql += ' WHERE c.user_id IS NULL';
  }
  
  db.query(getCartSql, params, (err, cartItems) => {
    if (err) {
      console.error('Get cart for checkout error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Check stock availability for all items
    for (const item of cartItems) {
      if (item.quantity > item.stock_quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${item.product_name}. Only ${item.stock_quantity} available.` 
        });
      }
    }
    
    // Begin transaction to update product quantities and clear cart
    db.beginTransaction((err) => {
      if (err) {
        console.error('Transaction begin error:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      
      // Update product quantities
      const updatePromises = cartItems.map(item => {
        return new Promise((resolve, reject) => {
          const updateProductSql = 'UPDATE products SET quantity = quantity - ? WHERE id = ?';
          
          db.query(updateProductSql, [item.quantity, item.product_id], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      });
      
      Promise.all(updatePromises)
        .then(() => {
          // Clear cart after successful product updates
          let clearCartSql = 'DELETE FROM cart_items';
          let clearParams = [];
          
          if (user_id) {
            clearCartSql += ' WHERE user_id = ?';
            clearParams.push(parseInt(user_id));
          } else {
            clearCartSql += ' WHERE user_id IS NULL';
          }
          
          db.query(clearCartSql, clearParams, (err, result) => {
            if (err) {
              db.rollback(() => {
                console.error('Clear cart error:', err);
                res.status(500).json({ error: 'Database error during cart clearing: ' + err.message });
              });
              return;
            }
            
            console.log(`Checkout completed: cleared ${result.affectedRows} cart items for user ${user_id || 'null'}`);
            
            // Commit transaction
            db.commit((err) => {
              if (err) {
                db.rollback(() => {
                  console.error('Transaction commit error:', err);
                  res.status(500).json({ error: 'Database error during commit: ' + err.message });
                });
                return;
              }
              
              res.json({
                success: true,
                message: 'Checkout completed successfully',
                processedItems: cartItems.length,
                deletedCartItems: result.affectedRows,
                user_id: user_id
              });
            });
          });
        })
        .catch((error) => {
          db.rollback(() => {
            console.error('Product update error:', error);
            res.status(500).json({ error: 'Database error during product update: ' + error.message });
          });
        });
    });
  });
});

// PUT update cart item quantity - Enhanced error handling and fixed ID parsing
app.put('/api/cart/:id', (req, res) => {
  const cartItemId = req.params.id;
  const { quantity, user_id = null } = req.body;
  
  console.log(`Attempting to update cart item ${cartItemId} with quantity ${quantity} for user ${user_id || 'null'}`);
  
  // Validate cartItemId is a valid number
  const parsedCartItemId = parseInt(cartItemId);
  if (isNaN(parsedCartItemId) || parsedCartItemId <= 0) {
    console.error(`Invalid cart item ID: ${cartItemId}`);
    return res.status(400).json({ error: 'Invalid cart item ID' });
  }
  
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Valid quantity is required' });
  }
  
  // First check if cart item exists and get product info
  let checkSql = `
    SELECT c.id, c.product_id, c.user_id, p.quantity as stock_quantity 
    FROM cart_items c
    LEFT JOIN products p ON c.product_id = p.id
    WHERE c.id = ?
  `;
  
  let checkParams = [parsedCartItemId];
  
  // Add user verification if user_id is provided
  if (user_id && user_id !== 'null') {
    const parsedUserId = parseInt(user_id);
    if (!isNaN(parsedUserId)) {
      checkSql += ' AND c.user_id = ?';
      checkParams.push(parsedUserId);
    } else {
      checkSql += ' AND c.user_id IS NULL';
    }
  } else {
    checkSql += ' AND c.user_id IS NULL';
  }
  
  db.query(checkSql, checkParams, (err, results) => {
    if (err) {
      console.error('Check cart item error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Cart item not found or access denied' });
    }
    
    const cartItem = results[0];
    
    if (quantity > cartItem.stock_quantity) {
      return res.status(400).json({ 
        error: `Only ${cartItem.stock_quantity} items available in stock` 
      });
    }
    
    // Update quantity
    const updateSql = 'UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    
    db.query(updateSql, [parseInt(quantity), parsedCartItemId], (err, result) => {
      if (err) {
        console.error('Update cart item error:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      
      console.log(`Successfully updated cart item ${parsedCartItemId} quantity to ${quantity}`);
      
      res.json({
        success: true,
        message: 'Cart item updated successfully',
        affectedRows: result.affectedRows
      });
    });
  });
});

// DELETE remove item from cart - Enhanced with user verification and fixed ID parsing
app.delete('/api/cart/:id', (req, res) => {
  const cartItemId = req.params.id;
  const { user_id = null } = req.query; // Get user_id from query params
  
  console.log(`Attempting to delete cart item ${cartItemId} for user ${user_id || 'null'}`);
  
  // Validate cartItemId is a valid number
  const parsedCartItemId = parseInt(cartItemId);
  if (isNaN(parsedCartItemId) || parsedCartItemId <= 0) {
    console.error(`Invalid cart item ID: ${cartItemId}`);
    return res.status(400).json({ error: 'Invalid cart item ID' });
  }
  
  // First verify the cart item exists and belongs to the user
  let checkSql = 'SELECT id, user_id, product_id FROM cart_items WHERE id = ?';
  let checkParams = [parsedCartItemId];
  
  if (user_id && user_id !== 'null') {
    const parsedUserId = parseInt(user_id);
    if (!isNaN(parsedUserId)) {
      checkSql += ' AND user_id = ?';
      checkParams.push(parsedUserId);
    } else {
      checkSql += ' AND user_id IS NULL';
    }
  } else {
    checkSql += ' AND user_id IS NULL';
  }
  
  db.query(checkSql, checkParams, (err, results) => {
    if (err) {
      console.error('Check cart item before delete error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    
    if (results.length === 0) {
      console.log(`Cart item ${parsedCartItemId} not found or access denied`);
      return res.status(404).json({ error: 'Cart item not found or access denied' });
    }
    
    // Now delete the item
    const deleteSql = 'DELETE FROM cart_items WHERE id = ?';
    
    db.query(deleteSql, [parsedCartItemId], (err, result) => {
      if (err) {
        console.error('Delete cart item error:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      
      console.log(`Successfully deleted cart item ${parsedCartItemId}, affected rows: ${result.affectedRows}`);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      
      res.json({
        success: true,
        message: 'Item removed from cart successfully',
        deletedItemId: parsedCartItemId,
        affectedRows: result.affectedRows
      });
    });
  });
});
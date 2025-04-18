const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Replace with your MySQL password
  database: 'economic_center'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Configure storage for profile images
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/profiles';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
  }
});

// Configure storage for product images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/products';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, 'product-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadProfile = multer({ storage: profileStorage });
const uploadProduct = multer({ storage: productStorage });

// API Routes
// Upload profile image
app.post('/api/upload-profile', uploadProfile.single('profileImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({ 
    success: true, 
    filePath: `/uploads/profiles/${req.file.filename}`
  });
});

// Upload product images
app.post('/api/upload-products', uploadProduct.array('productImages', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  
  const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
  res.json({ 
    success: true, 
    filePaths: filePaths
  });
});

// Create/Update User Profile
app.post('/api/user-profile', (req, res) => {
  const { 
    username, 
    email, 
    age, 
    aboutMe, 
    address, 
    idNumber, 
    phoneNumber, 
    location, 
    workExperience, 
    facebookLink, 
    instagramLink,
    profileImagePath,
    isUpdate
  } = req.body;

  // Check if user already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0 && !isUpdate) {
      // User exists but not in update mode
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (results.length > 0) {
      // User exists, update profile
      const userId = results[0].id;
      const updateQuery = `
        UPDATE users 
        SET email = ?, age = ?, about_me = ?, address = ?, id_number = ?, 
            phone_number = ?, location = ?, work_experience = ?, 
            facebook_link = ?, instagram_link = ?, profile_image = ?
        WHERE id = ?
      `;
      
      db.query(
        updateQuery, 
        [email, age, aboutMe, address, idNumber, phoneNumber, location, workExperience, 
         facebookLink, instagramLink, profileImagePath, userId],
        (err, results) => {
          if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Failed to update user profile' });
          }
          
          res.json({ 
            success: true, 
            message: 'User profile updated successfully', 
            userId: userId 
          });
        }
      );
    } else {
      // Create new user
      const insertQuery = `
        INSERT INTO users 
        (username, email, age, about_me, address, id_number, phone_number, 
         location, work_experience, facebook_link, instagram_link, profile_image) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.query(
        insertQuery, 
        [username, email, age, aboutMe, address, idNumber, phoneNumber, 
         location, workExperience, facebookLink, instagramLink, profileImagePath],
        (err, results) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Failed to create user profile' });
          }
          
          res.json({ 
            success: true, 
            message: 'User profile created successfully', 
            userId: results.insertId 
          });
        }
      );
    }
  });
});

// Get User Profile by Username
app.get('/api/user-profile/:username', (req, res) => {
  const username = req.params.username;
  
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error querying user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      user: results[0] 
    });
  });
});

// Get all user profiles with their products
app.get('/api/all-profiles', (req, res) => {
  // First get all users
  db.query('SELECT * FROM users', (err, users) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (users.length === 0) {
      return res.json({ success: true, profiles: [] });
    }

    // Get products for all users
    const userIds = users.map(user => user.id);
    const placeholders = userIds.map(() => '?').join(',');

    db.query(
      `SELECT p.*, pi.image_path 
       FROM products p 
       LEFT JOIN product_images pi ON p.id = pi.product_id 
       WHERE p.user_id IN (${placeholders})`,
      userIds,
      (err, productResults) => {
        if (err) {
          console.error('Error fetching products:', err);
          return res.status(500).json({ error: 'Failed to fetch products' });
        }

        // Group products by user
        const usersWithProducts = users.map(user => {
          const products = productResults
            .filter(product => product.user_id === user.id)
            .reduce((acc, product) => {
              // Group product images together
              const existingProduct = acc.find(p => p.id === product.id);
              if (existingProduct) {
                if (product.image_path) {
                  existingProduct.images.push(product.image_path);
                }
              } else {
                acc.push({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  details: product.details,
                  images: product.image_path ? [product.image_path] : []
                });
              }
              return acc;
            }, []);

          return {
            ...user,
            products: products
          };
        });

        res.json({ 
          success: true, 
          profiles: usersWithProducts 
        });
      }
    );
  });
});

// Add/Update Product
app.post('/api/add-product', (req, res) => {
  const { 
    userId, 
    productId, 
    productName, 
    productPrice, 
    productDetails, 
    productImagePaths 
  } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  if (productId) {
    // Update existing product
    const updateQuery = `
      UPDATE products 
      SET name = ?, price = ?, details = ? 
      WHERE id = ? AND user_id = ?
    `;
    
    db.query(
      updateQuery, 
      [productName, productPrice, productDetails, productId, userId],
      (err, results) => {
        if (err) {
          console.error('Error updating product:', err);
          return res.status(500).json({ error: 'Failed to update product' });
        }
        
        // Handle product images if they exist
        if (productImagePaths && productImagePaths.length > 0) {
          // Delete existing product images
          db.query('DELETE FROM product_images WHERE product_id = ?', [productId], (err) => {
            if (err) {
              console.error('Error deleting old product images:', err);
            }
            
            // Insert new product images
            const imageValues = productImagePaths.map(path => [productId, path]);
            const imageInsertQuery = 'INSERT INTO product_images (product_id, image_path) VALUES ?';
            
            db.query(imageInsertQuery, [imageValues], (err) => {
              if (err) {
                console.error('Error adding product images:', err);
              }
              
              res.json({ 
                success: true, 
                message: 'Product updated successfully', 
                productId: productId 
              });
            });
          });
        } else {
          res.json({ 
            success: true, 
            message: 'Product updated successfully', 
            productId: productId 
          });
        }
      }
    );
  } else {
    // Add new product
    const insertQuery = `
      INSERT INTO products (user_id, name, price, details) 
      VALUES (?, ?, ?, ?)
    `;
    
    db.query(
      insertQuery, 
      [userId, productName, productPrice, productDetails],
      (err, results) => {
        if (err) {
          console.error('Error adding product:', err);
          return res.status(500).json({ error: 'Failed to add product' });
        }
        
        const newProductId = results.insertId;
        
        // Add product images if they exist
        if (productImagePaths && productImagePaths.length > 0) {
          const imageValues = productImagePaths.map(path => [newProductId, path]);
          const imageInsertQuery = 'INSERT INTO product_images (product_id, image_path) VALUES ?';
          
          db.query(imageInsertQuery, [imageValues], (err) => {
            if (err) {
              console.error('Error adding product images:', err);
              return res.status(500).json({ error: 'Failed to add product images' });
            }
            
            res.json({ 
              success: true, 
              message: 'Product added successfully', 
              productId: newProductId 
            });
          });
        } else {
          res.json({ 
            success: true, 
            message: 'Product added successfully', 
            productId: newProductId 
          });
        }
      }
    );
  }
});

// Get User Products
app.get('/api/user-products/:userId', (req, res) => {
  const userId = req.params.userId;
  
  // Get all products for the user
  db.query('SELECT * FROM products WHERE user_id = ?', [userId], (err, products) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (products.length === 0) {
      return res.json({ 
        success: true, 
        products: [] 
      });
    }
    
    // Get images for all products
    const productIds = products.map(product => product.id);
    const placeholders = productIds.map(() => '?').join(',');
    
    db.query(
      `SELECT product_id, image_path FROM product_images WHERE product_id IN (${placeholders})`,
      productIds,
      (err, imageResults) => {
        if (err) {
          console.error('Error fetching product images:', err);
          return res.status(500).json({ error: 'Failed to fetch product images' });
        }
        
        // Map images to their respective products
        const productsWithImages = products.map(product => {
          const images = imageResults
            .filter(img => img.product_id === product.id)
            .map(img => img.image_path);
          
          return {
            ...product,
            images: images
          };
        });
        
        res.json({ 
          success: true, 
          products: productsWithImages 
        });
      }
    );
  });
});

// Delete Product
app.delete('/api/delete-product/:productId', (req, res) => {
  const productId = req.params.productId;
  const userId = req.query.userId; // For security, ensure the user owns the product
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  // Verify product ownership
  db.query(
    'SELECT * FROM products WHERE id = ? AND user_id = ?',
    [productId, userId],
    (err, results) => {
      if (err) {
        console.error('Error verifying product ownership:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(403).json({ error: 'Unauthorized or product not found' });
      }
      
      // Delete product images first
      db.query('DELETE FROM product_images WHERE product_id = ?', [productId], (err) => {
        if (err) {
          console.error('Error deleting product images:', err);
          return res.status(500).json({ error: 'Failed to delete product images' });
        }
        
        // Then delete the product
        db.query('DELETE FROM products WHERE id = ?', [productId], (err) => {
          if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Failed to delete product' });
          }
          
          res.json({ 
            success: true, 
            message: 'Product deleted successfully' 
          });
        });
      });
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
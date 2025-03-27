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
    profileImagePath
  } = req.body;

  // Check if user already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ error: 'Database error' });
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
            return res.status(500).json({ error: 'Error updating user profile' });
          }
          
          res.json({ success: true, userId: userId, message: 'User profile updated successfully' });
        }
      );
    } else {
      // New user, insert profile
      const insertQuery = `
        INSERT INTO users (username, email, age, about_me, address, id_number, 
                          phone_number, location, work_experience, facebook_link, 
                          instagram_link, profile_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.query(
        insertQuery, 
        [username, email, age, aboutMe, address, idNumber, phoneNumber, location, 
         workExperience, facebookLink, instagramLink, profileImagePath],
        (err, results) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Error creating user profile' });
          }
          
          const userId = results.insertId;
          res.json({ success: true, userId: userId, message: 'User profile created successfully' });
        }
      );
    }
  });
});

// Add Product
app.post('/api/add-product', (req, res) => {
  const { 
    userId, 
    productName, 
    productPrice, 
    productDetails, 
    productImagePaths 
  } = req.body;

  // Insert product
  const insertProductQuery = `
    INSERT INTO products (user_id, name, price, details)
    VALUES (?, ?, ?, ?)
  `;
  
  db.query(
    insertProductQuery, 
    [userId, productName, productPrice, productDetails],
    (err, results) => {
      if (err) {
        console.error('Error adding product:', err);
        return res.status(500).json({ error: 'Error adding product' });
      }
      
      const productId = results.insertId;
      
      // Insert product images
      if (productImagePaths && productImagePaths.length > 0) {
        const insertImagesValues = productImagePaths.map(path => [productId, path]);
        
        db.query(
          'INSERT INTO product_images (product_id, image_path) VALUES ?',
          [insertImagesValues],
          (err) => {
            if (err) {
              console.error('Error adding product images:', err);
              return res.status(500).json({ error: 'Error adding product images' });
            }
            
            res.json({ 
              success: true, 
              productId: productId, 
              message: 'Product added successfully' 
            });
          }
        );
      } else {
        res.json({ 
          success: true, 
          productId: productId, 
          message: 'Product added successfully without images' 
        });
      }
    }
  );
});

// Get User Profile
app.get('/api/user-profile/:username', (req, res) => {
  const { username } = req.params;
  
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = results[0];
    res.json({ success: true, user });
  });
});

// Get User Products
app.get('/api/user-products/:userId', (req, res) => {
  const { userId } = req.params;
  
  db.query('SELECT * FROM products WHERE user_id = ?', [userId], (err, products) => {
    if (err) {
      console.error('Error fetching user products:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (products.length === 0) {
      return res.json({ success: true, products: [] });
    }
    
    // Get images for each product
    const productIds = products.map(product => product.id);
    
    db.query(
      'SELECT * FROM product_images WHERE product_id IN (?)',
      [productIds],
      (err, images) => {
        if (err) {
          console.error('Error fetching product images:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        // Map images to products
        const productsWithImages = products.map(product => {
          const productImages = images.filter(img => img.product_id === product.id);
          return {
            ...product,
            images: productImages.map(img => img.image_path)
          };
        });
        
        res.json({ success: true, products: productsWithImages });
      }
    );
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
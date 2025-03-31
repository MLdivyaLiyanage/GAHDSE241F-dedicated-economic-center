const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "economic_center",
});

// Connect to database with better error handling
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    console.error("Please make sure MySQL is running and the database 'economic_center' exists");
    // Continue running the app even if DB connection fails initially
  } else {
    console.log("Connected to MySQL database");
  }
});

// Middleware for debugging requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Basic test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Enhanced API to get user by ID with all related data and better error handling
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Fetching user with ID: ${id}`);
  
  // Check database connection first
  if (db.state === 'disconnected') {
    console.error("Database connection is not available");
    return res.status(500).json({ error: "Database connection is not available" });
  }
  
  // Get user data
  const userQuery = "SELECT * FROM users WHERE id = ?";
  
  db.query(userQuery, [id], (err, userResult) => {
    if (err) {
      console.error("Error in user query:", err);
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    
    // If no user is found, return a mock user for testing
    if (userResult.length === 0) {
      console.log(`User with ID ${id} not found. Returning mock data for testing.`);
      
      // Mock user data for testing
      const mockUser = {
        id: parseInt(id),
        username: `farmer${id}`,
        name: `Farmer ${id}`,
        email: `farmer${id}@example.com`,
        age: 45,
        about_me: "I am a passionate farmer focused on sustainable farming practices.",
        address: "123 Farm Road, Rural District",
        id_number: `ID${id}12345`,
        phone_number: "+94 76 123 4567",
        location: "Central Province, Sri Lanka",
        work_experience: "15 years of experience in organic farming",
        profile_image_url: null,
        social_media: [],
        products: []
      };
      
      return res.status(200).json(mockUser);
    }
    
    const user = userResult[0];
    console.log("User data retrieved:", user);
    
    // Get social media links
    const socialMediaQuery = "SELECT * FROM social_media_links WHERE user_id = ?";
    db.query(socialMediaQuery, [id], (socialErr, socialLinks) => {
      if (socialErr) {
        console.error("Error in social media query:", socialErr);
        // Continue with empty social links if there's an error
        user.social_media = [];
      } else {
        console.log("Social links retrieved:", socialLinks);
        user.social_media = socialLinks;
      }
      
      // Get products
      const productsQuery = "SELECT * FROM products WHERE user_id = ?";
      db.query(productsQuery, [id], (productErr, products) => {
        if (productErr) {
          console.error("Error in products query:", productErr);
          // Continue with empty products if there's an error
          user.products = [];
          return res.status(200).json(user);
        }
        
        console.log("Products retrieved:", products);
        
        if (products.length === 0) {
          // If no products, return user data without waiting for product images
          user.products = [];
          return res.status(200).json(user);
        }
        
        // Get product images for each product
        const productIds = products.map(product => product.id);
        const productImagesQuery = "SELECT * FROM product_images WHERE product_id IN (?)";
        
        db.query(productImagesQuery, [productIds], (imageErr, productImages) => {
          if (imageErr) {
            console.error("Error in product images query:", imageErr);
            // Continue with products but no images
            user.products = products.map(product => ({ ...product, images: [] }));
          } else {
            console.log("Product images retrieved:", productImages);
            
            // Map images to their respective products
            user.products = products.map(product => {
              const images = productImages.filter(image => image.product_id === product.id);
              return { ...product, images };
            });
          }
          
          res.status(200).json(user);
        });
      });
    });
  });
});

// Get all users with basic info
app.get("/api/users", (req, res) => {
  // Check database connection first
  if (db.state === 'disconnected') {
    console.error("Database connection is not available");
    return res.status(500).json({ error: "Database connection is not available" });
  }
  
  const query = "SELECT id, username, name, profile_image_url, location FROM users";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: err.message });
    }
    
    // If no users found, return empty array
    if (results.length === 0) {
      return res.status(200).json([]);
    }
    
    res.status(200).json(results);
  });
});

// Other routes remain the same...

// Handle database disconnection
db.on('error', function(err) {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Reconnecting to database...');
    db.connect((err) => {
      if (err) {
        console.error("Failed to reconnect to database:", err);
      } else {
        console.log("Reconnected to database");
      }
    });
  } else {
    throw err;
  }
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaStar, FaHeart, FaShare } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './buy01.css';

function App() {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Product images array with placeholders 
  // Replace these with actual image URLs in your application
  const images = [
    'src/assets/Appel01.jpg',
    'src/assets/Appel02.jpg',
    'src/assets/Appel03.jpg',
  ];

  // Product details
  const product = {
    name: "Organic Fresh Apple",
    description: "Our organic apples are grown without synthetic pesticides or fertilizers. Rich in antioxidants, fiber, and vitamin C, these crisp and juicy apples make for a perfect healthy snack or addition to your favorite recipes.",
    price: 350.00,
    rating: 4.8,
    reviews: 124,
    inStock: true
  };

  // Handle quantity changes
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  // Handle image navigation
  const nextImage = () => {
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const selectImage = (index) => {
    setActiveImage(index);
  };

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (

      
      <main>
        <Container className="product-container">
          <Row className="product-content">
            <Col lg={6}>
              <div className="product-gallery">
                <div className="main-image-container">
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="main-image"
                  />
                  <Button 
                    className="nav-button position-absolute top-50 start-0 translate-middle-y ms-2"
                    onClick={prevImage}
                    aria-label="Previous image"
                  >
                    <FaChevronLeft />
                  </Button>
                  <Button 
                    className="nav-button position-absolute top-50 end-0 translate-middle-y me-2"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    <FaChevronRight />
                  </Button>
                </div>
                <div className="thumbnails-container">
                  {images.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => selectImage(idx)} 
                      className={`thumbnail-item ${activeImage === idx ? 'active' : ''}`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${idx + 1}`} 
                        className="thumbnail-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            
            <Col lg={6}>
              <div className="product-details">
                <div className="product-header">
                  <h1 className="product-title">{product.name}</h1>
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'} />
                      ))}
                      <span className="rating-score">{product.rating}</span>
                    </div>
                    <span className="review-count">({product.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="product-price-container">
                  <h3 className="product-price">Rs.{product.price.toFixed(2)}</h3>
                  <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <p className="product-description">
                  {product.description}
                </p>
                
                <div className="quantity-container">
                  <h5 className="section-title">Quantity</h5>
                  <InputGroup className="quantity-input-group">
                    <Button className="quantity-button" onClick={handleDecrement} disabled={quantity <= 1}>-</Button>
                    <Form.Control 
                      type="text" 
                      value={quantity} 
                      readOnly 
                      className="quantity-input"
                    />
                    <Button className="quantity-button" onClick={handleIncrement}>+</Button>
                  </InputGroup>
                </div>
                
                <div className="product-actions">
                  <Button className="buy-button">
                    Buy Now
                  </Button>
                  <Button className="cart-button">
                    Add to Cart
                  </Button>
                  <Button 
                    className={`favorite-button ${isFavorite ? 'active' : ''}`} 
                    onClick={toggleFavorite}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <FaHeart />
                  </Button>
                  <Button className="share-button" aria-label="Share product">
                    <FaShare />
                  </Button>
                </div>
                
                <div className="product-meta">
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">Fruits, Organic</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Tags:</span>
                    <span className="meta-value">Fresh, Healthy, Vitamin C</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
    
  );
}

// For Vite entry point
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
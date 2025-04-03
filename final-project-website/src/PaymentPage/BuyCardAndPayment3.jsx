import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Card, Accordion } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaStar, FaHeart, FaShare, FaCreditCard, FaPaypal, FaApplePay, FaGooglePay } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './payment.css';
import axios from 'axios'; // Make sure to install axios with: npm install axios
import Swal from 'sweetalert2'; // Make sure to install sweetalert2 with: npm install sweetalert2

// Payment Status Alert Component
const PaymentStatusAlert = ({ isDataStored, orderNumber = "OR23451", onContinueShopping }) => {
  useEffect(() => {
    if (isDataStored) {
      // Success alert when data is stored in database
      Swal.fire({
        html: `
          <div style="text-align: center; font-family: Arial, sans-serif;">
            <div style="margin-bottom: 20px;">
              <div style="width: 80px; height: 80px; border-radius: 50%; background-color: rgba(72, 187, 120, 0.1); margin: 0 auto; display: flex; justify-content: center; align-items: center;">
                <svg style="width: 40px; height: 40px; color: #4BB543;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h2 style="color: #4a5568; font-size: 24px; margin-bottom: 15px; font-weight: 600;">Your payment was successful</h2>
            <p style="color: #718096; font-size: 16px; margin-bottom: 25px;">Thank you for your purchase. Your order #${orderNumber} has been confirmed.</p>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Continue Shopping',
        confirmButtonColor: '#4BB543',
        width: 400,
        padding: '30px',
        backdrop: `rgba(0,0,0,0.4)`,
        allowOutsideClick: false,
        showCloseButton: false
      }).then((result) => {
        // When user clicks the "Continue Shopping" button
        if (result.isConfirmed) {
          onContinueShopping(); // Call the passed function to navigate back to product page
        }
      });
    } else {
      // Error alert when data is not stored in database
      Swal.fire({
        html: `
          <div style="text-align: center; font-family: Arial, sans-serif;">
            <div style="margin-bottom: 20px;">
              <div style="width: 80px; height: 80px; border-radius: 50%; background-color: rgba(245, 101, 101, 0.1); margin: 0 auto; display: flex; justify-content: center; align-items: center;">
                <svg style="width: 40px; height: 40px; color: #f56565;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <h2 style="color: #4a5568; font-size: 24px; margin-bottom: 15px; font-weight: 600;">Payment unsuccessful</h2>
            <p style="color: #718096; font-size: 16px; margin-bottom: 25px;">We couldn't process your payment. Please try again.</p>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#f56565',
        width: 400,
        padding: '30px',
        backdrop: `rgba(0,0,0,0.4)`,
        allowOutsideClick: false,
        showCloseButton: false
      });
    }
  }, [isDataStored, orderNumber, onContinueShopping]);

  return null; // Component doesn't render anything directly
};

function App() {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: ''
  });
  const [product, setProduct] = useState({
    id: 1, // Default product ID
    name: "Amandine Potato",
    description: "Our organic apples are grown without synthetic pesticides or fertilizers. Rich in antioxidants, fiber, and vitamin C, these crisp and juicy apples make for a perfect healthy snack or addition to your favorite recipes.",
    price: 350.00,
    rating: 4.8,
    reviews: 124,
    inStock: true
  });
  const [images, setImages] = useState([
    'src/assets/potato1.jpg',
    'src/assets/potato2.jpg',
    'src/assets/potato3.jpg',
  ]);
  const [shippingOptions, setShippingOptions] = useState({
    standard: { name: 'Standard Delivery', price: 50.00, days: '3-5' },
    express: { name: 'Express Delivery', price: 100.00, days: '1-2' },
    free: { name: 'Free Delivery', price: 0.00, days: '5-7' }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderNumber, setOrderNumber] = useState("");

  const API_BASE_URL = 'http://localhost:3001/api';

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Fetch product details (using ID 1 as default)
        const productResponse = await axios.get(`${API_BASE_URL}/products/1`);
        if (productResponse.data) {
          setProduct({
            ...productResponse.data,
            price: parseFloat(productResponse.data.price),
            rating: parseFloat(productResponse.data.rating) || 4.8,
            reviews: parseInt(productResponse.data.reviews) || 124,
            inStock: productResponse.data.in_stock === 1
          });
          
          // If product images array exists, use it
          if (productResponse.data.images && productResponse.data.images.length > 0) {
            setImages(productResponse.data.images);
          }
        }
        
        // Fetch shipping options
        const shippingResponse = await axios.get(`${API_BASE_URL}/shipping-options`);
        if (shippingResponse.data) {
          setShippingOptions(shippingResponse.data);
          // Set default shipping method to the first option
          if (Object.keys(shippingResponse.data).length > 0) {
            setShippingMethod(Object.keys(shippingResponse.data)[0]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load product data. Using default values.");
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  // Price calculations
  const calculateSubtotal = () => product.price * quantity;
  const calculateShipping = () => shippingOptions[shippingMethod].price;
  const calculateTax = () => calculateSubtotal() * 0.05; // 5% tax
  const calculateTotal = () => calculateSubtotal() + calculateShipping() + calculateTax();

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

  // Handle buy now button
  const handleBuyNow = () => {
    setShowPayment(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle order submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare order data
      const orderData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        productId: product.id,
        quantity: quantity,
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod,
        unitPrice: product.price,
        subtotal: calculateSubtotal(),
        shippingCost: calculateShipping(),
        tax: calculateTax(),
        total: calculateTotal()
      };
      
      // Send order to backend
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
      
      if (response.status === 201) {
        // Set order number and payment success status
        setOrderNumber(response.data.orderId || "OR" + Math.floor(Math.random() * 100000));
        setPaymentStatus(true);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setPaymentStatus(false);
    }
  };

  // Handle back to product
  const handleBackToProduct = () => {
    setShowPayment(false);
  };

  // Function to handle continuing shopping after successful payment
  const handleContinueShopping = () => {
    // Reset all form data
    setFormData({
      name: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      cardNumber: '',
      cardExpiry: '',
      cardCVV: ''
    });
    
    // Reset other states
    setQuantity(1);
    setShowPayment(false);
    setPaymentStatus(null);
  };

  // Display loading state
  if (loading) {
    return (
      <Container className="text-center my-5">
        <h2>Loading product data...</h2>
      </Container>
    );
  }

  if (error) {
    console.warn(error); // Log the error but continue with default values
  }

  return (
    <main>
      <Container className="product-container">
        {!showPayment ? (
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
                  <Button className="buy-button" onClick={handleBuyNow}>
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
        ) : (
          <Row className="payment-content">
            <Col lg={8}>
              <div className="payment-section">
                <Button className="back-button mb-4" onClick={handleBackToProduct}>
                  <FaChevronLeft /> Back to Product
                </Button>
                <h2>Checkout</h2>
                
                <Form onSubmit={handleSubmitOrder}>
                  <Card className="mb-4">
                    <Card.Header>
                      <h4>Shipping Information</h4>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Zip Code</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                  
                  <Card className="mb-4">
                    <Card.Header>
                      <h4>Shipping Method</h4>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group>
                        {Object.entries(shippingOptions).map(([key, option]) => (
                          <Form.Check 
                            type="radio"
                            id={`shipping-${key}`}
                            label={`${option.name} (Rs.${option.price.toFixed(2)}) - ${option.days} days`}
                            name="shippingMethod"
                            value={key}
                            checked={shippingMethod === key}
                            onChange={() => setShippingMethod(key)}
                            className="mb-2"
                            key={key}
                          />
                        ))}
                      </Form.Group>
                    </Card.Body>
                  </Card>
                  
                  <Card className="mb-4">
                    <Card.Header>
                      <h4>Payment Method</h4>
                    </Card.Header>
                    <Card.Body>
                      <div className="payment-methods mb-4">
                        <Button 
                          className={`payment-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('card')}
                        >
                          
                          <FaCreditCard /> Credit Card
                        </Button>
                        <Button 
                          className={`payment-method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('paypal')}
                        >
                          <FaPaypal /> PayPal
                        </Button>
                        <Button 
                          className={`payment-method-btn ${paymentMethod === 'applepay' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('applepay')}
                        >
                          <FaApplePay /> Apple Pay
                        </Button>
                        <Button 
                          className={`payment-method-btn ${paymentMethod === 'googlepay' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('googlepay')}
                        >
                          <FaGooglePay /> Google Pay
                        </Button>
                      </div>
                      
                      {paymentMethod === 'card' && (
                        <div className="card-details">
                          <Row>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label>Card Number</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  name="cardNumber"
                                  value={formData.cardNumber}
                                  onChange={handleInputChange}
                                  placeholder="1234 5678 9012 3456"
                                  required
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Expiration Date</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  name="cardExpiry"
                                  value={formData.cardExpiry}
                                  onChange={handleInputChange}
                                  placeholder="MM/YY"
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>CVV</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  name="cardCVV"
                                  value={formData.cardCVV}
                                  onChange={handleInputChange}
                                  placeholder="123"
                                  required
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                  
                  <Button type="submit" className="place-order-btn">
                    Place Order
                  </Button>
                </Form>
              </div>
            </Col>
            
            <Col lg={4}>
              <div className="order-summary">
                <Card>
                  <Card.Header>
                    <h4>Order Summary</h4>
                  </Card.Header>
                  <Card.Body>
                    <div className="summary-item">
                      <span>Product:</span>
                      <span>{product.name}</span>
                    </div>
                    <div className="summary-item">
                      <span>Quantity:</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="summary-item">
                      <span>Price per unit:</span>
                      <span>Rs.{product.price.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="summary-item">
                      <span>Subtotal:</span>
                      <span>Rs.{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                      <span>Shipping:</span>
                      <span>Rs.{calculateShipping().toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                      <span>Tax (5%):</span>
                      <span>Rs.{calculateTax().toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="summary-total">
                      <span>Total:</span>
                      <span>Rs.{calculateTotal().toFixed(2)}</span>
                    </div>
                  </Card.Body>
                </Card>
                
                <Card className="mt-4">
                  <Card.Header>
                    <h4>Need Help?</h4>
                  </Card.Header>
                  <Card.Body>
                    <Accordion>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Shipping Policy</Accordion.Header>
                        <Accordion.Body>
                          We ship to all major cities. Standard delivery takes 3-5 business days. Express delivery is available for urgent orders.
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1">
                        <Accordion.Header>Return Policy</Accordion.Header>
                        <Accordion.Body>
                          You can return the product within 7 days of delivery if you&apos;re not satisfied with the quality.
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="2">
                        <Accordion.Header>Payment Options</Accordion.Header>
                        <Accordion.Body>
                          We accept all major credit cards, PayPal, Apple Pay, and Google Pay. Your payment information is secure with us.
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </Container>
      
      {/* Payment Status Alert Component with onContinueShopping prop */}
      {paymentStatus !== null && (
        <PaymentStatusAlert 
          isDataStored={paymentStatus} 
          orderNumber={orderNumber}
          onContinueShopping={handleContinueShopping} 
        />
      )}
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

import React, { useState } from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// ========== Styled Components ==========
const GlobalStyle = styled.div`
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
`;

const AppWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('src/assets/backimg2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding: 20px 0;
`;

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 1rem 0;
  
  .header {
    margin-bottom: 2rem;
    
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
    
    p {
      font-size: 1.2rem;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }
  }

  .slider {
    margin: 0 auto;
    position: relative;
    height: var(--height);
    width: var(--width);
    display: flex;
    perspective: 1000px;
    transform-style: preserve-3d;
    margin-bottom: 3rem;
  }

  .list {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  .item {
    position: absolute;
    width: 100%;
    height: 100%;
    --r: calc(var(--position) - 1);
    --abs: max(var(--r), calc(-1 * var(--r)));
    transition: all 0.25s linear;
    transform: rotateY(calc(-10deg * var(--r))) translateX(calc(-300px * var(--r)));
    z-index: calc((var(--position) - var(--abs)));
  }

  .item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  .item-name {
    position: absolute;
    bottom: -25px;
    width: 100%;
    text-align: center;
    color: white;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  }

  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    padding: 0 20px;
    margin-bottom: 40px;
  }

  .card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .image-container {
    position: relative;
    height: 200px;
  }

  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .price {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #4CAF50;
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-weight: bold;
  }

  .content {
    padding: 15px;
  }

  .product-name {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  .description {
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .button-container {
    display: flex;
    gap: 10px;
    margin-top: 1rem;
    padding: 0 15px 15px;
  }

  .view-details, .add-to-cart {
    font-size: 14px;
    padding: 8px 15px;
    border-radius: 50px;
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .view-details {
    background: #6c757d;
    color: white;
  }

  .add-to-cart {
    background: #4CAF50;
    color: white;
  }

  .view-details:hover, .add-to-cart:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .view-details:active, .add-to-cart:active {
    transform: translateY(0);
  }

  .rating {
    color: #ff9529;
    font-size: 14px;
    margin: 8px 0;
  }
`;

const CartSidebar = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-400px'};
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  
  @media (max-width: 576px) {
    width: 100%;
    right: ${props => props.isOpen ? '0' : '-100%'};
  }
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const CartItems = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const EmptyCart = styled.div`
  text-align: center;
  color: #666;
  padding: 40px 0;
`;

const CartItem = styled.div`
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f5f5f5;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
`;

const ItemPrice = styled.div`
  color: #4CAF50;
  font-weight: 600;
  margin-bottom: 10px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.button`
  width: 25px;
  height: 25px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const Quantity = styled.span`
  min-width: 20px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 1.2rem;
  cursor: pointer;
  align-self: flex-start;
`;

const CartFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #eee;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #3e8e41;
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

// ========== Context & Providers ==========
const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (parseFloat(item.price.replace('$', '')) * item.quantity,
    0
  ),0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ========== Components ==========
const ShoppingCart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity,
    cartTotal,
    isCartOpen,
    setIsCartOpen
  } = React.useContext(CartContext);

  return (
    <CartSidebar isOpen={isCartOpen}>
      <CartHeader>
        <h3>Your Cart</h3>
        <CloseButton onClick={() => setIsCartOpen(false)}>×</CloseButton>
      </CartHeader>
      
      <CartItems>
        {cartItems.length === 0 ? (
          <EmptyCart>Your cart is empty</EmptyCart>
        ) : (
          cartItems.map(item => (
            <CartItem key={item.id}>
              <ItemImage src={item.image} alt={item.name} />
              <ItemDetails>
                <ItemName>{item.name}</ItemName>
                <ItemPrice>{item.price}</ItemPrice>
                <QuantityControls>
                  <QuantityButton 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </QuantityButton>
                  <Quantity>{item.quantity}</Quantity>
                  <QuantityButton 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </QuantityButton>
                </QuantityControls>
              </ItemDetails>
              <RemoveButton onClick={() => removeFromCart(item.id)}>
                ×
              </RemoveButton>
            </CartItem>
          ))
        )}
      </CartItems>
      
      <CartFooter>
        <Total>
          <span>Total:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </Total>
        <CheckoutButton disabled={cartItems.length === 0}>
          Proceed to Checkout
        </CheckoutButton>
      </CartFooter>
    </CartSidebar>
  );
};

const FoodSlider = () => {
  const navigate = useNavigate();
  const { addToCart } = React.useContext(CartContext);

  const foodItems = [
    { 
      id: 1, 
      name: "Bell pepper",
      image: "src/assets/bellpepper1.jpg", 
      price: "$49.9",
      path: "/bellpepper",
      description: "Fresh organic bell peppers",
      rating: 4.8,
      reviews: 124
    },
    { 
      id: 2, 
      name: "Tomatoes",
      image: "src/assets/tomato.jpg", 
      price: "$29.9",
      path: "/tomatoes",
      description: "Juicy red tomatoes",
      rating: 4.6,
      reviews: 98
    },
    { 
      id: 3, 
      name: "Broccoli",
      image: "src/assets/broccoli.jpg", 
      price: "$19.9",
      path: "/broccoli",
      description: "Fresh green broccoli",
      rating: 4.5,
      reviews: 87
    },
    { 
      id: 4, 
      name: "Carrots",
      image: "src/assets/carrot.jpg", 
      price: "$15.9",
      path: "/carrots",
      description: "Sweet organic carrots",
      rating: 4.7,
      reviews: 105
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <StyledWrapper>
      <div className="header">
        <h1 className="text-center text-white mb-4">Fresh Organic Produce</h1>
        <p className="text-center text-white mb-5">Discover our premium selection of farm-fresh vegetables and fruits</p>
      </div>

      <div className="slider" style={{ '--width': '200px', '--height': '200px', '--quantity': foodItems.length }}>
        <div className="list">
          {foodItems.map((item, index) => (
            <div className="item" key={item.id} style={{ '--position': index + 1 }}>
              <img src={item.image} alt={`${item.name}`} />
              <div className="item-name">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cards-container">
        {foodItems.map((item) => (
          <div className="card" key={item.id} onClick={() => handleCardClick(item.path)}>
            <div className="image-container">
              <img src={item.image} alt={`${item.name}`} className="image" />
              <div className="price">{item.price}</div>
            </div>
            <div className="content">
              <div className="product-name">{item.name}</div>
              <div className="description">{item.description}</div>
              <div className="rating">
                {'⭐'.repeat(Math.floor(item.rating))} {item.rating} ({item.reviews} reviews)
              </div>
            </div>
            <div className="button-container">
              <button className="view-details">
                <span className="front text">View Details</span>
              </button>
              <button 
                className="add-to-cart"
                onClick={(e) => handleAddToCart(e, item)}
              >
                <span className="front text">Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <ShoppingCart />
    </StyledWrapper>
  );
};

const App = () => {
  return (
    <>
      <GlobalStyle />
      <AppWrapper>
        <FoodSlider />
      </AppWrapper>
    </>
  );
};

// ========== Main Export ==========
export default function AppWithProvider() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/:product" element={<App />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
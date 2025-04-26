import { useState } from "react";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from 'react-icons/fa';

// Create a global style for the full background
const AppWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/src/assets/backimg2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding: 20px 0;
`;

// Cart Icon Component
const CartIcon = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  cursor: pointer;
  
  .cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff5722;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  }
`;

// Cart Modal
const CartModal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100vh;
  background: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  transform: ${props => props.show ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease;
  padding: 20px;
  overflow-y: auto;
  
  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .cart-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .cart-item {
    display: flex;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f5f5f5;
    
    .item-image {
      width: 70px;
      height: 70px;
      object-fit: cover;
      border-radius: 5px;
      margin-right: 15px;
    }
    
    .item-details {
      flex: 1;
      
      .item-name {
        font-weight: 600;
        margin-bottom: 5px;
      }
      
      .item-price {
        color: #4CAF50;
        font-weight: 600;
      }
    }
    
    .item-quantity {
      display: flex;
      align-items: center;
      margin-top: 5px;
      
      button {
        background: #f5f5f5;
        border: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      span {
        margin: 0 10px;
      }
    }
    
    .remove-btn {
      background: none;
      border: none;
      color: #ff5722;
      cursor: pointer;
      margin-top: 5px;
      font-size: 12px;
    }
  }
  
  .cart-total {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
  }
  
  .checkout-btn {
    width: 100%;
    padding: 12px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 20px;
    
    &:hover {
      background: #3d8b40;
    }
  }
  
  .empty-cart {
    text-align: center;
    color: #777;
    margin-top: 50px;
  }
`;

// Styled wrapper for the food slider component
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

  /* Cards Container */
  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 2rem;
    padding: 0 2rem;
    justify-items: center;
  }

  /* Card Styles */
  .card {
    position: relative;
    width: 100%;
    max-width: 280px;
    background: white;
    border-radius: 1rem;
    padding: 1.2rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    }
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: #4CAF50;
    }
  }

  .card .image-container {
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: 0.8rem;
    overflow: hidden;
    margin-bottom: 1.2rem;
    cursor: pointer;
  }

  .card .image-container .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .card:hover .image-container .image {
    transform: scale(1.05);
  }

  .card .image-container .price {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    background: #fff;
    color: #4CAF50;
    font-weight: 700;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }

  .card .content {
    padding: 0 0.8rem;
    margin-bottom: 1.5rem;
  }

  .card .content .product-name {
    font-weight: 700;
    color: #333;
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
  }

  .card .content .description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .card .button-container {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .card .button-container button {
    padding: 10px 15px;
    border-radius: 50px;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    
    &.view-btn {
      background: #2196F3;
      margin-right: 5px;
    }
    
    &.add-btn {
      background: #4CAF50;
      margin-left: 5px;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
  }

  /* Responsive Styles */
  @media (max-width: 768px) {
    .cards-container {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }
    
    .card {
      max-width: 100%;
    }
  }

  @media (max-width: 576px) {
    .cards-container {
      grid-template-columns: 1fr;
      max-width: 400px;
      margin: 0 auto;
      gap: 1.2rem;
    }
    
    .card .button-container {
      flex-direction: column;
      
      button {
        margin: 5px 0 !important;
        width: 100%;
      }
    }
  }
`;

// Food Slider and Cards Component
const FoodSlider = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Sample food data
  const foodItems = [
    { 
      id: 1, 
      name: "Bell Pepper",
      image: "/src/assets/bellpepper1.jpg", 
      price: 49.9,
      path: "/bellpepper",
      description: "Fresh organic bell peppers"
    },
    { 
      id: 2, 
      name: "Cucumber",
      image: "/src/assets/cucumber1.jpg", 
      price: 39.9,
      path: "/cucumber",
      description: "Crisp and refreshing cucumbers"
    },
    { 
      id: 3, 
      name: "Potato",
      image: "/src/assets/potato1.jpg", 
      price: 29.9,
      path: "/potato",
      description: "Premium quality potatoes"
    },
    { 
      id: 4, 
      name: "Carrot",
      image: "/src/assets/carrot1.jpg", 
      price: 19.9,
      path: "/carrot",
      description: "Sweet and crunchy carrots"
    },
    { 
      id: 5, 
      name: "Pineapple",
      image: "/src/assets/pineapple1.jpg", 
      price: 59.9,
      path: "/pineapple",
      description: "Juicy tropical pineapples"
    },
    { 
      id: 6, 
      name: "Lettuce",
      image: "/src/assets/lettuce1.jpg", 
      price: 34.9,
      path: "/lettuce",
      description: "Tender butterhead lettuce"
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Add new item with quantity 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <StyledWrapper>
      {/* Cart Icon */}
      <CartIcon onClick={() => setShowCart(true)}>
        <FaShoppingCart size={24} color="white" />
        {cartItems.length > 0 && <span className="cart-count">{getTotalItems()}</span>}
      </CartIcon>

      {/* Cart Modal */}
      <CartModal show={showCart}>
        <button className="close-btn" onClick={() => setShowCart(false)}>×</button>
        <h2 className="cart-title">Your Cart</h2>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">Your cart is empty</div>
        ) : (
          <>
            {cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  <div className="item-quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
            
            <div className="cart-total">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            
            <button className="checkout-btn">Proceed to Checkout</button>
          </>
        )}
      </CartModal>

      <div className="header">
        <h1 className="text-center text-white mb-4">Fresh Organic Produce</h1>
        <p className="text-center text-white mb-5">Discover our selection of farm-fresh vegetables and fruits</p>
      </div>

      {/* Food Cards Section */}
      <div className="cards-container">
        {foodItems.map((item) => (
          <div className="card" key={item.id}>
            <div className="image-container" onClick={() => handleCardClick(item.path)}>
              <img src={item.image} alt={`${item.name}`} className="image" />
              <div className="price">${item.price.toFixed(2)}</div>
            </div>
            <div className="content">
              <div className="product-name">{item.name}</div>
              <div className="description">{item.description}</div>
            </div>
            <div className="button-container">
              <button className="view-btn" onClick={() => handleCardClick(item.path)}>
                View Details
              </button>
              <button className="add-btn" onClick={() => addToCart(item)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </StyledWrapper>
  );
};

function App() {
  return (
    <AppWrapper>
      <FoodSlider />
    </AppWrapper>
  );
}

export default App;
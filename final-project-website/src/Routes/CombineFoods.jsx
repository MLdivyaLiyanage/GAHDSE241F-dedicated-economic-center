import { useState } from "react";
import PropTypes from 'prop-types';
import "bootstrap/dist/css/bootstrap.min.css";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

// Create a global style for the full background
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

// Cart component
const Cart = ({ cartItems, removeFromCart, clearCart }) => {
  Cart.propTypes = {
    cartItems: PropTypes.array.isRequired,
    removeFromCart: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
  };
  const [isOpen, setIsOpen] = useState(false);

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0);

  return (
    <CartWrapper>
      <div className="cart-icon" onClick={() => setIsOpen(!isOpen)}>
        🛒
        {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
      </div>
      
      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <h4>Your Cart</h4>
            <button onClick={clearCart} className="clear-btn">Clear All</button>
          </div>
          
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <span>{item.name}</span>
                      <span>{item.price}</span>
                    </div>
                    <button onClick={() => removeFromCart(index)} className="remove-btn">×</button>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button className="checkout-btn">Proceed to Checkout</button>
            </>
          )}
        </div>
      )}
    </CartWrapper>
  );
};

const CartWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;

  .cart-icon {
    position: relative;
    font-size: 2rem;
    cursor: pointer;
    color: white;
    background: #4CAF50;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .cart-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff5722;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
  }

  .cart-dropdown {
    position: absolute;
    top: 60px;
    right: 0;
    width: 300px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    padding: 15px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .clear-btn {
    background: none;
    border: none;
    color: #ff5722;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 5px;
  }

  .empty-cart {
    text-align: center;
    padding: 20px 0;
    color: #666;
  }

  .cart-items {
    margin-bottom: 15px;
  }

  .cart-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }

  .cart-item img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 10px;
  }

  .item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #ff5722;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 5px;
  }

  .cart-total {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    padding: 10px 0;
    border-top: 1px solid #eee;
    margin-top: 10px;
  }

  .checkout-btn {
    width: 100%;
    padding: 10px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;

    &:hover {
      background: #45a049;
    }
  }
`;

// Food Slider and Cards Component
const FoodSlider = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Sample food data with improved structure
  const foodItems = [
    { 
      id: 1, 
      name: "Bell pepper",
      image: "src/assets/bellpepper1.jpg", 
      price: "$49.9",
      path: "/bellpepper",
      description: "Fresh organic bell peppers"
    },
    { 
      id: 2, 
      name: "Cucumber",
      image: "src/assets/cucumber1.jpg", 
      price: "$49.9",
      path: "/cucumber",
      description: "Crisp and refreshing cucumbers"
    },
    { 
      id: 3, 
      name: "Amandine potato",
      image: "src/assets/potato1.jpg", 
      price: "$49.9",
      path: "/amandine-potato",
      description: "Premium quality potatoes"
    },
    { 
      id: 4, 
      name: "Carrot",
      image: "src/assets/carrot1.jpg", 
      price: "$49.9",
      path: "/carrot",
      description: "Sweet and crunchy carrots"
    },
    { 
      id: 5, 
      name: "Pineapple",
      image: "src/assets/pineapple1.jpg", 
      price: "$49.9",
      path: "/pineapple",
      description: "Juicy tropical pineapples"
    },
    { 
      id: 6, 
      name: "Butterhead lettuce",
      image: "src/assets/lettuce1.jpg", 
      price: "$49.9",
      path: "/butterhead-lettuce",
      description: "Tender butterhead lettuce"
    },
    { 
      id: 7, 
      name: "Cauliflower",
      image: "src/assets/cauliflower1.jpg", 
      price: "$49.9",
      path: "/cauliflower",
      description: "Fresh white cauliflower"
    },
    { 
      id: 8, 
      name: "Beetroot",
      image: "src/assets/beetroot1.jpg", 
      price: "$49.9",
      path: "/beetroot",
      description: "Nutritious beetroots"
    },
    { 
      id: 9, 
      name: "Savoy cabbage",
      image: "src/assets/cabbage1.jpg", 
      price: "$49.9",
      path: "/savoy-cabbage",
      description: "Crinkled savoy cabbage"
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const removeFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <StyledWrapper>
      <Cart cartItems={cartItems} removeFromCart={removeFromCart} clearCart={clearCart} />
      
      <div className="header">
        <h1 className="text-center text-white mb-4">Fresh Organic Produce</h1>
        <p className="text-center text-white mb-5">Discover our premium selection of farm-fresh vegetables and fruits</p>
      </div>

      {/* Image Slider at the top */}
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

      {/* Food Cards Section */}
      <div className="cards-container">
        {foodItems.map((item) => (
          <div className="card" key={item.id}>
            <div className="image-container">
              <img src={item.image} alt={`${item.name}`} className="image" onClick={() => handleCardClick(item.path)} />
              <div className="price">{item.price}</div>
            </div>
            <div className="content" onClick={() => handleCardClick(item.path)}>
              <div className="product-name">{item.name}</div>
              <div className="description">{item.description}</div>
            </div>
            <div className="button-container">
              <button onClick={() => handleCardClick(item.path)}>
                <span className="front text">View Details</span>
              </button>
              <button className="add-to-cart" onClick={(e) => {
                e.stopPropagation();
                addToCart(item);
              }}>
                <span className="front text">Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </StyledWrapper>
  );
};

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

  /* Slider Styles */
  .slider {
    width: 100%;
    max-width: 100vw;
    height: var(--height);
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .slider .list {
    display: flex;
    width: 100%;
    min-width: calc(var(--width) * var(--quantity));
    position: relative;
    transition: all 0.5s ease;
  }

  .slider .list .item {
    width: var(--width);
    height: var(--height);
    position: absolute;
    left: 100%;
    animation: autoRun 20s linear infinite;
    transition: all 0.5s;
    animation-delay: calc((20s / var(--quantity)) * (var(--position) - 1) - 20s);
    cursor: pointer;
  }

  .slider .list .item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    transition: transform 0.3s;
  }

  .slider .list .item .item-name {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px;
    text-align: center;
    font-size: 0.9rem;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    transform: translateY(100%);
    transition: transform 0.3s;
  }

  .slider .list .item:hover img {
    transform: scale(1.05);
  }

  .slider .list .item:hover .item-name {
    transform: translateY(0);
  }

  @keyframes autoRun {
    from {
      left: 100%;
    }
    to {
      left: calc(var(--width) * -1);
    }
  }

  .slider:hover .item {
    animation-play-state: paused;
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
    --accent-color: #4CAF50;
    position: relative;
    width: 100%;
    max-width: 280px;
    background: white;
    border-radius: 1rem;
    padding: 1.2rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    overflow: hidden;
    cursor: pointer;
    
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
      background: var(--accent-color);
    }
  }

  .card .image-container {
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: 0.8rem;
    overflow: hidden;
    margin-bottom: 1.2rem;
  }

  .card .image-container .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
    cursor: pointer;
  }

  .card:hover .image-container .image {
    transform: scale(1.05);
  }

  .card .image-container .price {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    background: #fff;
    color: var(--accent-color);
    font-weight: 700;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .card:hover .image-container .price {
    transform: scale(1.05);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }

  .card .content {
    padding: 0 0.8rem;
    margin-bottom: 1.5rem;
    cursor: pointer;
  }

  .card .content .product-name {
    font-weight: 700;
    color: #333;
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    transition: color 0.3s ease;
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
    gap: 10px;
  }

  .card .button-container button {
    font-size: 16px;
    padding: 10px 15px;
    border-radius: 50px;
    background: var(--accent-color);
    color: white;
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    flex: 1;
  }

  .card .button-container .add-to-cart {
    background: #ff9800;
  }

  .card .button-container button:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }

  .card .button-container button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .card .button-container button:hover:before {
    left: 100%;
  }

  .card .button-container button:active {
    transform: translateY(0);
  }

  /* Responsive Styles */
  @media (max-width: 1200px) {
    .cards-container {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
  }

  @media (max-width: 992px) {
    .header h1 {
      font-size: 2rem;
    }
    
    .header p {
      font-size: 1rem;
    }
    
    .slider {
      height: 180px;
    }

    .slider .list .item {
      width: 180px;
      height: 180px;
    }
  }

  @media (max-width: 768px) {
    .cards-container {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
      padding: 0 1.5rem;
    }
    
    .slider {
      height: 150px;
    }

    .slider .list .item {
      width: 150px;
      height: 150px;
    }
    
    .card {
      max-width: 100%;
      padding: 1rem;
    }

    .card .button-container {
      flex-direction: column;
    }

    .card .button-container button {
      width: 100%;
    }
  }

  @media (max-width: 576px) {
    .header h1 {
      font-size: 1.8rem;
    }
    
    .slider {
      height: 120px;
    }

    .slider .list .item {
      width: 120px;
      height: 120px;
    }
    
    .cards-container {
      grid-template-columns: 1fr;
      max-width: 400px;
      margin: 0 auto;
      gap: 1.2rem;
      padding: 0 1rem;
    }
    
    .card {
      max-width: 100%;
    }
  }
`;

const GlobalStyleFix = styled.div`
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  * {
    box-sizing: border-box;
  }
`;

function App() {
  return (
    <>
      <GlobalStyleFix />
      <AppWrapper>
        <FoodSlider />
      </AppWrapper>
    </>
  );
}

export default App;
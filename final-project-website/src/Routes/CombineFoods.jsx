import  "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

// Create a global style for the full background
const AppWrapper = styled.div`
  /* Set the background for the entire page */
  min-height: 100vh;
  width: 100%;
  background-image: url('src/assets/backimg2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* This keeps the background fixed while scrolling */
`;

// Food Slider and Cards Component
const FoodSlider = () => {
  const navigate = useNavigate();

  // Sample food data
  const foodItems = [
    { 
      id: 1, 
      name: "Bell pepper",
      image: "src/assets/bellpepper1.jpg", 
      price: "$49.9",
      path: "/bellpepper"
    },
    { 
      id: 2, 
      name: "Cucumber",
      image: "src/assets/cucumber1.jpg", 
      price: "$49.9",
      path: "/cucumber"
    },
    { 
      id: 3, 
      name: "Amandine potato",
      image: "src/assets/potato1.jpg", 
      price: "$49.9",
      path: "/amandine-potato"
    },
    { 
      id: 4, 
      name: "Carrot",
      image: "src/assets/carrot1.jpg", 
      price: "$49.9",
      path: "/carrot"
    },
    { 
      id: 5, 
      name: "Pineapple",
      image: "src/assets/pineapple1.jpg", 
      price: "$49.9",
      path: "/pineapple"
    },
    { 
      id: 6, 
      name: "Butterhead lettuce",
      image: "src/assets/lettuce1.jpg", 
      price: "$49.9",
      path: "/butterhead-lettuce"
    },
    { 
      id: 7, 
      name: "Cauliflower",
      image: "src/assets/cauliflower1.jpg", 
      price: "$49.9",
      path: "/cauliflower"
    },
    { 
      id: 8, 
      name: "Beetroot",
      image: "src/assets/beetroot1.jpg", 
      price: "$49.9",
      path: "/beetroot"
    },
    { 
      id: 9, 
      name: "Savoy cabbage",
      image: "src/assets/cabbage1.jpg", 
      price: "$49.9",
      path: "/savoy-cabbage"
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };


  return (
    <StyledWrapper>
      {/* Image Slider at the top */}
      <div className="slider" style={{ '--width': '200px', '--height': '200px', '--quantity': 9 }}>
        <div className="list">
          {foodItems.map((item, index) => (
            <div className="item" key={item.id} style={{ '--position': index + 1 }}>
              <img src={item.image} alt={`${item.name}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Food Cards Section */}
      <div className="cards-container">
        {foodItems.map((item) => (
          <div className="card" key={item.id}>
            <div className="image-container">
              <img src={item.image} alt={`${item.name}`} className="image" />
              <div className="price">{item.price}</div>
            </div>
            <div className="content">
              <div className="brand">{item.name}</div>
              <div className="product-name">{item.name}</div>
            </div>
            <div className="button-container">
              <button onClick={()=>handleCardClick(item.path)}>
                <span className="front text">Click me</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Remove the background from this component */
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 1rem 0; /* Reduced top padding from 2rem to 1rem */
  
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
    margin-bottom: 1.5rem; /* Reduced the margin from 3rem to 1.5rem */
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
    animation: autoRun 12s linear infinite;
    transition: filter 0.5s;
    animation-delay: calc((12s / var(--quantity)) * (var(--position) - 1) - 12s);
  }

  .slider .list .item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
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
    animation-play-state: paused !important;
    filter: grayscale(1);
  }

  .slider .item:hover {
    filter: grayscale(0);
  }

  /* Cards Container */
  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    padding: 1.5rem; /* Reduced padding from 2rem to 1.5rem */
    justify-items: center;
    margin-top: -1rem; /* Added negative margin to move cards up */
  }

  /* Card Styles */
  .card {
    --accent-color: rgb(10, 68, 244);
    position: relative;
    width: 100%;
    max-width: 260px;
    background: white;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: rgba(100, 100, 111, 0.3) 0px 15px 30px -5px;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    transform: scale(1);
    
    &:hover {
      transform: scale(1.05);
      box-shadow: rgba(0, 0, 0, 0.1) 0px 15px 30px 0px;
    }
  }

  .card .image-container {
    position: relative;
    width: 100%;
    height: 180px;
    border-radius: 0.8rem;
    overflow: hidden;
    margin-bottom: 1.2rem;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px 0px;
  }

  .card .image-container .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
    transition: transform 0.5s ease-in-out;
  }

  .card .image-container:hover .image {
    transform: scale(1.1);
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
    box-shadow: rgba(100, 100, 111, 0.3) 0px 3px 6px 0px;
    transition: all 0.3s ease;
  }

  .card .content {
    padding: 0px 0.8rem;
    margin-bottom: 1.5rem;
  }

  .card .content .brand {
    font-weight: 900;
    color: #a6a6a6;
    font-size: 0.9rem;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .card .content .product-name {
    font-weight: 700;
    color: #4a4a4a;
    font-size: 1rem;
    margin-bottom: 1rem;
    transition: color 0.3s ease;
  }

  .card .content .product-name:hover {
    color: var(--accent-color);
  }

  .card .button-container {
    display: flex;
    justify-content: center;
  }

  .card .button-container button {
    font-size: 17px;
    padding: 10px 25px;
    border-radius: 0.7rem;
    background-image: linear-gradient(rgb(214, 202, 254), rgb(58, 234, 14));
    border: 2px solid rgb(50, 50, 50);
    border-bottom: 5px solid rgb(50, 50, 50);
    box-shadow: 0px 1px 6px 0px rgb(37, 44, 236);
    transform: translate(0, -3px);
    cursor: pointer;
    transition: 0.2s;
    transition-timing-function: linear;
  }

  .card .button-container button:active {
    transform: translate(0, 0);
    border-bottom: 2px solid rgb(50, 50, 50);
  }

  /* Responsive Styles */
  @media (max-width: 1024px) {
    .slider {
      height: 200px;
    }

    .slider .list .item {
      width: 200px;
      height: 200px;
    }
  }

  @media (max-width: 768px) {
    .cards-container {
      padding: 1rem;
      gap: 1rem;
      margin-top: -0.5rem; /* Adjusted for smaller screens */
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
      padding: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .slider {
      height: 120px;
    }

    .slider .list .item {
      width: 120px;
      height: 120px;
    }
    
    .cards-container {
      padding: 0.8rem;
      gap: 0.8rem;
      margin-top: -0.3rem; /* Adjusted for mobile screens */
    }
  }
`;

// You also need to add some global styles to ensure the background covers the entire page
const GlobalStyleFix = styled.div`
  /* This ensures the body and html take full height */
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
`;

// Main component 
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
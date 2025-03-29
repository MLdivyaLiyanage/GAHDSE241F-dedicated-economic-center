import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from 'styled-components';
import Container from "react-bootstrap/Container";

// Card Component for Image Slider
const SliderCard = () => {
  return (
    <div className="slider" style={{ '--width': '200px', '--height': '200px', '--quantity': 9 }}>
      <div className="list">
        <div className="item" style={{ '--position': 1 }}>
          <img src="src/assets/Farmer1.jpg" alt="Image 1" />
        </div>
        <div className="item" style={{ '--position': 2 }}>
          <img src="src/assets/Farmer2.jpg" alt="Image 2" />
        </div>
        <div className="item" style={{ '--position': 3 }}>
          <img src="src/assets/Farmer15.jpg" alt="Image 3" />
        </div>
        <div className="item" style={{ '--position': 4 }}>
          <img src="src/assets/Farmer13.jpg" alt="Image 4" />
        </div>
        <div className="item" style={{ '--position': 5 }}>
          <img src="src/assets/Farmer5.jpg" alt="Image 5" />
        </div>
        <div className="item" style={{ '--position': 6 }}>
          <img src="src/assets/Farmer14.jpg" alt="Image 6" />
        </div>
        <div className="item" style={{ '--position': 7 }}>
          <img src="src/assets/Farmer15.jpg" alt="Image 7" />
        </div>
        <div className="item" style={{ '--position': 8 }}>
          <img src="src/assets/Farmer12.jpg" alt="Image 8" />
        </div>
        <div className="item" style={{ '--position': 9 }}>
          <img src="src/assets/Farmer9.jpg" alt="Image 9" />
        </div>
      </div>
    </div>
  );
};

// The Carousel component with farmer cards
const FarmerCards = ({ imageUrls }) => {
  const brands = [
    'Saman Perera', 'Rohana Silva', 'Bandara Wijesinghe', 'Sunil Jayawardena', 'Sarath Kumara',
    'Kamal Rathnayake', 'Gayan Fernando', 'Thilakaratne Mudalige', 'Mahinda Ekanayake', 'Ravindra Senanayake',
    'Dinesh Wickramasinghe', 'Janaka Jayasundara', 'Upul Wijeratne', 'Ajith Kumara', 'Chandana Herath'
  ];
  
  const productNames = [
    'Grows Lime', 'Grows Garlic', 'Grows Onion', 'Grows Lettuce Leaves', 'Grows Leeks',
    'Grows Cabbage Flowers', 'Grows Cucumber', 'Grows Cabbage', 'Grows Green Chillies', 'Grows Tomato',
    'Grows Potato', 'Grows Brinjals', 'Grows Bell Pepper', 'Grows Pumpkin', 'Grows Beetroot'
  ];

  const CardItems = Array.from({ length: 15 }, (_, index) => {
    const imageUrl = imageUrls[index] || `https://placeimg.com/240/130/tech?${index}`;
    const brand = brands[index % brands.length];
    const productName = productNames[index % productNames.length];

    return (
      <div className="card" key={index}>
        <div className="image-container">
          <img src={imageUrl} alt={`Product ${index + 1}`} className="image" />
        </div>

        <div className="content">
          <div className="brand">{brand}</div>
          <div className="product-name">{productName}</div>
        </div>
        <div className="button-container">
          <button>
            <span className="shadow" />
            <span className="edge" />
            <span className="front text">Click me</span>
          </button>
        </div>
      </div>
    );
  });

  return <div className="cards-container">{CardItems}</div>;
};

// Images array for farmer cards
const images = [
  'src/assets/Farmer1.jpg',
  'src/assets/Farmer2.jpg',
  'src/assets/Farmer3.jpg',
  'src/assets/Farmer4.jpg',
  'src/assets/Farmer5.jpg',
  'src/assets/Farmer6.jpg',
  'src/assets/Farmer7.jpg',
  'src/assets/Farmer8.jpg',
  'src/assets/Farmer9.jpg',
  'src/assets/Farmer10.jpg',
  'src/assets/Farmer11.jpg',
  'src/assets/Farmer12.jpg',
  'src/assets/Farmer13.jpg',
  'src/assets/Farmer14.jpg',
  'src/assets/Farmer15.jpg',
];

// Main combined component
function CombinedFarmersComponent() {
  return (
    <MainContainer>
      {/* Top section with slider */}
      <div className="slider-section">
        <SliderCard />
      </div>
      
      {/* Bottom section with farmer cards */}
      <div className="farmers-grid-section">
        <FarmerCards imageUrls={images} />
      </div>
    </MainContainer>
  );
}

// Main container with background styling for the entire page
const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  
  /* Adding main background image for the entire page */
  background-image: url('src/assets/backimg1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  
  /* Overlay for better readability */
  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
  
  .slider-section {
    position: relative;
    height: 50vh; /* Further reduced from 70vh to 50vh */
    width: 100%;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 0;
    margin-bottom: -20px; /* Negative margin to pull cards up */
  }
  
  .farmers-grid-section {
    position: relative;
    padding-top: 0; /* Removed top padding completely */
    padding-bottom: 2rem;
    z-index: 2;
    margin-top: 0;
  }
  
  /* Slider styles */
  .slider {
    width: 100%;
    height: var(--height);
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);
    position: relative;
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
    animation: autoRun 6s linear infinite; /* Further reduced from 8s to 6s */
    transition: filter 0.5s;
    animation-delay: calc((6s / var(--quantity)) * (var(--position) - 1) - 6s); /* Updated animation delay */
  }

  .slider .list .item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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
    filter: grayscale(0.5);
  }

  .slider .item:hover {
    filter: grayscale(0);
    transform: scale(1.05);
  }

  /* Cards grid styling */
  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    padding: 1.5rem;
    padding-top: 0.5rem; /* Reduced top padding */
    justify-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .card {
    --accent-color: rgb(10, 68, 244);
    position: relative;
    width: 100%;
    max-width: 240px;
    height: 330px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(5px);
    border-radius: 15px; 
    padding: 0.8rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease-in-out;
    z-index: 2;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    background: rgba(255, 255, 255, 0.95);
  }

  .card .image-container {
    position: relative;
    width: 100%;
    height: 180px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .card .image-container .image {
    height: 100%;
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .card:hover .image-container .image {
    transform: scale(1.05);
  }

  .card .content {
    padding: 0px 0.5rem;
    margin-bottom: 1rem;
  }

  .card .content .brand {
    font-weight: 700;
    color: #333;
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }

  .card .content .product-name {
    font-weight: 500;
    color: #666666;
    font-size: 0.85rem;
    margin-bottom: 0.8rem;
  }

  .card .button-container {
    display: flex;
    justify-content: center;
  }

  .card .button-container button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    border-radius: 0.5rem;
    background-color: #0A44F4;
    border: none;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .card .button-container button:hover {
    background-color: #083bbf;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .slider-section {
      height: 35vh; /* Further reduced from 40vh to 35vh */
      margin-bottom: -15px; /* Less aggressive negative margin on tablet */
    }
    
    .cards-container {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      padding: 1rem;
      padding-top: 0.5rem;
    }
    
    .card {
      max-width: 200px;
      height: 300px;
    }
  }

  @media (max-width: 480px) {
    .slider-section {
      height: 30vh; /* Further reduced for smaller screens */
      margin-bottom: -10px; /* Less aggressive negative margin on mobile */
    }
    
    .cards-container {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
    
    .card {
      max-width: 150px;
      height: 280px;
      padding: 0.5rem;
    }
    
    .card .image-container {
      height: 150px;
    }
    
    .card .content .brand {
      font-size: 0.9rem;
    }
    
    .card .content .product-name {
      font-size: 0.75rem;
    }
    
    .card .button-container button {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }
  }
`;

export default CombinedFarmersComponent;
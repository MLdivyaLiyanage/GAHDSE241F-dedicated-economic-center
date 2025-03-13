/* eslint-disable react/prop-types */
import  'react';
import styled from 'styled-components';
import "./Farmer.css";

// The Card component now accepts an array of image URLs as a prop
const Card = ({ imageUrls }) => {
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

  const cards = Array.from({ length: 15 }, (_, index) => {
    const imageUrl = imageUrls[index] || `https://placeimg.com/240/130/tech?${index}`; // Fallback to random image if no specific image is passed
    const brand = brands[index % brands.length]; // Cycle through the brands array
    const productName = productNames[index % productNames.length]; // Cycle through the product names array

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
        <span className="front text"> Click me
        </span>
      </button>
          
        </div>
      </div>
    );
  });

  return <StyledWrapper>{cards}</StyledWrapper>;
};

// The images array will be passed to the Card component
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

const App = () => {
  return (
    <div>
      <Card imageUrls={images} />
    </div>
  );
};

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  padding: 1rem;
  justify-items: center;

  .card {
    --accent-color:rgb(10, 68, 244);
    position: relative;
    width: 100%;
    max-width: 240px;
    height: 430px;
    background: white;
    border-radius: 15px; 
    padding: 0.3rem;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 50px 30px -20px;
    transition: all 0.5s ease-in-out;
  }

  .card .image-container {
    position: relative;
    width: 100%;
    height: 330px;
    border-radius: 15px;
    margin-bottom: 1rem;
  }

  .card .image-container .image {
    height: 80%;  /* Adjusted for medium size */
    width: 100%;
    border-radius: 15px;
    object-fit: cover;
  }


  .card .favorite {
    position: absolute;
    width: 19px;
    height: 19px;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }

  .card .favorite input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .card .favorite input:checked ~ svg {
    animation: bouncing 0.5s;
    fill: rgb(240, 119, 119);
    filter: drop-shadow(0px 3px 1px rgba(53, 53, 53, 0.14));
  }

  .card .favorite svg {
    fill: #a8a8a8;
  }

  .card .content {
    padding: 0px 0.8rem;
    margin-bottom: 1rem;
  }

  .card .content .brand {
    font-weight: 900;
    color: #a6a6a6;
  }

  .card .content .product-name {
    font-weight: 700;
    color: #666666;
    font-size: 0.7rem;
    margin-bottom: 1rem;
  }

  .card .content .quantity-container {
    margin-top: 1rem;
    font-size: 0.8rem;
  }

  .card .content .quantity-container input {
    font-size: 1rem;
    padding: 0.1rem 0.3rem;
    border-radius: 0.3rem;
  }

  .card .content .rating {
    display: flex;
    margin: 1rem 0;
  }

  .card .content .rating svg {
    width: 2rem;
    height: 2rem;
  }

  .card .button-container {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .card .button {
    width: 48%;
    padding: 0.6rem;
    font-size: 0.9rem;
    border-radius: 0.5rem;
    background-color:rgb(4, 252, 0);
    border: none;
    color: #333;
    font-weight: bold;
  }

  .card .cart-button {
    background-color:rgb(255, 0, 0);
  }

  @keyframes bouncing {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export default App;

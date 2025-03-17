/* eslint-disable react/prop-types */
import  'react';
import styled from 'styled-components';
import "./card.css";

// The Card component now accepts an array of image URLs as a prop
const Card = ({ imageUrls }) => {
  const brands = [
    'Bell pepper', 'Cucumber', 'Amandine potato', 'Carrot', 'Pineapple',
    'Butterhead lettuce', 'Cauliflower', 'Beetroot', 'Savoy cabbage', 'Spring Onion',
    'Birds eye chili', 'Aubergine', 'Green chilies', 'Courgette', 'Butternut squash'
  ];
  
  const productNames = [
    'Bell pepper', 'Cucumber', 'Amandine potato', 'Carrot', 'Pineapple',
    'Butterhead lettuce', 'Cauliflower', 'Beetroot', 'Savoy cabbage', 'Spring Onion',
    'Birds eye chili', 'Aubergine', 'Green chilies', 'Courgette', 'Butternut squash'
  ];

  const cards = Array.from({ length: 15 }, (_, index) => {
    const imageUrl = imageUrls[index] || `https://placeimg.com/240/130/tech?${index}`; // Fallback to random image if no specific image is passed
    const brand = brands[index % brands.length]; // Cycle through the brands array
    const productName = productNames[index % productNames.length]; // Cycle through the product names array

    return (
      <div className="card" key={index}>
        <div className="image-container">
          <img src={imageUrl} alt={`Product ${index + 1}`} className="image" />
          <div className="price">$49.9</div>
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
  'src/assets/pic1.jpg',
  'src/assets/pic2.jpg',
  'src/assets/pic3.jpg',
  'src/assets/pic4.jpg',
  'src/assets/pic5.jpg',
  'src/assets/pic6.jpg',
  'src/assets/pic15.jpg',
  'src/assets/pic8.jpg',
  'src/assets/pic9.jpg',
  'src/assets/pic10.jpg',
  'src/assets/pic11.jpg',
  'src/assets/pic12.jpg',
  'src/assets/pic13.jpg',
  'src/assets/pic16.jpg',
  'src/assets/pic14.jpg',
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
    background: white;
    border-radius: 1rem;
    padding: 0.3rem;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 50px 30px -20px;
    transition: all 0.5s ease-in-out;
  }

  .card .image-container {
    position: relative;
    width: 100%;
    height: 130px;
    border-radius: 0.7rem;
    border-top-right-radius: 4rem;
    margin-bottom: 1rem;
  }

  .card .image-container .image {
    height: 80%;  /* Adjusted for medium size */
    width: 100%;
    border-radius: inherit;
    object-fit: cover;
  }

  .card .image-container .price {
    position: absolute;
    right: 0.7rem;
    bottom: -1rem;
    background: white;
    color: var(--accent-color);
    font-weight: 900;
    font-size: 0.9rem;
    padding: 0.5rem;
    border-radius: 1rem 1rem 2rem 2rem;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 0px 15px 0px;
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

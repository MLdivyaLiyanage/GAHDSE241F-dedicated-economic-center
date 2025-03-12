import React from 'react';
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
    const rating = Math.floor(Math.random() * 5) + 1; // Generate random rating between 1 and 5
    const brand = brands[index % brands.length]; // Cycle through the brands array
    const productName = productNames[index % productNames.length]; // Cycle through the product names array

    return (
      <div className="card" key={index}>
        <div className="image-container">
          <img src={imageUrl} alt={`Product ${index + 1}`} className="image" />
          <div className="price">$49.9</div>
        </div>
        <label className="favorite">
          <input defaultChecked type="checkbox" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000">
            <path d="M12 20a1 1 0 0 1-.437-.1C11.214 19.73 3 15.671 3 9a5 5 0 0 1 8.535-3.536l.465.465.465-.465A5 5 0 0 1 21 9c0 6.646-8.212 10.728-8.562 10.9A1 1 0 0 1 12 20z" />
          </svg>
        </label>
        <div className="content">
          <div className="brand">{brand}</div>
          <div className="product-name">{productName}</div>
          <div className="quantity-container">
            <label>Quantity:</label>
            <input type="number" min="1" defaultValue="1" className="quantity-input" />
          </div>
          <div className="rating">
            {Array.from({ length: rating }, (_, i) => (
              <svg key={i} viewBox="0 0 99.498 16.286" xmlns="http://www.w3.org/2000/svg" className="star-svg">
                <path d="M48.513 9.465l4.329 8.764-7.525-4.146-7.525 4.146 4.329-8.764-7.69-7.332h9.502L48.513 0l4.33 8.765h9.503l-7.69 7.332z" fill="#ffd426"/>
              </svg>
            ))}
            ({Math.floor(Math.random() * 10000)}) {/* Random reviews */}
          </div>
        </div>
        <div className="button-container">
          <button className="buy-button button">Buy Now</button>
          <button className="cart-button button">
            <svg viewBox="0 0 27.97 25.074" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,1.175A1.173,1.173,0,0,1,1.175,0H3.4A2.743,2.743,0,0,1,5.882,1.567H26.01A1.958,1.958,0,0,1,27.9,4.035l-2.008,7.459a3.532,3.532,0,0,1-3.4,2.61H8.36l.264,1.4a1.18,1.18,0,0,0,1.156.955H23.9a1.175,1.175,0,0,1,0,2.351H9.78a3.522,3.522,0,0,1-3.462-2.865L3.791,2.669A.39.39,0,0,0,3.4,2.351H1.175A1.173,1.173,0,0,1,0,1.175ZM6.269,22.724a2.351,2.351,0,1,1,2.351,2.351A2.351,2.351,0,0,1,6.269,22.724Zm16.455-2.351a2.351,2.351,0,1,1-2.351,2.351A2.351,2.351,0,0,1,22.724,20.373Z" id="cart-shopping-solid" />
            </svg>
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

/* eslint-disable react/prop-types */
import  'react';
import styled from 'styled-components';


// The Card component now accepts an array of image URLs as a prop
const Card = ({ imageUrls }) => {
  const brands = [
    'Bell pepper', 'Cucumber', 'Amandine potato', 'Carrot'
  ];
  
  const productNames = [
    'Bell pepper', 'Cucumber', 'Amandine potato', 'Carrot'
  ];

  const cards = Array.from({ length: 4 }, (_, index) => {
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
  gap: 2rem;
  padding: 1.5rem;
  justify-items: center;
  background-color: #f4f5f7;

  .card {
    --accent-color: rgb(10, 68, 244);
    position: relative;
    width: 100%;
    max-width: 240px;
    background: #fff;
    border-radius: 1.5rem;
    padding: 1rem;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 15px 30px -5px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    border: 1px solid #e1e1e1;

    &:hover {
      transform: translateY(-5px);
      box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 40px -5px;
    }
  }

  .card .image-container {
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: 1rem;
    margin-bottom: 1rem;
    overflow: hidden;
  }

  .card .image-container .image {
    height: 100%;
    width: 100%;
    border-radius: inherit;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .card .image-container:hover .image {
    transform: scale(1.1);
  }

  .card .image-container .price {
    position: absolute;
    right: 0.7rem;
    bottom: -1rem;
    background: #fff;
    color: var(--accent-color);
    font-weight: 700;
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
    border-radius: 1.5rem;
    box-shadow: rgba(100, 100, 111, 0.3) 0px 10px 15px -5px;
    z-index: 2;
  }

  .card .favorite {
    position: absolute;
    width: 26px;
    height: 26px;
    top: 15px;
    right: 15px;
    cursor: pointer;
    z-index: 1;
  }

  .card .favorite input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .card .favorite input:checked ~ svg {
    animation: bounce 0.5s ease;
    fill: rgb(240, 119, 119);
    filter: drop-shadow(0px 4px 6px rgba(53, 53, 53, 0.2));
  }

  .card .favorite svg {
    fill: #a8a8a8;
    transition: fill 0.3s ease;
  }

  .card .content {
    padding: 0px 1.2rem;
    margin-top: 0.5rem;
  }

  .card .content .brand {
    font-weight: 900;
    color: #a6a6a6;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .card .content .product-name {
    font-weight: 700;
    color: #444;
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .card .content .quantity-container {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    font-size: 0.9rem;
  }

  .card .content .quantity-container input {
    font-size: 1.2rem;
    padding: 0.4rem 0.6rem;
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    width: 60px;
    text-align: center;
    transition: all 0.3s ease;

    &:focus {
      border-color: var(--accent-color);
      outline: none;
    }
  }

  .card .content .rating {
    display: flex;
    margin: 1rem 0;
    justify-content: flex-start;
  }

  .card .content .rating svg {
    width: 2.8rem;
    height: 2.8rem;
    margin-right: 0.3rem;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .card .content .rating svg:hover {
    transform: scale(1.1);
  }

  .card .button-container {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
  }

  .card .button {
    width: 48%;
    padding: 0.9rem;
    font-size: 1.1rem;
    border-radius: 0.6rem;
    background-color: rgb(4, 252, 0);
    border: none;
    color: white;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
    cursor: pointer;

    &:hover {
      background-color: rgb(0, 204, 0);
      transform: translateY(-3px);
    }

    &:active {
      transform: translateY(1px);
    }
  }

  .card .cart-button {
    background-color: rgb(255, 0, 0);

    &:hover {
      background-color: rgb(204, 0, 0);
      transform: translateY(-3px);
    }

    &:active {
      transform: translateY(1px);
    }
  }

  @keyframes bounce {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
  
  button,
  button:focus {
    font-size: 18px;
    padding: 12px 28px;
    border-radius: 0.8rem;
    background-image: linear-gradient(rgb(214, 202, 254), rgb(158, 129, 254));
    border: 2px solid rgb(50, 50, 50);
    border-bottom: 6px solid rgb(50, 50, 50);
    box-shadow: 0px 2px 8px 0px rgb(158, 129, 254);
    transform: translate(0, -4px);
    cursor: pointer;
    transition: 0.3s;
    transition-timing-function: ease;
  }

  button:active {
    transform: translate(0, 0);
    border-bottom: 3px solid rgb(50, 50, 50);
  }
`;



export default App;

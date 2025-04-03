/* eslint-disable react/prop-types */
import  'react';
import styled from 'styled-components';


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
  gap: 1.5rem;
  padding: 2rem;
  justify-items: center;
  background: #f8f9fa;

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

  .card .favorite {
    position: absolute;
    width: 22px;
    height: 22px;
    top: 12px;
    right: 12px;
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
    animation: bounce 0.3s;
    fill: #f07474;
    filter: drop-shadow(0px 3px 4px rgba(53, 53, 53, 0.25));
  }

  .card .favorite svg {
    fill: #d1d1d1;
    transition: fill 0.3s ease;
  }

  .card .favorite:hover svg {
    fill: #f07474;
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

  .card .content .quantity-container {
    margin-top: 1rem;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card .content .quantity-container input {
    font-size: 1.1rem;
    padding: 0.3rem 0.8rem;
    border-radius: 0.3rem;
    border: 1px solid #ddd;
    transition: border-color 0.3s ease;
  }

  .card .content .quantity-container input:focus {
    border-color: var(--accent-color);
    outline: none;
  }

  .card .content .rating {
    display: flex;
    margin: 1rem 0;
  }

  .card .content .rating svg {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.1rem;
    cursor: pointer;
    transition: fill 0.3s ease;
  }

  .card .content .rating svg:hover {
    fill: #f07474;
  }

  .card .button-container {
    display: flex;
    justify-content: space-between;
    gap: 0.8rem;
  }

  .card .button {
    width: 48%;
    padding: 0.8rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    background-color: rgb(4, 252, 0);
    border: none;
    color: #fff;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }

  .card .cart-button {
    background-color: rgb(255, 0, 0);
  }

  .card .button:hover {
    background-color: rgb(0, 204, 0);
  }

  .card .cart-button:hover {
    background-color: rgb(204, 0, 0);
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

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
    .card {
      max-width: 100%;
      padding: 0.8rem;
    }

    .card .image-container {
      height: 150px;
    }

    .card .content .brand {
      font-size: 0.8rem;
    }

    .card .content .product-name {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 0.8rem;
    .card {
      max-width: 100%;
    }

    .card .image-container {
      height: 130px;
    }

    .card .content .brand {
      font-size: 0.7rem;
    }

    .card .content .product-name {
      font-size: 0.8rem;
    }

    .card .content .quantity-container input {
      font-size: 0.9rem;
    }
      
  }
      button,
  button:focus {
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

  button:active {
    transform: translate(0, 0);
    border-bottom: 2px solid rgb(50, 50, 50);
  }
`

export default App;

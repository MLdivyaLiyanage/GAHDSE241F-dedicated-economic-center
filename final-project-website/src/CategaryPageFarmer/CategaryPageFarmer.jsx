import "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from 'prop-types';
import "./CategaryPageFarmer.css"; // Ensure this contains necessary styles
import styled from 'styled-components';

// Card Component (Image Slider)

const Card = () => {
  return (
    <StyledWrapper>
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
    </StyledWrapper>  

);
};
        // The Carousel component now accepts an array of image URLs as a prop
const Carousel = ({ imageUrls }) => {
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

  const Carousel = Array.from({ length: 15 }, (_, index) => {
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

  return <StyledWrapper>{Carousel }</StyledWrapper>;
};

// The images array will be passed to the Carousel  component
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
const CarouselComponent = () => {
  return (
    <div>
      <Carousel  imageUrls={images} />
    </div>
  )
};
Carousel.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
};  


const StyledWrapper = styled.div`
  .slider {
    width: 100%;
    height: var(--height);
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);
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
    height: %;
    object-fit: cover;
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

  .slider[reverse="true"] .item {
    animation: reversePlay 12s linear infinite;
  }

  @keyframes reversePlay {
    from {
      left: calc(var(--width) * -1);
    }
    to {
      left: 100%;
    }
  }

  /* Make sure to adjust these for better responsiveness */
  @media (max-width: 768px) {
    .slider {
      height: 150px; /* Adjust height for smaller screens */
    }

    .slider .list .item {
      width: 150px; /* Adjust width for smaller screens */
      height: 150px; /* Adjust height for smaller screens */
    }
  }

  @media (max-width: 480px) {
    .slider {
      height: 120px; /* Adjust height for smaller screens */
    }

    .slider .list .item {
      width: 120px; /* Adjust width for smaller screens */
      height: 120px; /* Adjust height for smaller screens */
    }
  }
    
`;

// Navigation Bar Component
function NavigationBar() {
  return (
    <>
      <Navbar expand="lg" className="navbar">
        <Container fluid>
          <Navbar.Brand href="#" className="navbar-brand">My Website</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0 navbar-nav" navbarScroll>
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#service">Service</Nav.Link>
              <NavDropdown title="Category" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action1">Category 1</NavDropdown.Item>
                <NavDropdown.Item href="#action2">Category 2</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action3">Something Else</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form className="d-flex">
              <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
              <Button className="btn">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Include Card component for image slider */}
      <Container>
        <Card />
      </Container>

    </>
  );
}
const CategaryPageFarmer = () => {
  return (
    <>
      <NavigationBar />
      <CarouselComponent />
    </>
  );
};
export default CategaryPageFarmer;
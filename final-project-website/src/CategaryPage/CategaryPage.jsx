import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Categary.css"; // Ensure this contains necessary styles
import styled from 'styled-components';



// Card Component (Image Slider)

const Card = () => {
  return (
    <StyledWrapper>
      <div className="slider" style={{ '--width': '200px', '--height': '200px', '--quantity': 9 }}>
        <div className="list">
          <div className="item" style={{ '--position': 1 }}>
            <img src="src/assets/img50.jpg" alt="Image 1" />
          </div>
          <div className="item" style={{ '--position': 2 }}>
            <img src="src/assets/img45.jpg" alt="Image 2" />
          </div>
          <div className="item" style={{ '--position': 3 }}>
            <img src="src/assets/img43.jpg" alt="Image 3" />
          </div>
          <div className="item" style={{ '--position': 4 }}>
            <img src="src/assets/img41.jpg" alt="Image 4" />
          </div>
          <div className="item" style={{ '--position': 5 }}>
            <img src="src/assets/img40.jpg" alt="Image 5" />
          </div>
          <div className="item" style={{ '--position': 6 }}>
            <img src="src/assets/img21.jpg" alt="Image 6" />
          </div>
          <div className="item" style={{ '--position': 7 }}>
            <img src="src/assets/img10.jpg" alt="Image 7" />
          </div>
          <div className="item" style={{ '--position': 8 }}>
            <img src="src/assets/img7.jpg" alt="Image 8" />
          </div>
          <div className="item" style={{ '--position': 9 }}>
            <img src="src/assets/img3.jpg" alt="Image 9" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
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
function Home() {
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

export default Home;
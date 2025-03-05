import React, { useState, useEffect } from "react";
import { FaFacebook, FaLinkedin, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import "./Home.css"; // Import Home CSS file

// Loader Component
const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loop cubes">
        <div className="item cubes" />
        <div className="item cubes" />
        <div className="item cubes" />
        <div className="item cubes" />
        <div className="item cubes" />
        <div className="item cubes" />
      </div>
    </StyledWrapper>
  );
};

// Styled Components for Loader
const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
`;

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulating data fetching
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Set loading to false after 3 seconds
    }, 3000);
  }, []);

  return (
    <div className="home-container">
      {/* Show loader while fetching */}
      {isLoading && <Loader />}

      {/* Navigation Bar */}
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

      {/* Shape Divider */}
      <div className="shape-divider">
        <svg className="w-full h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="white"
            fillOpacity="1"
            d="M0,128L48,138.7C96,149,192,171,288,181.3C384,192,480,192,576,165.3C672,139,768,85,864,85.3C960,85,1056,139,1152,154.7C1248,171,1344,149,1392,138.7L1440,128V0H0Z"
          ></path>
        </svg>
      </div>

      {/* Added Welcome Text and Video */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Welcome To The Dedicated Economic Center</h1>
          <h2>Sri Lanka</h2>
          <p>
            A hub for fresh produce, wholesale goods, and a thriving marketplace.
            Connecting farmers, vendors, and consumers, we ensure quality products
            at the best prices. Experience convenience, variety, and affordability
            all in one place!
          </p>
        </div>

        {/* Video Clip on the Right */}
        <div className="video-container">
          <video className="video-clip" autoPlay loop muted>
            <source src="src/assets/cooking2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

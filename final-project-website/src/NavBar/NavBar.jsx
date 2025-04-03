import "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledWrapper = styled.div`
:root {
    /* Color Palette */
    --primary-bg-color: rgba(255, 255, 255, 0.39); /* Increased transparency */
    --primary-bg-color-scrolled: rgba(10, 32, 92, 0.85);
    --text-color: #ffffff;
    --accent-color: #17a2b8;
    --gradient-primary: linear-gradient(135deg, rgba(110, 142, 251, 0.6), rgba(167, 119, 227, 0.6));
    --gradient-hover: linear-gradient(135deg, rgba(167, 119, 227, 0.8), rgba(110, 142, 251, 0.8));

    /* Transition & Animation */
    --transition-default: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    --transition-ease: all 0.4s ease-in-out;

    /* Glass Effect */
    --blur-strength: blur(50px); /* Increased blur for a stronger frosted effect */
    --border-color: rgba(255, 255, 255, 0.6); /* Softer frosted glass border */
}

/* Navbar Styling with Enhanced Glass Effect */
.navbar.navbar {
    background: var(--primary-bg-color);
    backdrop-filter: var(--blur-strength);
    -webkit-backdrop-filter: var(--blur-strength);
    padding: 14px 30px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    border-bottom: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.57); /* More depth */
    transition: var(--transition-default);
}

/* Navbar shrink effect when scrolling */
.navbar.navbar.scrolled {
    padding: 10px 25px;
    background: var(--primary-bg-color-scrolled);
    backdrop-filter: blur(40px); /* Even stronger blur when scrolling */
}

/* Navbar brand styling */
.navbar-brand {
    font-size: 2rem;
    font-weight: bold;
    color: var(--text-color);
    letter-spacing: 1px;
    position: relative;
    transition: var(--transition-ease);
}

.navbar-brand:hover {
    text-shadow: 0 0 25px rgba(255, 255, 255, 0.9);
    transform: scale(1.05);
}

.navbar-brand::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 50%;
    height: 2px;
    background: linear-gradient(90deg, #6e8efb, transparent);
    transition: width 0.4s ease-in-out;
}

.navbar-brand:hover::after {
    width: 100%;
}

/* Navbar links */
.navbar-nav .nav-link {
    color: #ffffff !important;
    font-size: 1.2rem;
    font-weight: 600;
    margin-right: 20px;
    transition: var(--transition-ease);
    position: relative;
    padding: 8px 0;
}

.navbar-nav .nav-link:hover {
    color: var(--accent-color) !important;
    transform: translateY(-3px);
}

.navbar-nav .nav-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 50%;
    background-color: var(--accent-color);
    transition: width 0.4s ease-in-out;
    transform: translateX(-50%);
}

.navbar-nav .nav-link:hover::after {
    width: 100%;
}

/* Dropdown menu styling */
.navbar-nav .dropdown-menu {
    background: rgba(168, 177, 202, 0.35);
    backdrop-filter: blur(25px); /* Stronger blur inside dropdown */
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
    padding: 10px;
    margin-top: 6px;
    border-radius: 10px;
    transition: var(--transition-ease);
}

/* Navbar animation */
@keyframes glassEffect {
    from {
        backdrop-filter: blur(20px);
    }
    to {
        backdrop-filter: blur(35px);
    }
}
.navbar.navbar {
    animation: glassEffect 0.8s ease-in-out;
}

button {
    align-items: center;
    background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
    border: 0;
    border-radius: 8px;
    box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
    box-sizing: border-box;
    color: #ffffff;
    display: flex;
    font-size: 18px;
    justify-content: center;
    line-height: 1em;
    max-width: 100%;
    min-width: 140px;
    padding: 3px;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.3s;
}

button:active,
button:hover {
    outline: 0;
}

button span {
    background-color: rgb(5, 6, 45);
    padding: 16px 24px;
    border-radius: 6px;
    width: 100%;
    height: 100%;
    transition: 300ms;
}

button:hover span {
    background: none;
}

button:active {
    transform: scale(0.9);
}

/* Profile Button Styling */
.profile-btn {
    position: absolute;
    top: 20px; /* Adjust top distance */
    right: -50px; /* Adjust right distance */
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-ease);
}

.profile-btn svg {
    color: var(--text-color);
    width: 40px;
    height: 40px;
    transition: var(--transition-ease);
}

.profile-btn:hover svg {
    color: var(--accent-color);
    transform: scale(1.1);
    filter: drop-shadow(0 0 5px rgba(23, 162, 184, 0.5));
}

.profile-btn:active svg {
    transform: scale(0.95);
}

/* Accessibility and Focus States */
.profile-btn:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
}
`;

function Home() {
  const navigate = useNavigate();

  return (
    <StyledWrapper>
      <Navbar expand="lg" className="navbar">
        <Container fluid>
          <Navbar.Brand href="#" className="navbar-brand">
            Dedicated Economic Center
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0 navbar-nav" navbarScroll>
            <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
              <Nav.Link href="#service">Service</Nav.Link>
              <NavDropdown title="Category" id="navbarScrollingDropdown">
              <NavDropdown.Item onClick={() => navigate("/farmer")}>Farmer</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/product")}>Product</NavDropdown.Item>
                <NavDropdown.Divider />
              </NavDropdown>
            </Nav>
            <Form className="d-flex me-2">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button className="search-btn">Search</Button>
            </Form>
            <Nav className="profile-nav">
            <Button className="profile-btn" onClick={() => navigate("/profile")} aria-label="User Profile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="24"
                  fill="currentColor"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </StyledWrapper>
  );
}

export default Home;
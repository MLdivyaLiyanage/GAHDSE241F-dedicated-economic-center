import "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";  // Ensure this contains necessary styles

// Navigation Bar Component
function Home() {
  const navigate = useNavigate(); // Fix: Define navigate
  return (
    <>
      <Navbar expand="lg" className="navbar">
        <Container fluid>
          <Navbar.Brand href="#" className="navbar-brand">Dedicated Economic Center</Navbar.Brand>
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
              <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
              <Button className="search-btn">Search</Button>
            </Form>
            <Nav className="profile-nav">
              <Button
                className="profile-btn"
                onClick={() => console.log("Profile clicked")}
                aria-label="User Profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg>
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Home;
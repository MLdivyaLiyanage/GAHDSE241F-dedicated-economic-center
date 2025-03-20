import "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css"; 
import styled from "styled-components";

const NavigationWithVideo = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <Navbar expand="lg" className="navbar">
        <Container fluid>
          <Navbar.Brand href="/" className="navbar-brand">
            My Website
          </Navbar.Brand>
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
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button className="btn">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Card />
    </div>
  );
};

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card-container">
        <div className="card">
          <img src="src/assets/Farmer5.jpg" alt="Card" className="card-image" />
        </div>
        <div className="card-text">
          <h2>Farmer Profile</h2>
          <p>Name: Saman Perera</p>
          <p>Location: Sri Lanka</p>
          <p>Experience: 10+ years in organic farming</p>
          <p>Specialty: Tea & Spice Cultivation</p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card-container {
    display: flex;
    align-items: center;
    gap: 20px; /* Space between card and text */
    width: 100vw;
    height: 100vh;
    background-color: #f4f4f4;
    padding-left: 2%;
  }

  .card {
    width: 400px;
    height: 300px;
    background: rgb(236, 236, 236);
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, 
                rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, 
                rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    position: absolute;
    top: 15%;
    left: 1%;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  .card-text {
    max-width: 300px;
    font-size: 18px;
    line-height: 1.5;
    color: #333;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    position: absolute;
    top: 15%;
    left: 30%;
  }

  .card-text h2 {
    margin-bottom: 10px;
    font-size: 22px;
    color: #007bff;
  }
`;

export default NavigationWithVideo;

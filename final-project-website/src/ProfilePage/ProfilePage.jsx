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
import { FaStar } from "react-icons/fa";

const NavigationWithVideo = () => {
  return (
    <div>
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
      <ProfileSection />
    </div>
  );
};

const ProfileSection = () => {
  return (
    <StyledWrapper>
      <div className="profile-container">
        <div className="card">
          <img src="src/assets/Farmer5.jpg" alt="Farmer" className="card-image" />
        </div>
        <div className="card-text">
          <h2>Farmer Profile</h2>
          <p>Name: Saman Perera</p>
          <p>Location: Sri Lanka</p>
          <p>Experience: 10+ years in organic farming</p>
          <p>Specialty: Tea & Spice Cultivation</p>
        </div>
        <div className="rating-card">
          <h2>Rating</h2>
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <FaStar key={index} color={index < 4 ? "#ffc107" : "#e4e5e9"} size={24} />
            ))}
          </div>
          <p>4.0 out of 5</p>
        </div>
        <div className="about-card">
          <h2>About Me</h2>
          <p>Hello! I’m Saman Perera, a dedicated farmer from Sri Lanka with over 10 years of experience in organic and sustainable agriculture. I specialize in cultivating high-quality tea and spices using eco-friendly farming practices. My passion for farming drives me to implement innovative techniques that enhance crop quality while preserving the environment. I strongly believe in sustainable agriculture and work closely with local communities to promote organic farming methods.</p>
        </div>
        <ButtonComponent />
      </div>
      <ProductSection />
    </StyledWrapper>
    
  );
};

const ButtonComponent = () => {
  return (
    <StyledWrapper>
      <button className="button">
        <div className="outline" />
        <div className="state state--default">
          <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="1.2em" width="1.2em">
              <g style={{ filter: "url(#shadow)" }}>
                <path fill="currentColor" d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63Z" />
              </g>
            </svg>
          </div>
          <p>{[..."Send Message"].map((char, index) => (<span key={index} style={{ "--i": index }}>{char}</span>))}</p>
        </div>
      </button>
    </StyledWrapper> 
  );
};
const ProductSection = () => {
  return (

      <div className="product-container">
        <div className="product-card">
          <h2>My Product</h2>
        </div>
      </div>

  );
};

const StyledWrapper = styled.div`
  .profile-container {
    display: flex;
    align-items: center;
    gap: 20px;
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

.rating-card {
    width: 25%; /* Adjust as needed */
    max-width: 500px; /* Ensures it doesn't become too large */
    min-width: 300px; /* Prevents it from becoming too small */
    font-size: 18px;
    color: #333;
    background: #fff;
    padding: 10px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    position: absolute;
    top: 62%;
    left: 1%; /* Center horizontally */
  
    text-align: center;
    display: flex;
    flex-direction: row; /* Stack content */
    align-items: center; /* Center items vertically */
    justify-content: center; /* Center items horizontally */
    position: absolute;
    top: 62%;
    left: 1%; 
}

.stars {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px; /* Space between stars */
    margin-top: 5px; /* Space between text and stars */
}


  .about-card {
    max-width: 650px;
    font-size: 18px;
    line-height: 1.5;
    color: #333;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    position: absolute;
    top: 15%;
    left: 55%;
  }
`;

export default NavigationWithVideo;
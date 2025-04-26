import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const GlassNavbar = styled(Navbar)`
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(25px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(25px) saturate(180%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
  padding: 15px 0;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;

  &.scrolled {
    padding: 8px 0;
    background: rgba(8, 15, 40, 0.85) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
  }
`;

const Brand = styled(Navbar.Brand)`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.8rem;
  background: linear-gradient(90deg, #fff 0%, #a5f8ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  padding-left: 1rem;
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-2px);
    text-shadow: 0 5px 15px rgba(165, 248, 255, 0.4);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 60%;
    width: 4px;
    background: linear-gradient(to bottom, #00d2ff, #3a7bd5);
    border-radius: 4px;
  }
`;

const NavLink = styled(Nav.Link)`
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  font-size: 1.1rem;
  margin: 0 0.5rem;
  padding: 0.5rem 1rem !important;
  position: relative;
  transition: all 0.3s ease;
  border-radius: 8px;

  &:hover {
    color: #fff !important;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #00d2ff, #3a7bd5);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 70%;
  }
`;

const SearchForm = styled(Form)`
  position: relative;
  margin: 0 1rem;

  @media (max-width: 992px) {
    margin: 1rem 0;
    width: 100%;
  }
`;

const SearchInput = styled(Form.Control)`
  background: rgba(255, 255, 255, 0.1) !important;
  border: none !important;
  border-radius: 50px !important;
  color: white !important;
  padding: 0.75rem 1.5rem !important;
  width: 280px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  &:focus {
    background: rgba(255, 255, 255, 0.2) !important;
    box-shadow: 0 4px 30px rgba(0, 210, 255, 0.3) !important;
    outline: none !important;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  @media (max-width: 992px) {
    width: 100%;
  }
`;

const SearchButton = styled(Button)`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent !important;
  border: none !important;
  color: rgba(255, 255, 255, 0.7) !important;
  padding: 0.5rem 1rem !important;
  transition: all 0.3s ease;

  &:hover {
    color: #00d2ff !important;
    transform: translateY(-50%) scale(1.1);
  }

  &:focus {
    box-shadow: none !important;
  }
`;

const DropdownMenu = styled(NavDropdown)`
  .dropdown-toggle {
    color: rgba(255, 255, 255, 0.9) !important;
    &::after {
      transition: all 0.3s ease;
    }
  }

  .dropdown-menu {
    background: rgba(20, 30, 60, 0.9) !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 12px !important;
    padding: 0.5rem 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transform-origin: top center;
    animation: fadeIn 0.3s ease-out forwards;
    opacity: 0;
    transform: translateY(10px);

    .dropdown-item {
      color: rgba(255, 255, 255, 0.8) !important;
      padding: 0.5rem 1.5rem;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;

      &:hover {
        color: #fff !important;
        background: rgba(0, 210, 255, 0.1) !important;
        padding-left: 2rem;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 3px;
        background: linear-gradient(to bottom, #00d2ff, #3a7bd5);
        transform: translateX(-10px);
        transition: transform 0.3s ease;
      }

      &:hover::before {
        transform: translateX(0);
      }
    }

    .dropdown-divider {
      border-color: rgba(255, 255, 255, 0.1) !important;
      margin: 0.5rem 0;
    }
  }

  &:hover .dropdown-menu {
    display: block;
    opacity: 1;
    transform: translateY(0);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ProfileButton = styled.div`
  position: relative;
  margin-left: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  .profile-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  &:hover .profile-icon {
    transform: scale(1.1) rotate(10deg);
    box-shadow: 0 6px 20px rgba(0, 210, 255, 0.4);
  }

  .notification-badge {
    position: absolute;
    top: -3px;
    right: -3px;
    width: 12px;
    height: 12px;
    background: #ff4757;
    border-radius: 50%;
    border: 2px solid rgba(8, 15, 40, 0.9);
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7);
    }
    70% {
      transform: scale(1.1);
      box-shadow: 0 0 0 8px rgba(255, 71, 87, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 71, 87, 0);
    }
  }
`;

function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <GlassNavbar expand="lg" className={scrolled ? 'scrolled' : ''}>
      <Container fluid>
        <Brand href="#" onClick={() => navigate("/home")}>
          Dedicated Economic Center
        </Brand>
        <Navbar.Toggle aria-controls="navbarScroll" className="text-white" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0">
            <NavLink onClick={() => navigate("/home")}>Home</NavLink>
            <NavLink onClick={() => navigate("/location")}>Location</NavLink>
            <DropdownMenu title="Categories" id="navbarScrollingDropdown">
              <NavDropdown.Item onClick={() => navigate("/farmer")}>Farmers</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/product")}>Products</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => navigate("/more-categories")}>
                More Categories
              </NavDropdown.Item>
            </DropdownMenu>
            
          </Nav>
          
          <SearchForm className="d-flex" onSubmit={handleSearch}>
            <SearchInput
              type="search"
              placeholder="Search products, farmers..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type="submit">
              <i className="bi bi-search"></i>
            </SearchButton>
          </SearchForm>
          
          <ProfileButton onClick={() => navigate("/profile")}>
            <div className="profile-icon">
              <i className="bi bi-person-fill"></i>
            </div>
            <div className="notification-badge"></div>
          </ProfileButton>
        </Navbar.Collapse>
      </Container>
    </GlassNavbar>
  );
}

export default Home;
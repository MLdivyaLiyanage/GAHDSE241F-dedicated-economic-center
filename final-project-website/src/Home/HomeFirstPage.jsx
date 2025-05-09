import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const HomePage = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  
  // Handle scroll for back-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Footer styles
  const styles = {
    backToTop: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#3498db',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      opacity: isVisible ? '1' : '0',
      visibility: isVisible ? 'visible' : 'hidden',
      transition: 'all 0.3s ease',
      zIndex: '999',
      border: 'none',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      fontSize: '20px'
    },
    footer: {
      background: 'linear-gradient(to right, rgba(25, 26, 26, 0.4), rgb(0, 0, 0))',
      color: '#f5f5f5',
      padding: '60px 0 20px',
      fontFamily: "'Poppins', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    footerBefore: {
      content: "''",
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(to right, #3498db, #2ecc71, #f1c40f, #e74c3c)'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    row: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: '40px'
    },
    column: {
      flex: 1,
      minWidth: '200px'
    },
    heading: {
      color: '#ffffff',
      fontSize: '1.2rem',
      fontWeight: 600,
      marginBottom: '20px',
      position: 'relative',
      paddingBottom: '10px'
    },
    headingAfter: {
      content: "''",
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '50px',
      height: '2px',
      backgroundColor: '#3498db'
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    listItem: {
      marginBottom: '12px'
    },
    link: {
      color: '#ccc',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      position: 'relative',
      paddingLeft: '15px'
    },
    arrowIcon: {
      position: 'absolute',
      left: 0,
      color: '#3498db',
      fontSize: '18px'
    },
    socialLinks: {
      display: 'flex',
      gap: '15px',
      marginTop: '15px'
    },
    socialLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      transition: 'all 0.3s ease'
    },
    copyright: {
      textAlign: 'center',
      marginTop: '40px',
      paddingTop: '20px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#aaa',
      fontSize: '0.9rem'
    },
    newsletterForm: {
      display: 'flex',
      marginTop: '15px'
    },
    input: {
      flex: 1,
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px 0 0 4px',
      fontSize: '14px',
      outline: 'none'
    },
    button: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '0 4px 4px 0',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    videoContainer: {
      width: '100%',
      height: '80vh',
      overflow: 'hidden',
      position: 'relative'
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    contentSection: {
      padding: '60px 0',
      backgroundImage: 'linear-gradient(to right,rgb(62, 61, 61),rgb(0, 0, 0))', // Two-color gradient
    },
    
    sectionTitle: {
      textAlign: 'center',
      marginBottom: '40px',
      fontWeight: '600',
      color: '#FFFFFF'
    },
    card: {
      height: '100%',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      backgroundColor: '#ffffff', // Added background color for individual cards
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
      }
    },
    cardBody: {
      backgroundColor: '#f8f9fa' // Added background color for card body
    }
  };

  // Footer link component
  const FooterLink = ({ href, text }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <li style={styles.listItem}>
        <a 
          href={href} 
          style={{
            ...styles.link,
            color: isHovered ? '#ffffff' : '#ccc',
            paddingLeft: isHovered ? '20px' : '15px'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span style={styles.arrowIcon}>›</span>
          {text}
        </a>
      </li>
    );
  };
  FooterLink.propTypes = {
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  };

  // Social link component
  const SocialLink = ({ href, icon }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <a 
        href={href} 
        style={{
          ...styles.socialLink,
          transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
          backgroundColor: isHovered ? '#3498db' : 'rgba(255, 255, 255, 0.1)',
          boxShadow: isHovered ? '0 5px 15px rgba(52, 152, 219, 0.3)' : 'none'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <i className={icon}></i>
      </a>
    );
  };
  SocialLink.propTypes = {
    href: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  };

  return (
    <div className="home-page">
      {/* Back to top button */}
      <button 
        style={styles.backToTop} 
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ↑
      </button>
      
      {/* Video Container Section */}
      <div style={styles.videoContainer}>
        <video style={styles.video} autoPlay muted playsInline>
          <source src="src/assets/backgroundVedeo.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content Section with Three Specific Cards */}
      <div style={styles.contentSection}>
        <Container>
          <h2 style={styles.sectionTitle}>Our Features</h2>
          <Row className="g-4">
            {/* Card 1 - Analytics Feature */}
            <Col md={4}>
              <Card style={styles.card}>
                <Card.Img 
                  variant="top" 
                  src="src/assets/product.png" 
                  alt="Analytics Dashboard"
                  height="200px"
                  style={{ objectFit: 'cover' }}
                />
                <Card.Body style={styles.cardBody}>
                  <Card.Title>🛒 Product & Purchase Features</Card.Title>
                  <Card.Text>
                  Browse and Search Products by Category: Easily find fruits, vegetables, grains, etc., with category filters and search functionality.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 2 - Collaboration Feature */}
            <Col md={4}>
              <Card style={styles.card}>
                <Card.Img 
                  variant="top" 
                  src="src/assets/location.jpg" 
                  alt="Team Collaboration"
                  height="200px"
                  style={{ objectFit: 'cover' }}
                />
                <Card.Body style={styles.cardBody}>
                  <Card.Title>📍 Product Origin & Traceability</Card.Title>
                  <Card.Text>
                  Browse and Search Products by Category: Easily find fruits, vegetables, grains, etc., with category filters and search functionality.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 3 - Security Feature */}
            <Col md={4}>
              <Card style={styles.card}>
                <Card.Img 
                  variant="top" 
                  src="src/assets/faramerchat.jpg" 
                  alt="Security Features"
                  height="200px"
                  style={{ objectFit: 'cover' }}
                />
                <Card.Body style={styles.cardBody}>
                  <Card.Title>👥 Customer-Farmer Interaction</Card.Title>
                  <Card.Text>
                  Direct Chat with Farmers: Customers can communicate directly with farmers via an integrated chat system to ask questions, negotiate, or build trust.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Footer Section */}
      <footer style={styles.footer}>
        <div style={styles.footerBefore}></div>
        
        <div style={styles.container}>
          <div style={styles.row}>
            {/* Company Column */}
            <div style={styles.column}>
              <h4 style={styles.heading}>
                Company
                <span style={{ ...styles.headingAfter, position: 'absolute' }}></span>
              </h4>
              <ul style={styles.list}>
                <FooterLink href="/about" text="About Us" />
                <FooterLink href="/services" text="Our Services" />
                <FooterLink href="/privacy" text="Privacy Policy" />
                <FooterLink href="/terms" text="Terms of Service" />
              </ul>
            </div>
            
            {/* Get Help Column */}
            <div style={styles.column}>
              <h4 style={styles.heading}>
                Get Help
                <span style={{ ...styles.headingAfter, position: 'absolute' }}></span>
              </h4>
              <ul style={styles.list}>
                <FooterLink href="/faq" text="FAQ" />
                <FooterLink href="/shipping" text="Shipping" />
                <FooterLink href="/returns" text="Returns" />
                <FooterLink href="/order-status" text="Order Status" />
                <FooterLink href="/payment-options" text="Payment Options" />
              </ul>
            </div>
            
            {/* Connect Column */}
            <div style={styles.column}>
              <h4 style={styles.heading}>
                Connect
                <span style={{ ...styles.headingAfter, position: 'absolute' }}></span>
              </h4>
              <div style={styles.socialLinks}>
                <SocialLink href="https://facebook.com" icon="fab fa-facebook-f" />
                <SocialLink href="https://twitter.com" icon="fab fa-twitter" />
                <SocialLink href="https://instagram.com" icon="fab fa-instagram" />
                <SocialLink href="https://linkedin.com" icon="fab fa-linkedin-in" />
              </div>
            </div>
            
            {/* Newsletter Column */}
            <div style={styles.column}>
              <h4 style={styles.heading}>
                Newsletter
                <span style={{ ...styles.headingAfter, position: 'absolute' }}></span>
              </h4>
              <p>Subscribe for updates</p>
              <form style={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your email" required style={styles.input} />
                <button 
                  type="submit" 
                  style={styles.button}
                  onMouseOver={(e) => {e.target.style.backgroundColor = '#2980b9'}}
                  onMouseOut={(e) => {e.target.style.backgroundColor = '#3498db'}}
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div style={styles.copyright}>
          <p>© {currentYear} Your Company Name. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
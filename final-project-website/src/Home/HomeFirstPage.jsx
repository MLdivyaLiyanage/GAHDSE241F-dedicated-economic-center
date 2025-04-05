import  { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  const currentYear = new Date().getFullYear();
  
  // Add back-to-top button functionality
  useEffect(() => {
    // Create back-to-top button
    const backToTopButton = document.createElement('div');
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '30px';
    backToTopButton.style.right = '30px';
    backToTopButton.style.width = '40px';
    backToTopButton.style.height = '40px';
    backToTopButton.style.borderRadius = '50%';
    backToTopButton.style.backgroundColor = '#3498db';
    backToTopButton.style.color = 'white';
    backToTopButton.style.display = 'flex';
    backToTopButton.style.alignItems = 'center';
    backToTopButton.style.justifyContent = 'center';
    backToTopButton.style.cursor = 'pointer';
    backToTopButton.style.opacity = '0';
    backToTopButton.style.visibility = 'hidden';
    backToTopButton.style.transition = 'all 0.3s ease';
    backToTopButton.style.zIndex = '999';
    backToTopButton.innerHTML = '↑';
    document.body.appendChild(backToTopButton);
    
    // Show/hide based on scroll position
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
      } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
      }
    };
    
    // Smooth scroll to top when clicked
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    backToTopButton.addEventListener('click', scrollToTop);
    
    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      backToTopButton.removeEventListener('click', scrollToTop);
      if (document.body.contains(backToTopButton)) {
        document.body.removeChild(backToTopButton);
      }
    };
  }, []);
  
  // Footer styles
  const footerStyles = {
    footer: {
      background: 'linear-gradient(to right,rgba(25, 26, 26, 0.4),rgb(0, 0, 0))',
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
    }
  };
  
  return (
    <div className="home-page">
      {/* Video Container Section */}
      <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
        {/* Background Video */}
        <video className="w-100" autoPlay muted style={{ width: '100%', objectFit: 'cover' }}>
          <source src="src/assets/backgroundVedeo.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Footer Section */}
      <footer style={footerStyles.footer}>
        {/* Colorful top border */}
        <div style={footerStyles.footerBefore}></div>
        
        <div style={footerStyles.container}>
          <div style={footerStyles.row}>
            {/* Company Column */}
            <div style={footerStyles.column}>
              <h4 style={footerStyles.heading}>
                Company
                <span style={{ ...footerStyles.headingAfter, position: 'absolute' }}></span>
              </h4>
              <ul style={footerStyles.list}>
                <li style={footerStyles.listItem}>
                  <a href="/about" style={footerStyles.link} 
                     onMouseOver={(e) => {e.target.style.color = '#ffffff'; e.target.style.paddingLeft = '20px'}}
                     onMouseOut={(e) => {e.target.style.color = '#ccc'; e.target.style.paddingLeft = '15px'}}>
                    <span style={{ position: 'absolute', left: 0, color: '#3498db', fontSize: '18px' }}>›</span>
                    About Us
                  </a>
                </li>
                <li style={footerStyles.listItem}>
                  <a href="/services" style={footerStyles.link} 
                     onMouseOver={(e) => {e.target.style.color = '#ffffff'; e.target.style.paddingLeft = '20px'}}
                     onMouseOut={(e) => {e.target.style.color = '#ccc'; e.target.style.paddingLeft = '15px'}}>
                    <span style={{ position: 'absolute', left: 0, color: '#3498db', fontSize: '18px' }}>›</span>
                    Our Services
                  </a>
                </li>
                <li style={footerStyles.listItem}>
                  <a href="/privacy" style={footerStyles.link} 
                     onMouseOver={(e) => {e.target.style.color = '#ffffff'; e.target.style.paddingLeft = '20px'}}
                     onMouseOut={(e) => {e.target.style.color = '#ccc'; e.target.style.paddingLeft = '15px'}}>
                    <span style={{ position: 'absolute', left: 0, color: '#3498db', fontSize: '18px' }}>›</span>
                    Privacy Policy
                  </a>
                </li>
                <li style={footerStyles.listItem}>
                  <a href="/terms" style={footerStyles.link} 
                     onMouseOver={(e) => {e.target.style.color = '#ffffff'; e.target.style.paddingLeft = '20px'}}
                     onMouseOut={(e) => {e.target.style.color = '#ccc'; e.target.style.paddingLeft = '15px'}}>
                    <span style={{ position: 'absolute', left: 0, color: '#3498db', fontSize: '18px' }}>›</span>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Get Help Column */}
            <div style={footerStyles.column}>
              <h4 style={footerStyles.heading}>
                Get Help
                <span style={{ ...footerStyles.headingAfter, position: 'absolute' }}></span>
              </h4>
              <ul style={footerStyles.list}>
                <li style={footerStyles.listItem}>
                  <a href="/faq" style={footerStyles.link} 
                     onMouseOver={(e) => {e.target.style.color = '#ffffff'; e.target.style.paddingLeft = '20px'}}
                     onMouseOut={(e) => {e.target.style.color = '#ccc'; e.target.style.paddingLeft = '15px'}}>
                    <span style={{ position: 'absolute', left: 0, color: '#3498db', fontSize: '18px' }}>›</span>
                    FAQ
                  </a>
                </li>
                <li style={footerStyles.listItem}>
                  <a href="/shipping" style={footerStyles.link} 
                     onMouseOver={(e) => {e.target.style.color = '#ffffff'; e.target.style.paddingLeft = '20px'}}
                     onMouseOut={(e) => {e.target.style.color = '#ccc'; e.target.style.paddingLeft = '15px'}}>
                    <span style={{ position: 'absolute', left: 0, color: '#3498db', fontSize: '18px' }}>›</span>
                    Shipping
                  </a>
                </li>
                <li style={footerStyles.listItem}>
                  <a href="/returns" style={footerStyles.link} 
                     onMouseOver={(e) => {e.target.style.color = '#ffffff'; e.target.style.paddingLeft = '20px'}}
                     onMouseOut={(e) => {e.target.style.color = '#ccc'; e.target.style.paddingLeft = '15px'}}>
                    <span style={{ position: 'absolute', left: 0, color: '#3498db', fontSize: '18px' }}>›</span>
                    Returns
                  </a>
                </li>
                <li style={footerStyles.listItem}>
                  <a href="/order-status" style={footerStyles.link} 
                     onMouseOver={(e) => {e.target.style.color = '#ffffff'; e.target.style.paddingLeft = '20px'}}
                     onMouseOut={(e) => {e.target.style.color = '#ccc'; e.target.style.paddingLeft = '15px'}}>
                    <span style={{ position: 'absolute', left: 0, color: '#3498db', fontSize: '18px' }}>›</span>
                    Order Status
                  </a>
                </li>
                <li style={footerStyles.listItem}>
                  <a href="/payment-options" style={footerStyles.link} 
                     onMouseOver={(e) => {e.target.style.color = '#ffffff'; e.target.style.paddingLeft = '20px'}}
                     onMouseOut={(e) => {e.target.style.color = '#ccc'; e.target.style.paddingLeft = '15px'}}>
                    <span style={{ position: 'absolute', left: 0, color: '#3498db', fontSize: '18px' }}>›</span>
                    Payment Options
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Connect Column */}
            <div style={footerStyles.column}>
              <h4 style={footerStyles.heading}>
                Connect
                <span style={{ ...footerStyles.headingAfter, position: 'absolute' }}></span>
              </h4>
              <div style={footerStyles.socialLinks}>
                <a href="https://facebook.com" style={footerStyles.socialLink}
                   onMouseOver={(e) => {e.target.style.transform = 'translateY(-3px)'; e.target.style.backgroundColor = '#3498db'; e.target.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.3)'}}
                   onMouseOut={(e) => {e.target.style.transform = 'translateY(0)'; e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'}}>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" style={footerStyles.socialLink}
                   onMouseOver={(e) => {e.target.style.transform = 'translateY(-3px)'; e.target.style.backgroundColor = '#3498db'; e.target.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.3)'}}
                   onMouseOut={(e) => {e.target.style.transform = 'translateY(0)'; e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'}}>
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" style={footerStyles.socialLink}
                   onMouseOver={(e) => {e.target.style.transform = 'translateY(-3px)'; e.target.style.backgroundColor = '#3498db'; e.target.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.3)'}}
                   onMouseOut={(e) => {e.target.style.transform = 'translateY(0)'; e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'}}>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://linkedin.com" style={footerStyles.socialLink}
                   onMouseOver={(e) => {e.target.style.transform = 'translateY(-3px)'; e.target.style.backgroundColor = '#3498db'; e.target.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.3)'}}
                   onMouseOut={(e) => {e.target.style.transform = 'translateY(0)'; e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'}}>
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            
            {/* Newsletter Column */}
            <div style={footerStyles.column}>
              <h4 style={footerStyles.heading}>
                Newsletter
                <span style={{ ...footerStyles.headingAfter, position: 'absolute' }}></span>
              </h4>
              <p>Subscribe for updates</p>
              <form style={footerStyles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your email" required style={footerStyles.input} />
                <button type="submit" style={footerStyles.button}
                        onMouseOver={(e) => {e.target.style.backgroundColor = '#2980b9'}}
                        onMouseOut={(e) => {e.target.style.backgroundColor = '#3498db'}}>
                  →
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div style={footerStyles.copyright}>
          <p>© {currentYear} Your Company Name. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
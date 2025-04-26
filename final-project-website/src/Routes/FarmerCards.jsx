import { useEffect, useState } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import styled from "styled-components";
import "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation

// Styled Components with shared background
const PageWrapper = styled.div`
  /* Adding background image for entire page */
  background-image: url('src/assets/backimg1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* This keeps the background fixed while scrolling */
  min-height: 100vh;
  width: 100%;
`;

// Slider Section with adjusted positioning
const SliderSection = styled.div`
  height: 60vh;
  position: relative;
  display: flex;
  align-items: center; /* Center vertically */
  padding-top: 50px; /* Add padding to move slider down */
`;

// Slider Component
const SliderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .slider {
    width: 100%;
    height: var(--height);
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);
    position: relative;
    /* Removed the top: -30% to prevent pushing slider up */
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
    height: 100%;
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

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .slider {
      height: 150px;
    }

    .slider .list .item {
      width: 150px;
      height: 150px;
    }
  }

  @media (max-width: 480px) {
    .slider {
      height: 120px;
    }

    .slider .list .item {
      width: 120px;
      height: 120px;
    }
  }
`;

// Card Component (Image Slider)
const SliderCard = () => {
  return (
    <SliderWrapper>
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
    </SliderWrapper>
  );
};

// Main component for the slider section
function FarmerSlider() {
  return (
    <Container fluid className="p-0">
      <SliderCard />
    </Container>
  );
}

const API_BASE_URL = "http://localhost:5000/api";

// Styled Components for Farmer Cards
const CardsContainer = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  /* Semi-transparent background */
  background-color: rgba(20, 38, 99, 0.72);
`

const FarmerCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
  }
`;

const ProfileHeader = styled.div`
  position: relative;
  height: 150px;
  background: linear-gradient(45deg,rgb(65, 208, 132),rgb(80, 200, 156));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 15px;
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  margin-bottom: 10px;
`;

const ProfileBody = styled.div`
  padding: 15px;
`;

const ProfileName = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.2rem;
`;

const ProfileDetail = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 0.85rem;
  
  strong {
    color: #444;
    margin-right: 5px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
  justify-content: center;
  
  a {
    color: #4158D0;
    font-size: 1rem;
    transition: color 0.2s ease;
    
    &:hover {
      color: #C850C0;
    }
  }
`;

const ProductsSection = styled.div`
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 15px;
`;

const ProductCard = styled.div`
  background: #f9f9f9;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
`;

const ProductName = styled.h4`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1rem;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const ProductPrice = styled.p`
  font-weight: bold;
  color: #4158D0;
  margin: 4px 0;
  font-size: 0.9rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #666;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #f44336;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
`;

const ViewProfileButton = styled.button`
  background:rgb(65, 208, 120);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 10px;
  width: 100%;
  font-size: 0.9rem;

  &:hover {
    background:rgb(65, 208, 120);
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 25px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const ModalProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const AboutMeText = styled.p`
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 0;
`;

// New styled components for the buttons
const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 'rgb(65, 208, 120)' : '#4158D0'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  font-size: 1rem;
  font-weight: 500;
  flex: 1;
  max-width: 200px;

  &:hover {
    background: ${props => props.primary ? 'rgb(55, 188, 110)' : '#3648B0'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

function FarmerCards() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // For testing without backend, comment the axios call and uncomment next line
        // setProfiles(dummyData);
        const response = await axios.get(`${API_BASE_URL}/all-profiles`);
        setProfiles(response.data.profiles);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load farmer profiles. Please try again later.');
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
  };

  const closeModal = () => {
    setSelectedProfile(null);
  };

  // Navigate to the feedback page with the farmer's ID when Review button is clicked
  // const handleReview = () => {
  //   if (selectedProfile) {
  //     // Close the modal
  //     closeModal();
  //     // Navigate to the feedback page with the farmer ID as a parameter
  //     navigate('/farmerfeedback');
  //     // navigate(`/farmerfeedback?farmerId=${selectedProfile.id}&farmerName=${encodeURIComponent(selectedProfile.username)}`);
  //   }
  // };

  const handleReview = (profile) => {
    navigate('/farmerfeedback', { 
      state: { 
        farmerId: profile.id,
        farmerName: profile.username 
      }
    });
    // OR using URL params:
    // navigate(`/farmerfeedback?farmerId=${profile.id}&farmerName=${encodeURIComponent(profile.username)}`);
  };

  const handleChatMe = () => {
    if (selectedProfile) {
      closeModal();
      // navigate('/message', { state: { farmer: selectedProfile } });
      // Navigate to different routes based on selectedProfile.id
      if (selectedProfile.id === 1) {
        navigate('/message');
      } else if (selectedProfile.id === 2) {
        navigate('/message2');
      } else if (selectedProfile.id === 3) {
        navigate('/message3');
      } else if (selectedProfile.id === 4) {
        navigate('/message4');
      } else if (selectedProfile.id === 5) {
        navigate('/message5');
      } else if (selectedProfile.id === 6) {
        navigate('/message6');
      } else {
        // Default case for other IDs
        navigate('/message');
      }
    }
  };

  // Dummy data for testing
  const dummyData = [
    {
      id: 1,
      username: "Organic Farm Co.",
      profile_image: "/images/farmer.jpg",
      about_me: "Certified organic farm since 2010",
      location: "California, USA",
      work_experience: "15 years farming experience",
      phone_number: "+1 555-1234",
      email: "contact@organicfarm.com",
      facebook_link: "#",
      instagram_link: "#",
      products: [
        {
          id: 1,
          name: "Organic Tomatoes",
          images: ["/images/tomatoes.jpg"],
          price: 3.99,
          details: "Heirloom variety, pesticide-free",
          stock_quantity: 50
        },
        {
          id: 2,
          name: "Fresh Basil",
          images: ["/images/basil.jpg"],
          price: 2.99,
          details: "Grown in greenhouse",
          stock_quantity: 100
        }
      ]
    }
  ];

  if (loading) {
    return <LoadingMessage>Loading farmer profiles...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (profiles.length === 0) {
    return <LoadingMessage>No farmer profiles found.</LoadingMessage>;
  }

  return (
    <>
      <CardsContainer>
        {profiles.map((profile) => (
          <FarmerCard key={profile.id}>
            <ProfileHeader>
              <div>
                <ProfileImage
                  src={profile.profile_image ? 
                    `${API_BASE_URL.replace('/api', '')}${profile.profile_image}` : 
                    "https://via.placeholder.com/100"}
                  alt={profile.username}
                />
                <ProfileName>{profile.username}</ProfileName>
                <AboutMeText>{profile.about_me || 'No description provided'}</AboutMeText>
              </div>
            </ProfileHeader>

            <ProfileBody>
              <ProfileDetail>
                <strong>Location:</strong> {profile.location || 'Not specified'}
              </ProfileDetail>
              <ProfileDetail>
                <strong>Experience:</strong> {profile.work_experience || 'Not specified'}
              </ProfileDetail>
              <ProfileDetail>
                <strong>Contact:</strong> {profile.phone_number || 'Not provided'}
              </ProfileDetail>

              {(profile.facebook_link || profile.instagram_link) && (
                <SocialLinks>
                  {profile.facebook_link && (
                    <a href={profile.facebook_link} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                  )}
                  {profile.instagram_link && (
                    <a href={profile.instagram_link} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faInstagram} />
                    </a>
                  )}
                </SocialLinks>
              )}

              <ViewProfileButton onClick={() => handleViewProfile(profile)}>
                View Profile
              </ViewProfileButton>
            </ProfileBody>
          </FarmerCard>
        ))}
      </CardsContainer>

      {selectedProfile && ReactDOM.createPortal(
        <ModalBackdrop onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            
          <div className="modal-header" style={{ 
            display: 'flex', 
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: '20px',
            borderBottom: '1px solid #eaeaea',
            textAlign: 'left'
          }}>
            <ProfileImage
              src={selectedProfile.profile_image ? 
                `${API_BASE_URL.replace('/api', '')}${selectedProfile.profile_image}` : 
                "https://via.placeholder.com/100"}
              alt={selectedProfile.username}
              style={{ 
                width: '120px', 
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginRight: '20px'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <ProfileName style={{
                fontSize: '22px',
                fontWeight: '600',
                margin: '0 0 10px 0'
              }}>
                {selectedProfile.username}
              </ProfileName>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: '#555',
                margin: '0',
                maxWidth: '400px'
              }}>
                {selectedProfile.about_me || 'No description provided'}
              </p>
            </div>
          </div>

            <div className="modal-body">
              <ProfileDetail>
                <strong>Location:</strong> {selectedProfile.location}
              </ProfileDetail>
              <ProfileDetail>
                <strong>Experience:</strong> {selectedProfile.work_experience}
              </ProfileDetail>
              <ProfileDetail>
                <strong>Contact:</strong> {selectedProfile.phone_number}
              </ProfileDetail>
              <ProfileDetail>
                <strong>Email:</strong> {selectedProfile.email}
              </ProfileDetail>

              <SocialLinks>
                {selectedProfile.facebook_link && (
                  <a href={selectedProfile.facebook_link} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFacebookF} size="2x" />
                  </a>
                )}
                {selectedProfile.instagram_link && (
                  <a href={selectedProfile.instagram_link} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} size="2x" />
                  </a>
                )}
              </SocialLinks>

              {/* Updated buttons with proper event handlers */}
              <ButtonsContainer>
                <ActionButton primary onClick={handleReview}>
                  Review
                </ActionButton>
                <ActionButton onClick={handleChatMe}>
                  Chat Me
                </ActionButton>
              </ButtonsContainer>

              {selectedProfile.products?.length > 0 && (
                <ProductsSection>
                  <h3>Products</h3>
                  <ModalProductsGrid>
                    {selectedProfile.products.map((product) => (
                      <ProductCard key={product.id}>
                        {product.images?.length > 0 && (
                          <ProductImage
                            src={`${API_BASE_URL.replace('/api', '')}${product.images[0]}`}
                            alt={product.name}
                          />
                        )}
                        <ProductName>{product.name}</ProductName>
                        <ProductPrice>Rs.{product.price}</ProductPrice>
                        <p>{product.details}</p>
                        <ProfileDetail>
                          <strong>Stock:</strong> {product.stock_quantity}
                        </ProfileDetail>
                      </ProductCard>
                    ))}
                  </ModalProductsGrid>
                </ProductsSection>
              )}
            </div>
          </ModalContent>
        </ModalBackdrop>,
        document.body
      )}
    </>
  );
}

// Combined Component with shared background and adjusted slider position
function CombinedFarmerPage() {
  return (
    <PageWrapper>
      {/* Slider Section with adjusted position */}
      <SliderSection>
        <FarmerSlider />
      </SliderSection>
      
      {/* Cards Section */}
      <div>
        <FarmerCards />
      </div>
    </PageWrapper>
  );
}

export default CombinedFarmerPage;



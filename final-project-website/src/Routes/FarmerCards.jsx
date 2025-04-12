import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = "http://localhost:5000/api";

// Styled Components
const CardsContainer = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  background-color: #23d947;
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
  background: linear-gradient(45deg, #4158D0, #C850C0);
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
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #f44336;
`;

const ViewProfileButton = styled.button`
  background: #4158D0;
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
    background: #C850C0;
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

export default function FarmerCards() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

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
          category: "Vegetables",
          available_quantity: 50
        },
        {
          id: 2,
          name: "Fresh Basil",
          images: ["/images/basil.jpg"],
          price: 2.99,
          details: "Grown in greenhouse",
          category: "Herbs",
          available_quantity: 100
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
                View Full Profile
              </ViewProfileButton>
            </ProfileBody>
          </FarmerCard>
        ))}
      </CardsContainer>

      {selectedProfile && ReactDOM.createPortal(
        <ModalBackdrop onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            
            <div className="modal-header">
              <ProfileImage
                src={selectedProfile.profile_image ? 
                  `${API_BASE_URL.replace('/api', '')}${selectedProfile.profile_image}` : 
                  "https://via.placeholder.com/100"}
                alt={selectedProfile.username}
                style={{ width: '120px', height: '120px' }}
              />
              <ProfileName>{selectedProfile.username}</ProfileName>
              <p>{selectedProfile.about_me || 'No description provided'}</p>
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
                        <ProductPrice>${product.price}</ProductPrice>
                        <p>{product.details}</p>
                        <ProfileDetail>
                          <strong>Category:</strong> {product.category}
                        </ProfileDetail>
                        <ProfileDetail>
                          <strong>Stock:</strong> {product.available_quantity}
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
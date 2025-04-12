import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";

// API base URL - should match your backend
const API_BASE_URL = "http://localhost:5000/api";

// Styled components for the cards
const CardsContainer = styled.div`
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
`;

const FarmerCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ProfileHeader = styled.div`
  position: relative;
  height: 200px;
  background: linear-gradient(45deg, #4158D0, #C850C0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 20px;
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  margin-bottom: 15px;
`;

const ProfileBody = styled.div`
  padding: 20px;
`;

const ProfileName = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.5rem;
`;

const ProfileDetail = styled.p`
  margin: 8px 0;
  color: #666;
  font-size: 0.9rem;
  
  strong {
    color: #444;
    margin-right: 5px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0;
  
  a {
    color: #4158D0;
    font-size: 1.2rem;
    transition: color 0.2s ease;
    
    &:hover {
      color: #C850C0;
    }
  }
`;

const ProductsSection = styled.div`
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
`;

const ProductCard = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
`;

const ProductName = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const ProductPrice = styled.p`
  font-weight: bold;
  color: #4158D0;
  margin: 5px 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #f44336;
`;

export default function FarmerCards() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
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
    <CardsContainer>
      {profiles.map((profile) => (
        <FarmerCard key={profile.id}>
          <ProfileHeader>
            <div>
              {profile.profile_image ? (
                <ProfileImage 
                  src={`${API_BASE_URL.replace('/api', '')}${profile.profile_image}`} 
                  alt={profile.username} 
                />
              ) : (
                <ProfileImage 
                  src="https://via.placeholder.com/100" 
                  alt="Default profile" 
                />
              )}
              <ProfileName>{profile.username}</ProfileName>
              <p>{profile.about_me || 'No description provided'}</p>
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
                    <i className="fab fa-facebook"></i>
                  </a>
                )}
                {profile.instagram_link && (
                  <a href={profile.instagram_link} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                  </a>
                )}
              </SocialLinks>
            )}
            
            {profile.products && profile.products.length > 0 && (
              <ProductsSection>
                <h5>Products</h5>
                {profile.products.map((product) => (
                  <ProductCard key={product.id}>
                    <ProductName>{product.name}</ProductName>
                    {product.images.length > 0 && (
                      <ProductImage 
                        src={`${API_BASE_URL.replace('/api', '')}${product.images[0]}`} 
                        alt={product.name} 
                      />
                    )}
                    <ProductPrice>${product.price || 'Price not set'}</ProductPrice>
                    <p>{product.details || 'No details provided'}</p>
                  </ProductCard>
                ))}
              </ProductsSection>
            )}
          </ProfileBody>
        </FarmerCard>
      ))}
    </CardsContainer>
  );
}
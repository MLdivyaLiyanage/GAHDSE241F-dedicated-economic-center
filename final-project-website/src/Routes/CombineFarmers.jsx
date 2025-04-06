import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from 'styled-components';
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";

// Card Component for Image Slider
const SliderCard = () => {
  return (
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
  );
};

// The Farmer Cards component
const FarmerCards = ({ imageUrls }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  
  const fetchUserDetails = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to fetch user details: ${response.status}${errorData.error ? ' - ' + errorData.error : ''}`);
      }
      
      const data = await response.json();
      console.log("Fetched user data:", data); // For debugging
      setSelectedUser(data); // Store fetched details in state
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (id) => {
    setRetryCount(prev => prev + 1);
    fetchUserDetails(id);
  };

  const farmerNames = [
    'Saman Perera', 'Rohana Silva', 'Bandara Wijesinghe', 'Sunil Jayawardena', 'Sarath Kumara',
    'Kamal Rathnayake', 'Gayan Fernando', 'Thilakaratne Mudalige', 'Mahinda Ekanayake', 'Ravindra Senanayake',
    'Dinesh Wickramasinghe', 'Janaka Jayasundara', 'Upul Wijeratne', 'Ajith Kumara', 'Chandana Herath'
  ];
  
  const productNames = [
    'Grows Lime', 'Grows Garlic', 'Grows Onion', 'Grows Lettuce Leaves', 'Grows Leeks',
    'Grows Cabbage Flowers', 'Grows Cucumber', 'Grows Cabbage', 'Grows Green Chillies', 'Grows Tomato',
    'Grows Potato', 'Grows Brinjals', 'Grows Bell Pepper', 'Grows Pumpkin', 'Grows Beetroot'
  ];

const CardItems = Array.from({ length: 15 }, (_, index) => {
    const imageUrl = imageUrls[index] || `https://placeimg.com/240/130/tech?${index}`;
    const farmerName = farmerNames[index % farmerNames.length];
    const productName = productNames[index % productNames.length];
    const userId = index + 1;


    return (
      <div className="card" key={index}>
        <div className="image-container">
          <img src={imageUrl} alt={`Farmer ${index + 1}`} className="image" />
        </div>

        <div className="content">
          <div className="brand">{farmerName}</div>
          <div className="product-name">{productName}</div>
        </div>
        <div className="button-container">
          <button onClick={() => fetchUserDetails(userId)}>
            <span className="shadow" />
            <span className="edge" />
            <span className="front text">View Details</span>
          </button>
        </div>
      </div>
    );
});

const FarmerCards = ({ imageUrls }) => {
  // Create cards with proper farmer IDs
  const CardItems = Array.from({ length: 15 }, (_, index) => {
    const imageUrl = imageUrls[index] || `https://placeimg.com/240/130/tech?${index}`;
    const farmerName = farmerNames[index % farmerNames.length];
    const productName = productNames[index % productNames.length];
    const userId = index + 1;

    return (
      <div className="card" key={index}>
        <div className="image-container">
          <img src={imageUrl} alt={`Farmer ${index + 1}`} className="image" />
        </div>

        <div className="content">
          <div className="brand">{farmerName}</div>
          <div className="product-name">{productName}</div>
        </div>
        <div className="button-container">
          <button onClick={() => fetchUserDetails(userId)}>
            <span className="shadow" />
            <span className="edge" />
            <span className="front text">View Details</span>
          </button>
        </div>
      </div>
    );
  });

  return <div className="cards-container">{CardItems}</div>;
};

  return (
    <div>
      <div className="cards-container">{CardItems}</div>
      
      {isLoading && (
        <LoadingOverlay>
          <div className="loading-spinner">Loading...</div>
        </LoadingOverlay>
      )}
      
      {error && (
        <ErrorOverlay>
          <div className="error-message">
            <p>Error: {error}</p>
            {error.includes("500") && (
              <p className="error-hint">
                This might be caused by database connection issues or missing data.
                Make sure your database is set up correctly with proper tables and data.
              </p>
            )}
            <div className="button-group">
              <button className="retry-button" onClick={() => handleRetry(selectedUser?.id || 1)}>Retry</button>
              <button className="close-button" onClick={() => setError(null)}>Close</button>
            </div>
          </div>
        </ErrorOverlay>
      )}
      
      {selectedUser && (
        <EnhancedUserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

// Enhanced Modal to show user details and related data
const EnhancedUserModal = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  

  useEffect(() => {
    if (activeTab === 'reviews' && user) {
      fetchFeedback();
    }
  }, [activeTab, user]);

  const fetchFeedback = async () => {
    setIsLoadingFeedback(true);
    setFeedbackError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/feedback?farmerId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      setFeedbackError(error.message);
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handleNewFeedback = (newFeedback) => {
    setFeedback(prev => [newFeedback, ...prev]);
  };

  if (!user) return null;

  return (
    <ModalOverlay onClick={() => onClose()}>
      <EnhancedModalContent onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{user.username || user.name || 'User Profile'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="user-summary">
            <div className="profile-image">
              {user.profile_image_url ? (
                <img src={user.profile_image_url} alt={user.username || 'User'} />
              ) : (
                <div className="default-avatar">
                  {(user.username || user.name || 'U').charAt(0)}
                </div>
              )}
            </div>
            <div className="user-basic-info">
              <h3>{user.username || user.name || 'User'}</h3>
              <p className="user-location">{user.location || 'No location'}</p>
              <div className="button-container" style={{ display: "flex", gap: "10px" }}>
  <button 
    className="review-button" 
    onClick={() => navigate(`/farmerfeedback/${user.id}`)}
    style={{ 
      backgroundColor: "#90EE90", 
      color: "white", 
      padding: "10px 10px", 
      border: "none", 
      borderRadius: "5px", 
      cursor: "pointer",
      fontWeight: "bold"
    }}
  > 
    Review
  </button>
  
  <button 
    className="chat-button" 
    onClick={() => {
      // Navigate to different routes based on farmer ID
      if (user.id === 1) {
        navigate('/message');
      } else if (user.id === 2) {
        navigate('/message2');
      } else if (user.id === 3) {
        navigate('/message3');
      }
      else if (user.id === 4) {
        navigate('/message4');
      }
      else if (user.id === 5) {
        navigate('/message5');
      }
      else if (user.id == 6) {
        navigate('/message6');
      }
      else{
        // Default case for other farmers
        navigate('/message');
      }
    }}
    style={{ 
      backgroundColor: "#90EE90", 
      color: "white", 
      padding: "10px 10px", 
      border: "none", 
      borderRadius: "5px", 
      cursor: "pointer",
      fontWeight: "bold"
    }}
  > 
    Chat with Me
  </button>
</div>
            </div>
          </div>

          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Products ({user.products?.length || 0})
            </button>
            <button 
              className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveTab('social')}
            >
              Social Media
            </button>
            <button 
              className={`tab-button ${activeTab === 'review' ? 'active' : ''}`}
              onClick={() => setActiveTab('review')}
            >
               Review
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'profile' && (
              <div className="profile-content">
                <div className="info-section">
                  <h4>Contact Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{user.email || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone:</span>
                      <span className="info-value">{user.phone_number || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Address:</span>
                      <span className="info-value">{user.address || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">ID Number:</span>
                      <span className="info-value">{user.id_number || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="info-section">
                  <h4>Personal Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Age:</span>
                      <span className="info-value">{user.age || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="about-section">
                  <h4>About</h4>
                  <p>{user.about_me || "No information provided."}</p>
                </div>
                
                {user.work_experience && (
                  <div className="experience-section">
                    <h4>Experience</h4>
                    <p>{user.work_experience}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="products-content">
                <h4>Products</h4>
                {user.products && user.products.length > 0 ? (
                  <div className="products-grid">
                    {user.products.map((product, index) => (
                      <div className="product-card" key={product.id || index}>
                        <div className="product-image">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0].image_url} alt={product.product_name} />
                          ) : (
                            <div className="default-product-image">No Image</div>
                          )}
                        </div>
                        <div className="product-details">
                          <h5>{product.product_name}</h5>
                          <p className="price">${product.product_price}</p>
                          <p className="details">{product.product_details || "No details available."}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No products available.</p>
                )}
              </div>
            )}

            {activeTab === 'social' && (
              <div className="social-content">
                <h4>Social Media Links</h4>
                {user.social_media && user.social_media.length > 0 ? (
                  <div className="social-links">
                    {user.social_media.map((link, index) => (
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="social-link" 
                        key={link.id || index}
                      >
                        <div className="platform-icon">{(link.platform || 'S').charAt(0)}</div>
                        <span>{link.platform}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No social media links available.</p>
                )}
              </div>
            )}
            <div className="tab-content">
              {activeTab === 'reviews' && (
                <div className="reviews-content">
                  <RatingAndFeedback 
                    farmerId={user.id} 
                    onNewFeedback={handleNewFeedback} 
                  />
                  {isLoadingFeedback && <p>Loading reviews...</p>}
                  {feedbackError && <p className="error">{feedbackError}</p>}
                  <div className="reviews-list">
                    {feedback.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <span className="review-author">{review.name}</span>
                          <span className="review-date">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                              {i < review.rating ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </EnhancedModalContent>
    </ModalOverlay>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .loading-spinner {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    font-weight: bold;
  }
`;

const ErrorOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .error-message {
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    
    p {
      color: #ff3333;
      margin-bottom: 15px;
    }
    
    .error-hint {
      color: #666;
      font-size: 0.9rem;
      padding: 10px;
      background: #f8f8f8;
      border-radius: 5px;
      border-left: 3px solid #0A44F4;
    }
    
    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    
    .retry-button {
      padding: 5px 15px;
      background: #0A44F4;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    
    .close-button {
      padding: 5px 15px;
      background: #f8f8f8;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 5px;
      cursor: pointer;
    }
  }
`;

// This is the enhanced modal content with detailed styling from the second file
const EnhancedModalContent = styled.div`
  background: white;
  padding: 0;
  border-radius: 15px;
  text-align: left;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 1px solid #eee;
    background-color: #f8f8f8;
    border-radius: 15px 15px 0 0;
  }
  
  h2 {
    color: #333;
    margin: 0;
    font-size: 1.5rem;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #0A44F4;
    }
  }
  
  .modal-body {
    padding: 0;
  }
  
  .user-summary {
    display: flex;
    align-items: center;
    padding: 20px 25px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #eee;
  }
  
  .profile-image {
    width: 80px;
    height: 80px;
    margin-right: 20px;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .default-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #0A44F4;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  }
  
  .user-basic-info {
    h3 {
      margin: 0 0 5px 0;
      color: #333;
      font-size: 1.3rem;
    }
    
    .user-location {
      color: #666;
      margin: 0;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
    }
  }
  
  .tabs {
    display: flex;
    border-bottom: 2px solid #eee;
    background-color: white;
    padding: 0 25px;
  }
  
  .tab-button {
    padding: 15px 20px;
    margin-right: 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1rem;
    color: #666;
    transition: all 0.3s ease;
    position: relative;
    
    &.active {
      color: #0A44F4;
      font-weight: 600;
      
      &:after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: #0A44F4;
      }
    }
    
    &:hover {
      color: #0A44F4;
    }
  }
  
  .tab-content {
    padding: 25px;
  }
  
  .profile-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .info-section {
    margin-bottom: 20px;
    
    h4 {
      color: #333;
      margin: 0 0 15px 0;
      font-size: 1.1rem;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    
    .info-label {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 5px;
    }
    
    .info-value {
      font-size: 1rem;
      color: #333;
    }
  }
  
  .about-section, .experience-section {
    margin-bottom: 20px;
    
    h4 {
      color: #333;
      margin: 0 0 15px 0;
      font-size: 1.1rem;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    
    p {
      margin: 0;
      line-height: 1.6;
      color: #333;
    }
  }
  
  .products-content {
    h4 {
      color: #333;
      margin: 0 0 20px 0;
      font-size: 1.1rem;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }
  
  .product-card {
    border: 1px solid #eee;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
  }
  
  .product-image {
    height: 150px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .default-product-image {
      width: 100%;
      height: 100%;
      background-color: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    }
  }
  
  .product-details {
    padding: 15px;
    
    h5 {
      margin: 0 0 10px 0;
      font-size: 1rem;
    }
    
    .price {
      color: #0A44F4;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .details {
      font-size: 0.85rem;
      color: #666;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
  
  .social-content {
    h4 {
      color: #333;
      margin: 0 0 20px 0;
      font-size: 1.1rem;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
  }
  
  .social-links {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .social-link {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-radius: 10px;
    background-color: #f0f0f0;
    color: #333;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #e0e0e0;
      transform: translateY(-3px);
    }
  }
  
  .platform-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #0A44F4;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 14px;
  }
  
  .no-data {
    color: #666;
    text-align: center;
    padding: 20px 0;
    background-color: #f8f8f8;
    border-radius: 10px;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .info-grid {
      grid-template-columns: 1fr;
    }
    
    .products-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
  }
  
  @media (max-width: 480px) {
    .user-summary {
      flex-direction: column;
      text-align: center;
    }
    
    .profile-image {
      margin-right: 0;
      margin-bottom: 15px;
    }
    
    .tabs {
      overflow-x: auto;
      padding: 0 15px;
    }
    
    .tab-button {
      padding: 15px 10px;
      font-size: 0.9rem;
      white-space: nowrap;
    }
    
    .tab-content {
      padding: 15px;
    }
  }
`;

// Images array for farmer cards
const images = [
  'src/assets/Farmer1.jpg',
  'src/assets/Farmer2.jpg',
  'src/assets/Farmer3.jpg',
  'src/assets/Farmer4.jpg',
  'src/assets/Farmer5.jpg',
  'src/assets/Farmer6.jpg',
  'src/assets/Farmer7.jpg',
  'src/assets/Farmer8.jpg',
  'src/assets/Farmer9.jpg',
  'src/assets/Farmer10.jpg',
  'src/assets/Farmer11.jpg',
  'src/assets/Farmer12.jpg',
  'src/assets/Farmer13.jpg',
  'src/assets/Farmer14.jpg',
  'src/assets/Farmer15.jpg',
];

// Main combined component
function CombinedFarmersComponent() {
  return (
    <MainContainer>
      {/* Top section with slider */}
      <div className="slider-section">
        <SliderCard />
      </div>
      
      {/* Bottom section with farmer cards */}
      <div className="farmers-grid-section">
        <FarmerCards imageUrls={images} />
      </div>
    </MainContainer>
  );
}

// Main container with background styling for the entire page
const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  
  /* Adding main background image for the entire page */
  background-image: url('src/assets/backimg1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  
  /* Overlay for better readability */
  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
  
  .slider-section {
    position: relative;
    height: 50vh;
    width: 100%;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 0;
    margin-bottom: -20px;
  }
  
  .farmers-grid-section {
    position: relative;
    padding-top: 0;
    padding-bottom: 2rem;
    z-index: 2;
    margin-top: 0;
  }
  
  /* Slider styles */
  .slider {
    width: 100%;
    height: var(--height);
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);
    position: relative;
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
    animation: autoRun 15s linear infinite;
    transition: filter 0.5s;
    animation-delay: calc((15s / var(--quantity)) * (var(--position) - 1) - 15s);
  }

  .slider .list .item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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
    filter: grayscale(0.5);
  }

  .slider .item:hover {
    filter: grayscale(0);
    transform: scale(1.05);
  }

  /* Cards grid styling */
  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    padding: 1.5rem;
    padding-top: 0.5rem;
    justify-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .card {
    --accent-color: rgb(10, 68, 244);
    position: relative;
    width: 100%;
    max-width: 240px;
    height: 330px;
    background: rgba(255, 255, 255, 0.85);
    backdrop
    backdrop-filter: blur(5px);
    border-radius: 15px; 
    padding: 0.8rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease-in-out;
    z-index: 2;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    background: rgba(255, 255, 255, 0.95);
  }

  .card .image-container {
    position: relative;
    width: 100%;
    height: 180px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .card .image-container .image {
    height: 100%;
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .card:hover .image-container .image {
    transform: scale(1.05);
  }

  .card .content {
    padding: 0px 0.5rem;
    margin-bottom: 1rem;
  }

  .card .content .brand {
    font-weight: 700;
    color: #333;
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }

  .card .content .product-name {
    font-weight: 500;
    color: #666666;
    font-size: 0.85rem;
    margin-bottom: 0.8rem;
  }

  .card .button-container {
    display: flex;
    justify-content: center;
  }

  .card .button-container button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    border-radius: 0.5rem;
    background-color: #0A44F4;
    border: none;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .card .button-container button:hover {
    background-color: #083bbf;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .slider-section {
      height: 35vh;
      margin-bottom: -15px;
    }
    
    .cards-container {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      padding: 1rem;
      padding-top: 0.5rem;
    }
    
    .card {
      max-width: 200px;
      height: 300px;
    }
  }

  @media (max-width: 480px) {
    .slider-section {
      height: 30vh;
      margin-bottom: -10px;
    }
    
    .cards-container {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
    
    .card {
      max-width: 150px;
      height: 280px;
      padding: 0.5rem;
    }
    
    .card .image-container {
      height: 150px;
    }
    
    .card .content .brand {
      font-size: 0.9rem;
    }
    
    .card .content .product-name {
      font-size: 0.75rem;
    }
    
    .card .button-container button {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }
  }
`;


export default CombinedFarmersComponent;
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
//import axios from "axios";
import { FaStar } from "react-icons/fa";

// API base URL - change this to match your backend server address
//const API_BASE_URL = "http://localhost:5000/api";

const StyledButton = styled.button`
  display: inline-block;
  padding: 12px 30px;
  background: linear-gradient(45deg, #4158D0, #C850C0);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background: linear-gradient(45deg, #3a4fbd, #b747af);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
`;

// Custom object-shaped profile upload box with custom position
const ObjectShapedBox = styled.div`
  position: relative;
  width: 400px;  // Medium-sized box width
  height: 300px; // Medium-sized box height
  margin: 0 0 30px 0; // Remove auto margin - position at the left
  cursor: pointer;

  .profile-image {
    width: 100%;
    height: 100%;
    border-radius: 0; // Sharp corners for object-like shape
    object-fit: cover;
    border: 3px solid #4158D0; // Colored border to highlight the object shape
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }

  .profile-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 0; // Sharp corners
    background: linear-gradient(145deg, #e6e7e9, #f6f7f9);
    border: 3px solid #4158D0; // Colored border
    box-shadow: 8px 8px 0px #C850C0; // Offset shadow for 3D object look
    color: #555;
    font-weight: 500;
    transition: all 0.3s ease;
    text-align: center;
    padding: 15px;
    position: relative;
  }

  .profile-placeholder:hover {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0px #C850C0;
  }

  .profile-upload-icon {
    position: absolute;
    bottom: -10px;
    right: -10px;
    background: #4158D0;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 0; // Square icon to match object theme
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 3px 3px 0px #C850C0;
    transition: all 0.3s ease;
    font-size: 18px;
  }

  .profile-upload-icon:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px #C850C0;
  }
`;

// Notification component
const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  background-color: ${props => props.type === 'success' ? '#4CAF50' : '#f44336'};
  color: white;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s forwards;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

// Profile View Styling
const ProfileWrapper = styled.div`
  .profile-container {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(to right, #f4f4f4, #e0e0e0, #d0d0d0);
    padding: 2% 2% 100px 2%;
    position: relative;
  }

  .card {
    width: 400px;
    height: 300px;
    background: linear-gradient(135deg, rgba(236, 236, 236, 0.9), rgba(200, 200, 200, 0.8));
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
                rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
                rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    position: absolute;
    top: 15%;
    left: 1%;
    transition: all 0.3s ease-in-out;
  }

  .card:hover {
    transform: scale(1.05);
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
  }

  .card-text {
    max-width: 300px;
    font-size: 18px;
    line-height: 1.5;
    color: #333;
    background: #fff;
    padding: 20px;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    position: absolute;
    top: 15%;
    left: 30%;
    text-align: center;
    transition: all 0.3s ease-in-out;
  }

  .rating-card {
    width: 25%;
    max-width: 500px;
    min-width: 300px;
    font-size: 18px;
    color: #333;
    background: #fff;
    padding: 10px;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    position: absolute;
    top: 62%;
    left: 1%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
  }

  .rating-card:hover {
    background: linear-gradient(135deg, #ffbc00, #ff5c00);
  }

  .stars {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin-top: 5px;
  }

  .about-card {
    max-width: 650px;
    font-size: 18px;
    line-height: 1.5;
    color: #333;
    background: linear-gradient(135deg, #ffffff, #f0f0f0, #d0d0d0);
    padding: 20px;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    position: absolute;
    top: 15%;
    left: 55%;
    transition: all 0.3s ease-in-out;
  }

  .about-card:hover {
    background: linear-gradient(135deg, #e0e0e0, #c0c0c0);
  }

  .product-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 50px 2% 2% 2%;
    background: linear-gradient(to right, #f4f4f4, #e0e0e0);
  }

  .product-card {
    width: 100%;
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    margin-bottom: 20px;
  }

  .product-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 20px;
  }

  .product-item {
    width: 200px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    transition: all 0.3s ease;
  }

  .product-item:hover {
    transform: scale(1.05);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px;
  }

  .product-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  .product-details {
    padding: 10px;
    background: white;
  }

  .product-name {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .product-price {
    color: #4158D0;
    font-weight: bold;
  }
`;

// Feedback Styling
const FeedbackContainer = styled.div`
  width: 100%;
  padding: 2%;
  background: linear-gradient(to right, #e0e0e0, #f4f4f4);

  .feedback-title {
    text-align: center;
    font-size: 28px;
    margin-bottom: 20px;
    color: #333;
  }

  .feedback-form {
    max-width: 800px;
    margin: 0 auto 40px auto;
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }

  .form-input, .form-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border 0.3s ease;
  }

  .form-input:focus, .form-textarea:focus {
    border-color: #4158D0;
    outline: none;
  }

  .star-rating {
    display: flex;
    gap: 10px;
  }

  .star-btn {
    background: none;
    border: none;
    font-size: 30px;
    color: #ddd;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .star-btn.star-filled {
    color: #FFD700;
  }

  .star-btn:hover {
    transform: scale(1.1);
  }

  .submit-btn {
    background: linear-gradient(45deg, #4158D0, #C850C0);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 12px 30px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: block;
    margin: 0 auto;
  }

  .submit-btn:hover {
    background: linear-gradient(45deg, #3a4fbd, #b747af);
    transform: translateY(-2px);
  }

  .feedback-subtitle {
    font-size: 24px;
    margin: 30px 0 20px 0;
    text-align: center;
    color: #333;
  }

  .feedback-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .feedback-item {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    transition: all 0.3s ease;
  }

  .feedback-item:hover {
    transform: translateY(-5px);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px;
  }

  .feedback-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .feedback-author {
    font-weight: 600;
    color: #333;
  }

  .feedback-date {
    color: #777;
  }

  .stars-display {
    margin-bottom: 10px;
  }

  .star {
    font-size: 18px;
    color: #ddd;
  }

  .star.star-filled {
    color: #FFD700;
  }

  .feedback-comment {
    color: #555;
    line-height: 1.5;
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    text-align: center;
  }

  .feedback-empty {
    text-align: center;
    color: #777;
    font-style: italic;
    margin: 30px 0;
  }
`;

// Main App Component
function FarmerApp() {
  // State to toggle between form view and profile view
  const [viewMode, setViewMode] = useState("form"); // "form" or "profile"

  // User profile state
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  // Product state
  const [productImages, setProductImages] = useState([]); // Store image URLs
  const [productImageFiles, setProductImageFiles] = useState([]); // Store file objects

  // Handle product image uploads
  const handleProductImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setProductImageFiles((prevFiles) => [...prevFiles, ...files]);
    setProductImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  return (
    <div className="app-container">
      {viewMode === "form" ? renderFormView() : renderProfileView()}
    </div>
  );
}


  // Form data state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [address, setAddress] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');

  // Product form data state
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDetails, setProductDetails] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Feedback state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackError, setFeedbackError] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Average rating calculation
  const calculateAverageRating = () => {
    if (feedbackList.length === 0) return 0;
    const sum = feedbackList.reduce((total, item) => total + item.rating, 0);
    return (sum / feedbackList.length).toFixed(1);
  };

  // Show notification helper
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  // Handle profile image selection
  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // Handle product images selection
  const handleProductImagesChange = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setProductImageFiles(prev => [...prev, ...files]);

      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setProductImages(prev => [...prev, ...newPreviewUrls]);
    }
  };

  // Form submission handler - Simulated to switch to profile view
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username) {
      showNotification('error', 'Username is required');
      return;
    }

    setLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      showNotification('success', 'Profile data saved successfully!');
      setLoading(false);

      // Auto-fill the name field in feedback form
      setName(username);

      // Switch to profile view
      setViewMode("profile");

      // Add a default sample feedback for demonstration
      if (feedbackList.length === 0) {
        setFeedbackList([
          {
            id: 1,
            name: "John Doe",
            rating: 5,
            comment: "Great products and excellent service!",
            date: new Date().toISOString()
          }
        ]);
      }
    }, 1500);
  };

  // Fetch feedback - simulated
  useEffect(() => {
    if (viewMode === "profile") {
      setFeedbackLoading(true);

      // Simulate API call
      setTimeout(() => {
        // If no feedback was added yet, we'll add a sample one
        if (feedbackList.length === 0) {
          setFeedbackList([
            {
              id: 1,
              name: "John Doe",
              rating: 5,
              comment: "Great products and excellent service!",
              date: new Date().toISOString()
            }
          ]);
        }
        setFeedbackLoading(false);
      }, 1000);
    }
  }, [viewMode]);

  // Handle feedback submission
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();

    // Validate input
    if (rating === 0 || !comment.trim() || !name.trim()) {
      setFeedbackError('Please provide a rating, your name, and a comment');
      return;
    }

    setFeedbackLoading(true);
    setFeedbackError(null);

    // Create new feedback entry
    const newFeedback = {
      id: feedbackList.length + 1,
      name,
      rating,
      comment,
      date: new Date().toISOString()
    };

    // Simulate API call
    setTimeout(() => {
      // Add to list
      setFeedbackList(prev => [...prev, newFeedback]);

      // Reset form
      setRating(0);
      setComment('');

      setFeedbackLoading(false);
    }, 1000);
  };

  // Render Form View
  const renderFormView = () => {
    return (
      <div className="min-h-screen">
        {notification.show && (
          <Notification type={notification.type}>
            {notification.message}
          </Notification>
        )}

        <form onSubmit={handleSubmit} className="form-container">
          {/* User Profile Section */}
          <div className="form-section">
            <h1 className="section-title">User  Profile</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              <div>
                {/* Object-shaped Profile Box with custom position */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <ObjectShapedBox>
                    <div
                      onClick={() => document.getElementById("profileInput").click()}
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="profile-image"
                        />
                      ) : (
                        <div className="profile-placeholder">
                          <div>
                            <i className="fas fa-user" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
                            <div>Click to Upload</div>
                          </div>
                        </div>
                      )}
                      <div className="profile-upload-icon">
                        <i className="fas fa-camera"></i>
                      </div>
                    </div>
                    <input
                      id="profileInput"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleProfileImageChange}
                      accept="image/*"
                    />
                  </ObjectShapedBox>
                </div>

                {/* Personal Information */}
                <div className="form-field">
                  <label className="field-label">Username</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Email Address</label>
                  <input
                    type="email"
                    className="field-input"
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Age</label>
                  <input
                    type="number"
                    className="field-input"
                    placeholder="Enter Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">About Me</label>
                  <textarea
                    className="field-input"
                    placeholder="Tell something about yourself"
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div>
                {/* Contact Information */}
                <div className="form-field">
                  <label className="field-label">Address</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Enter Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">ID Number</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Enter ID Number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Phone Number</label>
                  <input
                    type="tel"
                    className="field-input"
                    placeholder="Enter Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Location</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Enter Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Work Experience</label>
                  <textarea
                    className="field-input"
                    placeholder="Describe your work experience"
                    value={workExperience}
                    onChange={(e) => setWorkExperience(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-field">
                  <label className="field-label">Social Media Links</label>
                  <div className="social-media-inputs">
                    <div className="social-media-input">
                      <input
                        type="url"
                        className="field-input social-media-field"
                        placeholder="Facebook Profile URL"
                        value={facebookLink}
                        onChange={(e) => setFacebookLink(e.target.value)}
                      />
                    </div>
                    <div className="social-media-input">
                      <input
                        type="url"
                        className="field-input social-media-field"
                        placeholder="Instagram Profile URL"
                        value={instagramLink}
                        onChange={(e) => setInstagramLink(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Section */}
          <div className="form-section">
            <h1 className="section-title">Add Product</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              <div>
                <div className="form-field">
                  <label className="field-label">Product Images</label>
                  <div className="file-input-container">
                    <label className="file-input-label">
                      Choose Product Images
                      <input
                        type="file"
                        multiple
                        className="file-input"
                        onChange={handleProductImagesChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <div className="product-gallery">
                    {productImages.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt="Product"
                        className="product-image"
                      />
                    ))}
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Product Name</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="Enter Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="form-field">
                  <label className="field-label">Product Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="field-input"
                    placeholder="Enter Product Price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Product Details</label>
                  <textarea
                    className="field-input"
                    placeholder="Enter Product Details"
                    value={productDetails}
                    onChange={(e) => setProductDetails(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="button-container">
            <StyledButton type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Upload'}
            </StyledButton>
          </div>
        </form>
      </div>
    );
  };

  const renderProfileView = () => {
    return (
      <>
        {notification.show && (
          <Notification type={notification.type}>
            {notification.message}
          </Notification>
        )}

        <ProfileWrapper>
          <div className="profile-container">
            <div className="card">
              <img 
                src={profileImage || "https://via.placeholder.com/400x300"} 
                alt="Farmer Profile" 
                className="card-image" 
                onError={(e) => e.target.src = "https://via.placeholder.com/400x300"} // Fallback for broken images
              />
            </div>

            <div className="card-text">
              <h2>Farmer Profile</h2>
              <p><strong>Name:</strong> {username || "Not provided"}</p>
              <p><strong>Email:</strong> {email || "Not provided"}</p>
              <p><strong>Phone:</strong> {phoneNumber || "Not provided"}</p>
              <p><strong>Location:</strong> {location || "Not provided"}</p>
            </div>

            {/* Rating Section */}
            <div className="rating-card">
              <h3>Average Rating: {calculateAverageRating()}</h3>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar 
                    key={star} 
                    className={star <= calculateAverageRating() ? "star star-filled" : "star"} 
                  />
                ))}
              </div>
            </div>

            {/* Feedback Section */}
            <FeedbackContainer>
              <h2 className="feedback-title">Feedback</h2>
              <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                {feedbackError && <div className="error-message">{feedbackError}</div>}
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        className={`star-btn ${star <= rating ? 'star-filled' : ''}`} 
                        onClick={() => setRating(star)}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea 
                    className="form-textarea" 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    required 
                  />
                </div>
                <StyledButton type="submit" disabled={feedbackLoading}>
                  {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                </StyledButton>
              </form>

              <h3 className="feedback-subtitle">Previous Feedback</h3>
              <div className="feedback-list">
                {feedbackList.length === 0 ? (
                  <div className="feedback-empty">No feedback available.</div>
                ) : (
                  feedbackList.map(feedback => (
                    <div key={feedback.id} className="feedback-item">
                      <div className="feedback-header">
                        <span className="feedback-author">{feedback.name}</span>
                        <span className="feedback-date">{new Date(feedback.date).toLocaleDateString()}</span>
                      </div>
                      <div className="stars-display">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} className={star <= feedback.rating ? "star star-filled" : "star"} />
                        ))}
                      </div>
                      <p className="feedback-comment">{feedback.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </FeedbackContainer>
          </div>
        </ProfileWrapper>
      </>
    );
  };

  return viewMode === "form" ? renderFormView() : renderProfileView();


export default FarmerApp
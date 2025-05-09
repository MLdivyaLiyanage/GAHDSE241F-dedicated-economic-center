import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./farmerP.css";
import styled from "styled-components";
import axios from "axios"; // Add axios for API calls

// API base URL - change this to match your backend server address
const API_BASE_URL = "http://localhost:5400/api";

// Main container with gradient background
const MainContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

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
  
  &.secondary {
    background: linear-gradient(45deg, #FF8E53, #FE6B8B);
    margin-right: 15px;
  }
`;

// Form container with glass morphism effect
const FormContainer = styled.div`
  background: linear-gradient(to right, rgba(58, 197, 27, 0.96), rgba(68, 72, 77, 0.9));
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px 0 rgba(31, 38, 135, 0.2);
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

// Section title with gradient text
const SectionTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 25px;
  background: linear-gradient(45deg,rgb(237, 237, 237),rgb(255, 255, 255));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

export default function UserProfileForm() {
  // User profile state
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePath, setProfileImagePath] = useState('');
  
  // Product state
  const [productImages, setProductImages] = useState([]);
  const [productImageFiles, setProductImageFiles] = useState([]);
  const [productImagePaths, setProductImagePaths] = useState([]);
  
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
  const [stockQuantity, setStockQuantity] = useState('1'); // Added stock quantity
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [userId, setUserId] = useState(null);
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [userProducts, setUserProducts] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Show notification helper
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5400);
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

  // Upload profile image to server
  const uploadProfileImage = async () => {
    if (!profileImageFile) return profileImagePath; // Return existing path if no new file
    
    try {
      const formData = new FormData();
      formData.append('profileImage', profileImageFile);
      
      const response = await axios.post(`${API_BASE_URL}/upload-profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return response.data.filePath;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      showNotification('error', 'Failed to upload profile image');
      return profileImagePath; // Return existing path on error
    }
  };

  // Upload product images to server
  const uploadProductImages = async () => {
    if (productImageFiles.length === 0) return productImagePaths; // Return existing paths if no new files
    
    try {
      const formData = new FormData();
      productImageFiles.forEach(file => {
        formData.append('productImages', file);
      });
      
      const response = await axios.post(`${API_BASE_URL}/upload-products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Combine new paths with existing paths that we want to keep
      return [...productImagePaths, ...response.data.filePaths];
    } catch (error) {
      console.error('Error uploading product images:', error);
      showNotification('error', 'Failed to upload product images');
      return productImagePaths; // Return existing paths on error
    }
  };

  // Save user profile to server
  const saveUserProfile = async (profileImagePath) => {
    try {
      const userData = {
        username,
        email,
        age: age || null,
        aboutMe,
        address,
        idNumber,
        phoneNumber,
        location,
        workExperience,
        facebookLink,
        instagramLink,
        profileImagePath,
        isUpdate: isEditMode // Flag to indicate if this is an update operation
      };
      
      const response = await axios.post(`${API_BASE_URL}/user-profile`, userData);
      setUserId(response.data.userId);
      return response.data.userId; // Return the userId
    } catch (error) {
      console.error('Error saving user profile:', error);
      showNotification('error', 'Failed to save user profile');
      throw error;
    }
  };

  // Save product to server
  const saveProduct = async (userId, productImagePaths) => { // userId is used here
    try {
      const productData = {
        userId,
        productId: currentProductId, // This will be null for new products
        name: productName,
        description: productDetails,
        price: productPrice || 0,
        stock_quantity: stockQuantity || 1,
        productImagePaths
      };

      let response;
      if (currentProductId) {
      // If we have a product ID, use PUT to update
      response = await axios.put(`${API_BASE_URL}/update-product/${currentProductId}`, productData);
      } else {
      // Otherwise use POST to create new
      response = await axios.post(`${API_BASE_URL}/add-product`, productData);
      }
      
      return response.data.productId;
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification('error', 'Failed to save product');
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username) {
      showNotification('error', 'Username is required');
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Upload profile image
      const uploadedProfileImagePath = await uploadProfileImage();
      
      // 2. Save user profile
      const activeUserId = await saveUserProfile(uploadedProfileImagePath);
      
      // 3. Upload product images
      const uploadedProductImagePaths = await uploadProductImages();
      
      // 4. Save product (if name is provided)
      if (productName) {
        // Use the correct ID (either existing or new)
        const userIdToUse = userId || activeUserId;
        await saveProduct(userIdToUse, uploadedProductImagePaths);
      }
      
      showNotification('success', isEditMode ? 'Profile updated successfully!' : 'Data saved successfully!');
      
      if (!isEditMode) {
        // Reset product form only for new submissions
        setProductName('');
        setProductPrice('');
        setProductDetails('');
        setStockQuantity('1');
        setProductImages([]);
        setProductImageFiles([]);
        setProductImagePaths([]);
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification('error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle searching for a user profile
  const handleSearchUser = async () => {
    if (!searchUsername) {
      showNotification('error', 'Please enter a username to search');
      return;
    }
    
    setLoading(true);
    
    try {
      // Fetch user profile
      const userResponse = await axios.get(`${API_BASE_URL}/user-profile/${searchUsername}`);
      const userData = userResponse.data.user;
      
      // Populate form with user data
      setUsername(userData.username);
      setEmail(userData.email || '');
      setAge(userData.age || '');
      setAboutMe(userData.about_me || '');
      setAddress(userData.address || '');
      setIdNumber(userData.id_number || '');
      setPhoneNumber(userData.phone_number || '');
      setLocation(userData.location || '');
      setWorkExperience(userData.work_experience || '');
      setFacebookLink(userData.facebook_link || '');
      setInstagramLink(userData.instagram_link || '');
      setUserId(userData.id);
      
      // Handle profile image
      if (userData.profile_image) {
        setProfileImagePath(userData.profile_image);
        setProfileImage(`${API_BASE_URL.replace('/api', '')}${userData.profile_image}`);
      }
      
      // Fetch user products
      const productsResponse = await axios.get(`${API_BASE_URL}/user-products/${userData.id}`);
      setUserProducts(productsResponse.data.products);
      
      // If there are products, load the first one
      if (productsResponse.data.products.length > 0) {
        const product = productsResponse.data.products[0];
        loadProductData(product);
      }
      
      setIsEditMode(true);
      showNotification('success', 'User profile loaded successfully!');
      
    } catch (error) {
      console.error('Error searching for user:', error);
      if (error.response && error.response.status === 404) {
        showNotification('error', 'User not found');
      } else {
        showNotification('error', 'Error loading user profile');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load product data into form
  const loadProductData = (product) => {
    setCurrentProductId(product.id);
    setProductName(product.name || '');
    setProductPrice(product.price || '');
    setProductDetails(product.description || '');
    setStockQuantity(product.stock_quantity || '1');
    
    // Load product images
    if (product.images && product.images.length > 0) {
      setProductImagePaths(product.images);
      const imageUrls = product.images.map(path => `${API_BASE_URL.replace('/api', '')}${path}`);
      setProductImages(imageUrls);
    } else {
      setProductImages([]);
      setProductImagePaths([]);
    }
    
    setProductImageFiles([]); // Reset image files since we're loading existing images
  };

  // Reset the form for a new entry
  const handleResetForm = () => {
    // Reset user profile
    setUsername('');
    setEmail('');
    setAge('');
    setAboutMe('');
    setAddress('');
    setIdNumber('');
    setPhoneNumber('');
    setLocation('');
    setWorkExperience('');
    setFacebookLink('');
    setInstagramLink('');
    
    // Reset profile image
    setProfileImage(null);
    setProfileImageFile(null);
    setProfileImagePath('');
    
    // Reset product data
    setProductName('');
    setProductPrice('');
    setProductDetails('');
    setStockQuantity('1');
    setProductImages([]);
    setProductImageFiles([]);
    setProductImagePaths([]);
    
    // Reset IDs and edit mode
    setUserId(null);
    setCurrentProductId(null);
    setIsEditMode(false);
    setUserProducts([]);
    setSearchUsername('');
  };

  // Change current product
  const handleChangeProduct = (productId) => {
    const product = userProducts.find(p => p.id === productId);
    if (product) {
      loadProductData(product);
    }
  };

  const handleDeleteProduct = async () => {
      if (!currentProductId || !userId) {
        showNotification('error', 'No product selected to delete');
        return;
      }
      
      if (!confirm('Are you sure you want to delete this product?')) {
        return;
      }
      
      setLoading(true);
      
      try {
        await axios.delete(`${API_BASE_URL}/delete-product/${currentProductId}?userId=${userId}`);
        
        // Remove product from list and reset form
        setUserProducts(userProducts.filter(p => p.id !== currentProductId));
        
        // Load another product if available, otherwise reset form
        if (userProducts.length > 1) {
          const newProductId = userProducts.find(p => p.id !== currentProductId)?.id;
          if (newProductId) {
            handleChangeProduct(newProductId);
          } else {
            setProductName('');
            setProductPrice('');
            setProductDetails('');
            setStockQuantity('1');
            setProductImages([]);
            setProductImageFiles([]);
            setProductImagePaths([]);
            setCurrentProductId(null);
          }
        } else {
          setProductName('');
          setProductPrice('');
          setProductDetails('');
          setStockQuantity('1');
          setProductImages([]);
          setProductImageFiles([]);
          setProductImagePaths([]);
          setCurrentProductId(null);
        }
        
        showNotification('success', 'Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('error', error.response?.data?.error || 'Failed to delete product');
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainContainer>
      {notification.show && (
        <Notification type={notification.type}>
          {notification.message}
        </Notification>
      )}
      
      <FormContainer>
        {/* Update Profile Search Section */}
        <div className="form-section">
          <SectionTitle>
            {isEditMode ? "Update Profile" : "Create New Profile"}
          </SectionTitle>
          
          <div className="search-container" style={{ display: 'flex', marginBottom: '20px' }}>
            <input
              type="text"
              className="field-input"
              placeholder="Enter username to update"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              style={{ marginRight: '10px', flex: 1 }}
            />
            <StyledButton 
              type="button" 
              className="secondary"
              onClick={handleSearchUser}
              disabled={loading}
            >
              Search
            </StyledButton>
            <StyledButton 
              type="button"
              onClick={handleResetForm}
            >
              New Form
            </StyledButton>
          </div>
          
          {/* Product Selection (only in edit mode) */}
          {isEditMode && userProducts.length > 0 && (
            <div className="product-selector" style={{ marginBottom: '20px' }}>
              <label className="field-label">Select Product to Edit:</label>
              <select 
                className="field-input"
                value={currentProductId || ''}
                onChange={(e) => handleChangeProduct(Number(e.target.value))}
              >
                {userProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {currentProductId && (
              <StyledButton 
                type="button" 
                onClick={handleDeleteProduct}
                style={{ marginLeft: '10px', background: 'linear-gradient(45deg, #FF416C, #FF4B2B)' }}
              >
                Delete Product
              </StyledButton>
            )}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* User Profile Section */}
          <div className="form-section">
            <SectionTitle>User Profile</SectionTitle>

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
                    readOnly={isEditMode} // Make username readonly in edit mode
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
            <SectionTitle>
              {isEditMode && currentProductId ? "Update Product" : "Add Product"}
            </SectionTitle>
            
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
                  <label className="field-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="field-input"
                    placeholder="Enter Stock Quantity"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
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
          <div className="button-container" style={{ textAlign: 'center', marginTop: '30px' }}>
            <StyledButton type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Update' : 'Upload'}
            </StyledButton>
          </div>
        </form>
      </FormContainer>
    </MainContainer>
  );
}
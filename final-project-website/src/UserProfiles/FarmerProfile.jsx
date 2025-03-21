import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./farmerP.css";
import styled from "styled-components";

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

const Button = () => {
  return (
    <div className="button-container">
      <StyledButton>
        Upload
      </StyledButton>
    </div>
  );
};

export default function UserProfileForm() {
  const [profileImage, setProfileImage] = useState(null);
  const [productImages, setProductImages] = useState([]);

  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleProductImagesChange = (e) => {
    const files = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setProductImages([...productImages, ...files]);
  };

  return (
    <div className="min-h-screen">
      <div className="form-container">
        {/* User Profile Section */}
        <div className="form-section">
          <h1 className="section-title">User Profile</h1>

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
                />
              </div>

              {/* New Email Field */}
              <div className="form-field">
                <label className="field-label">Email Address</label>
                <input
                  type="email"
                  className="field-input"
                  placeholder="Enter Email Address"
                />
              </div>

              <div className="form-field">
                <label className="field-label">Age</label>
                <input
                  type="number"
                  className="field-input"
                  placeholder="Enter Age"
                />
              </div>

              <div className="form-field">
                <label className="field-label">About Me</label>
                <textarea
                  className="field-input"
                  placeholder="Tell something about yourself"
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
                />
              </div>

              <div className="form-field">
                <label className="field-label">ID Number</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="Enter ID Number"
                />
              </div>

              <div className="form-field">
                <label className="field-label">Phone Number</label>
                <input
                  type="tel"
                  className="field-input"
                  placeholder="Enter Phone Number"
                />
              </div>

              <div className="form-field">
                <label className="field-label">Location</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="Enter Location"
                />
              </div>

              <div className="form-field">
                <label className="field-label">Work Experience</label>
                <textarea
                  className="field-input"
                  placeholder="Describe your work experience"
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
                    />
                  </div>
                  <div className="social-media-input">
                    <input
                      type="url"
                      className="field-input social-media-field"
                      placeholder="Instagram Profile URL"
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
                />
              </div>
            </div>

            <div>
              <div className="form-field">
                <label className="field-label">Product Price</label>
                <input
                  type="number"
                  className="field-input"
                  placeholder="Enter Product Price"
                />
              </div>

              <div className="form-field">
                <label className="field-label">Product Details</label>
                <textarea
                  className="field-input"
                  placeholder="Enter Product Details"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button />
      </div>
    </div>
  );
}
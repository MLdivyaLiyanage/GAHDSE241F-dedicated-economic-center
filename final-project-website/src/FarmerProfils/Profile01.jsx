import "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./profile01.css";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";

const ProfilePage = () => {
  return (
    <div>
      <ProfileSection />
    </div>
  );
};

const ProfileSection = () => {
  return (
    <StyledWrapper>
      <div className="profile-container">
        <div className="card">
          <img src="src/assets/Farmer5.jpg" alt="Farmer" className="card-image" />
        </div>
        <div className="card-text">
          <h2>Farmer Profile</h2>
          <p>Name: Saman Perera</p>
          <p>Location: Sri Lanka</p>
          <p>Experience: 10+ years in organic farming</p>
          <p>Specialty: Tea & Spice Cultivation</p>
        </div>
        <div className="rating-card">
          <h2>Rating</h2>
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <FaStar key={index} color={index < 4 ? "#ffc107" : "#e4e5e9"} size={24} />
            ))}
          </div>
          <p>4.0 out of 5</p>
        </div>
        <div className="about-card">
          <h2>About Me</h2>
          <p>Hello! I&apos;m Saman Perera, a dedicated farmer from Sri Lanka with over 10 years of experience in organic and sustainable agriculture. I specialize in cultivating high-quality tea and spices using eco-friendly farming practices. My passion for farming drives me to implement innovative techniques that enhance crop quality while preserving the environment. I strongly believe in sustainable agriculture and work closely with local communities to promote organic farming methods.</p>
        </div>
      
      </div>
      <ProductSection />
    </StyledWrapper>
  );
};


const ProductSection = () => {
  return (
    <div className="product-container">
      <div className="product-card">
        <h2>My Product</h2>
      </div>
    </div>
  );
};

const StyledWrapper = styled.div`
  .profile-container {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to right, #f4f4f4, #e0e0e0, #d0d0d0); /* Gradient added */
    padding-left: 2%;
  }

  .card {
    width: 400px;
    height: 300px;
    background: linear-gradient(135deg, rgba(236, 236, 236, 0.9), rgba(200, 200, 200, 0.8)); /* Gradient added */
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
                rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
                rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px; /* Slightly rounded corners */
    position: absolute;
    top: 15%;
    left: 1%;
    transition: all 0.3s ease-in-out;
  }

  .card:hover {
    transform: scale(1.05); /* Slight zoom effect on hover */
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
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
  }

  .rating-card:hover {
    background: linear-gradient(135deg, #ffbc00, #ff5c00); /* Gradient hover effect */
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
    background: linear-gradient(135deg, #ffffff, #f0f0f0, #d0d0d0); /* Gradient added */
    padding: 20px;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    position: absolute;
    top: 15%;
    left: 55%;
    transition: all 0.3s ease-in-out;
  }

  .about-card:hover {
    background: linear-gradient(135deg, #e0e0e0, #c0c0c0); /* Hover effect for about-card */
  }
`;

export default ProfilePage;
import React, { useState } from "react";
import "./Login.css";
import background2 from "../assets/background2.mp4"; // Ensure the correct file extension

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userRole, setUserRole] = useState("");

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="auth-page">
      {/* Background Video */}
      <video src={background2} autoPlay loop muted className="background-video" />

      {/* Main Container */}
      <div className={`container ${isSignUp ? "sign-up-mode" : ""}`}>
        <div className="forms-container">
          <div className="signin-signup">
            {/* Sign In Form */}
            <form className="sign-in-form">
              <h2 className="title">Sign In</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Username" required />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" required />
              </div>
              <input type="submit" value="Login" className="btn" />
              <p className="switch-text">
                Don't have an account? <span onClick={toggleForm}>Sign Up</span>
              </p>
            </form>

            {/* Sign Up Form */}
            <form className="sign-up-form">
              <h2 className="title">Sign Up</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Username" required />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="Email" required />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" required />
              </div>
              <div className="select-field">
                <i className="fas fa-users"></i>
                <select value={userRole} onChange={(e) => setUserRole(e.target.value)} required>
                  <option value="" disabled>Select Role</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Seller">Seller</option>
                </select>
              </div>
              <input type="submit" value="Sign Up" className="btn" />
              <p className="switch-text">
                Already have an account? <span onClick={toggleForm}>Sign In</span>
              </p>
            </form>
          </div>
        </div>

        <div className="overlay-container">
          <div className="overlay-content">
            <h2>{isSignUp ? "Welcome Back!" : "Join Us Today!"}</h2>
            <p>{isSignUp ? "Log in to continue." : "Sign up and start your journey."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

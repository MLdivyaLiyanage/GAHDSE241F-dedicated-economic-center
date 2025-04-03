import { useState } from "react";
import axios from "axios";
import "./Login.css";
import background2 from "../assets/background2.mp4";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    pwrd: "",
    role: "",
  });
  const [loginData, setLoginData] = useState({
    username: "",
    pwrd: ""
  });
  const [message, setMessage] = useState(""); // Success/Error message

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
  };

  // Handle sign-up input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login input changes
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle sign-up form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/registerpost", formData);
      setMessage("User registered successfully!");
      setFormData({ username: "", email: "", pwrd: "", role: "" }); // Reset form
    } catch (error) {
      setMessage(error.response?.data || "Error: Unable to register user.");
      console.error(error);
    }
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", loginData);
      setMessage("Login successful!");
      
      // Store user data in localStorage for session management
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      
      // Redirect to home page after successful login
      window.location.href = "/home";
    } catch (error) {
      setMessage(error.response?.data || "Error: Invalid credentials");
      console.error(error);
    }
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
            <form className="sign-in-form" onSubmit={handleLogin}>
              <h2 className="title">Sign In</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Username" 
                  required 
                  value={loginData.username}
                  onChange={handleLoginChange}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input 
                  type="password" 
                  name="pwrd" 
                  placeholder="Password" 
                  required 
                  value={loginData.pwrd}
                  onChange={handleLoginChange}
                />
              </div>
              <input type="submit" value="Login" className="btn" />
              {!isSignUp && message && <p className="message">{message}</p>}
              <p className="switch-text"> Don&apos;t have an account? <span onClick={toggleForm}>Sign Up</span>
              </p>
            </form>

            {/* Sign Up Form */}
            <form className="sign-up-form" onSubmit={handleSignUp}>
              <h2 className="title">Sign Up</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleChange} />
              </div>

              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
              </div>

              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" name="pwrd" placeholder="Password" required value={formData.pwrd} onChange={handleChange} />
              </div>

              <div className="select-field">
                <i className="fas fa-users"></i>
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="" disabled>Select Role</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
              <input type="submit" value="Sign Up" className="btn" />
              {isSignUp && message && <p className="message">{message}</p>}
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
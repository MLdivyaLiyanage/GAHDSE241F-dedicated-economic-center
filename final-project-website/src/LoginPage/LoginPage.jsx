import { useState } from "react";
import axios from "axios";
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
    pwrd: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:3000/registerpost", formData);
      setMessage("User registered successfully!");
      setFormData({ username: "", email: "", pwrd: "", role: "" });
      setIsLoading(false);
    } catch (error) {
      setMessage(error.response?.data || "Error: Unable to register user.");
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/login", loginData);
      setMessage("Login successful!");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      window.location.href = "/home";
    } catch (error) {
      setMessage(error.response?.data || "Error: Invalid credentials");
      setIsLoading(false);
    }
  };

  // Inline styles for better performance and scoping
  const styles = {
    authPage: {
      position: "relative",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Mulish', sans-serif",
    },
    backgroundVideo: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: -1,
      filter: "brightness(0.7)",
    },
    container: {
      position: "relative",
      width: "800px",
      height: "500px",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      boxShadow: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
      display: "flex",
      overflow: "hidden",
    },
    formsContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "50%",
      height: "100%",
      transition: "transform 0.6s ease-in-out",
    },
    signUpModeFormsContainer: {
      transform: "translateX(100%)",
    },
    signinSignup: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
      textAlign: "center",
    },
    authForm: {
      position: "absolute",
      width: "100%",
      padding: "0 40px",
      transition: "all 0.6s ease-in-out",
    },
    signInForm: {
      opacity: 1,
      transform: "translateX(0)",
    },
    signUpForm: {
      opacity: 0,
      transform: "translateX(100%)",
    },
    signUpModeSignInForm: {
      opacity: 0,
      transform: "translateX(-100%)",
    },
    signUpModeSignUpForm: {
      opacity: 1,
      transform: "translateX(0)",
    },
    title: {
      fontSize: "2rem",
      marginBottom: "30px",
      color: "#333",
    },
    inputField: {
      position: "relative",
      width: "100%",
      margin: "15px 0",
      borderRadius: "25px",
      display: "flex",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      padding: "12px 20px",
    },
    input: {
      border: "none",
      outline: "none",
      background: "transparent",
      width: "100%",
      fontSize: "16px",
      fontFamily: "'Mulish', sans-serif",
    },
    select: {
      border: "none",
      outline: "none",
      background: "transparent",
      width: "100%",
      fontSize: "16px",
      fontFamily: "'Mulish', sans-serif",
      cursor: "pointer",
      color: "#555",
    },
    btn: {
      width: "100%",
      background: "linear-gradient(to right, #6a11cb, #2575fc)",
      border: "none",
      color: "white",
      padding: "12px",
      fontSize: "16px",
      borderRadius: "25px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "15px",
      fontFamily: "'Mulish', sans-serif",
      fontWeight: "600",
    },
    btnHover: {
      background: "linear-gradient(to right, #2575fc, #6a11cb)",
    },
    btnDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
    },
    switchText: {
      marginTop: "20px",
      color: "#666",
      cursor: "pointer",
      fontSize: "14px",
      transition: "color 0.3s ease",
    },
    switchTextHover: {
      color: "#6a11cb",
      textDecoration: "underline",
    },
    message: {
      marginTop: "15px",
      color: "#ff4444",
      fontSize: "14px",
    },
    successMessage: {
      color: "#00C851",
    },
    overlayContainer: {
      position: "absolute",
      top: 0,
      right: 0,
      width: "50%",
      height: "100%",
      background: "linear-gradient(to right,rgba(56, 196, 77, 0.71),rgb(7, 87, 11))",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      transition: "transform 0.6s ease-in-out",
      transform: "translateX(0)",
    },
    signUpModeOverlayContainer: {
      transform: "translateX(-100%)",
    },
    overlayContent: {
      width: "80%",
      padding: "0 30px",
    },
    overlayTitle: {
      fontSize: "2.2rem",
      marginBottom: "20px",
      fontWeight: "700",
    },
    overlayText: {
      fontSize: "16px",
      lineHeight: "1.6",
      marginBottom: "30px",
    },
    overlayBtn: {
      backgroundColor: "transparent",
      border: "2px solid white",
      color: "white",
      padding: "12px 30px",
      borderRadius: "25px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
    },
    overlayBtnHover: {
      backgroundColor: "white",
      color: "#6a11cb",
    },
  };

  return (
    <div style={styles.authPage}>
      <video src={background2} autoPlay loop muted style={styles.backgroundVideo} />
      <div style={{ ...styles.container, ...(isSignUp && {}) }}>
        <div style={{ ...styles.formsContainer, ...(isSignUp && styles.signUpModeFormsContainer) }}>
          <div style={styles.signinSignup}>
            <form 
              style={{ 
                ...styles.authForm, 
                ...styles.signInForm, 
                ...(isSignUp && styles.signUpModeSignInForm) 
              }} 
              onSubmit={handleLogin}
            >
              <h2 style={styles.title}>Sign In</h2>
              <div style={styles.inputField}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  value={loginData.username}
                  onChange={handleLoginChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputField}>
                <input
                  type="password"
                  name="pwrd"
                  placeholder="Password"
                  required
                  value={loginData.pwrd}
                  onChange={handleLoginChange}
                  style={styles.input}
                />
              </div>
              <button 
                type="submit" 
                style={{ 
                  ...styles.btn, 
                  ...(isLoading && styles.btnDisabled) 
                }}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Login"}
              </button>
              {!isSignUp && message && (
                <p style={{ 
                  ...styles.message, 
                  ...(message.includes("success") && styles.successMessage) 
                }}>
                  {message}
                </p>
              )}
              <p 
                style={styles.switchText}
                onClick={toggleForm}
                onMouseEnter={(e) => e.target.style.color = styles.switchTextHover.color}
                onMouseLeave={(e) => e.target.style.color = styles.switchText.color}
              >
                Don&apos;t have an account? Sign Up
              </p>
            </form>

            <form 
              style={{ 
                ...styles.authForm, 
                ...styles.signUpForm, 
                ...(isSignUp && styles.signUpModeSignUpForm) 
              }} 
              onSubmit={handleSignUp}
            >
              <h2 style={styles.title}>Sign Up</h2>
              <div style={styles.inputField}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputField}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputField}>
                <input
                  type="password"
                  name="pwrd"
                  placeholder="Password"
                  required
                  value={formData.pwrd}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputField}>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  style={styles.select}
                >
                  <option value="" disabled>Select Role</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
              <button 
                type="submit" 
                style={{ 
                  ...styles.btn, 
                  ...(isLoading && styles.btnDisabled) 
                }}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Sign Up"}
              </button>
              {isSignUp && message && (
                <p style={{ 
                  ...styles.message, 
                  ...(message.includes("success") && styles.successMessage) 
                }}>
                  {message}
                </p>
              )}
              <p 
                style={styles.switchText}
                onClick={toggleForm}
                onMouseEnter={(e) => e.target.style.color = styles.switchTextHover.color}
                onMouseLeave={(e) => e.target.style.color = styles.switchText.color}
              >
                Already have an account? Sign In
              </p>
            </form>
          </div>
        </div>

        <div style={{ ...styles.overlayContainer, ...(isSignUp && styles.signUpModeOverlayContainer) }}>
          <div style={styles.overlayContent}>
            <h2 style={styles.overlayTitle}>
              {isSignUp ? "Welcome Back!" : "Hello, Friend!"}
            </h2>
            <p style={styles.overlayText}>
              {isSignUp 
                ? "To keep connected with us please login with your personal info" 
                : "Enter your personal details and start your journey with us"}
            </p>
            <button
              style={styles.overlayBtn}
              onClick={toggleForm}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.overlayBtnHover.backgroundColor;
                e.target.style.color = styles.overlayBtnHover.color;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.overlayBtn.backgroundColor;
                e.target.style.color = styles.overlayBtn.color;
              }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
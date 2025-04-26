import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import styled from 'styled-components';

// Import your page components
import HomeFirstPage from "./Home/HomeFirstPage";
import FarmerCards from "./Routes/FarmerCards";
import CombineFoods from "./Routes/CombineFoods";
import FarmerProfile from "./UserProfiles/FarmerProfile";
import BuyCardAndPayment from "./PaymentPage/BuyCardAndPayment";
import BuyCardAndPayment2 from "./PaymentPage/BuyCardAndPayment2";
import BuyCardAndPayment3 from "./PaymentPage/BuyCardAndPayment3";
import BuyCardAndPayment4 from "./PaymentPage/BuyCardAndPayment4";
import BuyCardAndPayment5 from "./PaymentPage/BuyCardAndPayment5";
import BuyCardAndPayment6 from "./PaymentPage/BuyCardAndPayment6";
import BuyCardAndPayment7 from "./PaymentPage/BuyCardAndPayment7";
import BuyCardAndPayment8 from "./PaymentPage/BuyCardAndPayment8";
import BuyCardAndPayment9 from "./PaymentPage/BuyCardAndPayment9";
import LoginPage from "./LoginPage/LoginPage";
import ProductFeedback from "./ProductReviewRating/ProductFeedback";
import Location from "./LocationPage/Location";
import FarmerFeedback from "./FarmerReviewRating/FarmerFeedback";
import Message from "./MessagePage/Message";
import Message2 from "./MessagePage/Message2";
import Message3 from "./MessagePage/Message3";
import Message4 from "./MessagePage/Message4";
import Message5 from "./MessagePage/Message5";
import Message6 from "./MessagePage/Message6";

// Loader component
// eslint-disable-next-line react-refresh/only-export-components
const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader-container">
        <div className="loader" />
        <div className="loader-text">Loading...</div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .loader-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .loader {
    width: 70px;
    height: 70px;
    position: relative;
  }

  .loader:before {
    content: "";
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 6px solid #007bff;
    position: absolute;
    top: 0;
    left: 0;
    animation: pulse 1s ease-in-out infinite;
  }

  .loader:after {
    content: "";
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 6px solid transparent;
    border-top-color: #007bff;
    position: absolute;
    top: 0;
    left: 0;
    animation: spin 2s linear infinite;
  }

  .loader-text {
    font-size: 24px;
    margin-top: 20px;
    color: #007bff;
    font-family: Arial, sans-serif;
    text-align: center;
    text-transform: uppercase;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.6);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0;
    }
    100% {
      transform: scale(0.6);
      opacity: 1;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Layout component with loading state
const Layout = ({ children, showNavBar = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Show loader when route changes
    setIsLoading(true);
    
    // Simulate loading time (you can adjust this or replace with actual data loading)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Reduced from 1000ms to 800ms for better UX

    return () => clearTimeout(timer);
  }, [location.pathname]); // Changed from location.key to pathname for more reliable detection

  return (
    <>
      {isLoading && <Loader />}
      {showNavBar && <NavBar />}
      <div style={{ display: isLoading ? 'none' : 'block' }}>
        {children}
      </div>
    </>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
const App = () => (
  <Router>
    <Routes>
      {/* Login page route without NavBar */}
      <Route 
        path="/" 
        element={
          <Layout showNavBar={false}>
            <LoginPage />
          </Layout>
        } 
      />
      
      {/* All other routes with NavBar */}
      <Route path="/home" element={<Layout><HomeFirstPage /></Layout>} />
      <Route path="/farmer" element={<Layout><FarmerCards /></Layout>} />
      <Route path="/product" element={<Layout><CombineFoods /></Layout>} />
      <Route path="/profile" element={<Layout><FarmerProfile /></Layout>} />
      <Route path="/bellpepper" element={<Layout><BuyCardAndPayment /></Layout>} />
      <Route path="/cucumber" element={<Layout><BuyCardAndPayment2 /></Layout>} />
      <Route path="/amandine-potato" element={<Layout><BuyCardAndPayment3 /></Layout>} />
      <Route path="/carrot" element={<Layout><BuyCardAndPayment4 /></Layout>} />
      <Route path="/pineapple" element={<Layout><BuyCardAndPayment5 /></Layout>} />
      <Route path="/butterhead-lettuce" element={<Layout><BuyCardAndPayment6 /></Layout>} />
      <Route path="/cauliflower" element={<Layout><BuyCardAndPayment7 /></Layout>} />
      <Route path="/beetroot" element={<Layout><BuyCardAndPayment8 /></Layout>} />
      <Route path="/savoy-cabbage" element={<Layout><BuyCardAndPayment9 /></Layout>} />
      <Route path="/feedback/:productId" element={<Layout showNavBar={false}><ProductFeedback /></Layout>} />
      <Route path="/location" element={<Layout showNavBar={false}><Location /></Layout>} />
      <Route path="/farmerfeedback/:farmerId" element={<Layout showNavBar={false}><FarmerFeedback /></Layout>} />
      <Route path="/message" element={<Layout showNavBar={false}><Message /></Layout>} />
      <Route path="/message2" element={<Layout showNavBar={false}><Message2 /></Layout>} />
      <Route path="/message3" element={<Layout showNavBar={false}><Message3 /></Layout>} />
      <Route path="/message4" element={<Layout showNavBar={false}><Message4 /></Layout>} />
      <Route path="/message5" element={<Layout showNavBar={false}><Message5 /></Layout>} />
      <Route path="/message6" element={<Layout showNavBar={false}><Message6 /></Layout>} />
    </Routes>
  </Router>
);

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
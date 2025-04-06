import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar/NavBar";

import HomeFirstPage from "./Home/HomeFirstPage";
import CombineFarmers from "./Routes/CombineFarmers";
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

// Layout component that conditionally renders NavBar
const Layout = ({ children, showNavBar = true }) => (
  <>
    {showNavBar && <NavBar />}
    {children}
  </>
);

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
      <Route path="/farmer" element={<Layout><CombineFarmers /></Layout>} />
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
    </Routes>
  </Router>
);

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar/NavBar";  // Navigation Bar
import HomeFirstPage from "./Home/HomeFirstPage";
import CombineFarmers from "./Routes/CombineFarmers";
import CombineFoods from "./Routes/CombineFoods";
import FarmerProfile from "./UserProfiles/FarmerProfile";
import Profile01 from "./FarmerProfils/Profile01";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <NavBar />  {/* Fix: Place Navbar inside Router */}
      <Routes>
        <Route path="/" element={<HomeFirstPage />} />
        <Route path="/farmer" element={<CombineFarmers />} />  {/* Fix: Ensure route exists */}
        <Route path="/product" element={<CombineFoods />} />
        <Route path="/profile" element={<FarmerProfile />} />
        <Route path="/Profile01" element={<Profile01 />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
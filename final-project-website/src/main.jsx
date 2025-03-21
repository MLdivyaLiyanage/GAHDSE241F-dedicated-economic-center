import React from "react";
import { createRoot } from "react-dom/client";
import FarmerProfile from "./UserProfiles/FarmerProfile.jsx";



createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FarmerProfile/>
  </React.StrictMode>
);

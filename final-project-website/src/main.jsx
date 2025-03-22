import React from "react";
import { createRoot } from "react-dom/client";
import FarmerCard from "./FarmerCard/FarmerCard.jsx";


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FarmerCard/>
  </React.StrictMode>
);
import React from "react";
import { createRoot } from "react-dom/client";
import FarmerPage from "./FarmerPage/FarmerPage.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FarmerPage/>
  </React.StrictMode>
);
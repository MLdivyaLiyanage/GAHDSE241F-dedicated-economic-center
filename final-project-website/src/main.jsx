import React from "react";
import { createRoot } from "react-dom/client";
import FarmerForm from "./Routes/FarmerForm.jsx";


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FarmerForm/>
  </React.StrictMode>
);

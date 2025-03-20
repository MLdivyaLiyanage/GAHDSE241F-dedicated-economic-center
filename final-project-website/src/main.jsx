import React from "react";
import { createRoot } from "react-dom/client";
import CombineFarmerProfile from "./Routes/CombineFarmerProfile";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CombineFarmerProfile />
  </React.StrictMode>
);

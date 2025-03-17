import React from "react";
import { createRoot } from "react-dom/client";
import CategaryPageFarmer from "./CategaryPageFarmer/CategaryPageFarmer.jsx";
import LoginPage from "./LoginPage/LoginPage.jsx"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  {<LoginPage/>}
  </React.StrictMode>
);
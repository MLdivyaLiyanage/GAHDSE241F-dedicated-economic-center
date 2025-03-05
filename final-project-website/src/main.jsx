import React from "react";
import { createRoot } from "react-dom/client";
import HomeFirstPage from "./Home/HomeFirstPage"; 
import LoginPage from "./LoginPage/LoginPage";
import CategaryPage from "./CategaryPage/CategaryPage";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CategaryPage/>
  </React.StrictMode>
);

import React from "react";
import { createRoot } from "react-dom/client";
import NavBar from "./NavBar/NavBar.jsx";



createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NavBar/>
  </React.StrictMode>
);

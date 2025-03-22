import React from "react";
import { createRoot } from "react-dom/client";
import CombineHomeNavbar from "./Routes/CombineHomeNavbar";


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CombineHomeNavbar/>
  </React.StrictMode>
);
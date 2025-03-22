import React from "react";
import { createRoot } from "react-dom/client";
import ProductPage from "./ProductPage/ProductPage.jsx";



createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProductPage/>
  </React.StrictMode>
);
import React from "react";
import { createRoot } from "react-dom/client";
import CombineFoods from "./Routes/CombineFoods";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CombineFoods />
  </React.StrictMode>
);

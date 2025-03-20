import React from "react";
import { createRoot } from "react-dom/client";
import CombineFarmers from "./Routes/CombineFarmers";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CombineFarmers />
  </React.StrictMode>
);

import React from "react";
import { createRoot } from "react-dom/client";
import ProfilePage from "./ProfilePage/ProfilePage";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  {<ProfilePage/>}
  </React.StrictMode>
);
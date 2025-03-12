import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CategoryPage from "./CategaryPage"; // Your existing page
import CategoryPage from "./Products"; // The new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App;

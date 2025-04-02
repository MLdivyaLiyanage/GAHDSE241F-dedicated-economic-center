import React from "react";
import { createRoot } from "react-dom/client"; // Ensure this import is present
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar/NavBar";  
import HomeFirstPage from "./Home/HomeFirstPage";
import CombineFarmers from "./Routes/CombineFarmers";  
import CombineFoods from "./Routes/CombineFoods";
import FarmerProfile from "./UserProfiles/FarmerProfile"
import BuyCardAndPayment from "./PaymentPage/BuyCardAndPayment"
import BuyCardAndPayment2 from "./PaymentPage/BuyCardAndPayment2"
import BuyCardAndPayment3 from "./PaymentPage/BuyCardAndPayment3"
import BuyCardAndPayment4 from "./PaymentPage/BuyCardAndPayment4"
import BuyCardAndPayment5 from "./PaymentPage/BuyCardAndPayment5"
import BuyCardAndPayment6 from "./PaymentPage/BuyCardAndPayment6"
import BuyCardAndPayment7 from "./PaymentPage/BuyCardAndPayment7"
import BuyCardAndPayment8 from "./PaymentPage/BuyCardAndPayment8"
import BuyCardAndPayment9 from "./PaymentPage/BuyCardAndPayment9"

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeFirstPage />} />
        <Route path="/farmer" element={<CombineFarmers />} />
        <Route path="/product" element={<CombineFoods />} />
        <Route path="/profile" element={<FarmerProfile />}/>
        <Route path="/bellpepper" element={<BuyCardAndPayment/>}/>
        <Route path="/cucumber" element={<BuyCardAndPayment2/>}/>
        <Route path="/amandine-potato" element={<BuyCardAndPayment3/>}/>
        <Route path="/carrot" element={<BuyCardAndPayment4/>}/>
        <Route path="/pineapple" element={<BuyCardAndPayment5/>}/>
        <Route path="/butterhead-lettuce" element={<BuyCardAndPayment6/>}/>
        <Route path="/cauliflower" element={<BuyCardAndPayment7/>}/>
        <Route path="/beetroot" element={<BuyCardAndPayment8/>}/>
        <Route path="/savoy-cabbage" element={<BuyCardAndPayment9/>}/>
        
      </Routes>
    </Router>
  </React.StrictMode>
);

import React from "react";
import CategaryPageFarmer from "../CategaryPageFarmer/CategaryPageFarmer";  // Import FoodProfile component
import FarmerPage from "../FarmerPage/FarmerPage";  // Import CategoryPageFood component

const CombineFarmers = () => {
  return (
    <div>
      <CategaryPageFarmer />

      <FarmerPage />
    </div>
  );
};

export default CombineFarmers;

import React from "react";
import FarmerSlider from "../FarmerSlider/FarmerSlider";  // Import FoodProfile component
import FarmerCard from "../FarmerCard/FarmerCard";  // Import CategoryPageFood component

const CombineFarmers = () => {
  return (
    <div>
      <FarmerSlider />

      <FarmerCard />
    </div>
  );
};

export default CombineFarmers;

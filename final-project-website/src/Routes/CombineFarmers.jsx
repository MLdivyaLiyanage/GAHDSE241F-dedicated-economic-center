import  "react";

import NavBar from "../NavBar/NavBar";  // Import NavBar component
import FarmerSlider from "../FarmerSlider/FarmerSlider";  // Import FoodProfile component
import FarmerCard from "../FarmerCard/FarmerCard";  // Import CategoryPageFood component

const CombineFarmers = () => {
  return (
    <div>
      
      <NavBar/>
      <FarmerSlider />

      <FarmerCard />
    </div>
  );
};

export default CombineFarmers;

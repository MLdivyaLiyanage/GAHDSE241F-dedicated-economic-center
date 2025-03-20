import React from "react";
import ProfilePage from "../ProfilePage/ProfilePage";  // Import FoodProfile component
import Foodcard01 from "../FarmerFoodCard/Foodcard01";  // Import CategoryPageFood component

const CombineFarmers = () => {
  return (
    <div>
      <ProfilePage />

      <Foodcard01 />
    </div>
  );
};

export default CombineFarmers;

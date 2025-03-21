import  "react";
import NavBar from "../NavBar/NavBar";
import FarmerProfile from "../UserProfiles/FarmerProfile";


const CombineFoods = () => {
  return (
    <div>
      {/* Render FoodProfile first */}
      <NavBar />

      {/* Render CategoryPageFood after FoodProfile */}
      <FarmerProfile />
    </div>
  );
};

export default CombineFoods;

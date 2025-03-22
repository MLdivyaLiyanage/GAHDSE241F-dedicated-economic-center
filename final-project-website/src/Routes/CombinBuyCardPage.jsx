import  "react";
import NavBar from "../NavBar/NavBar.jsx";  // Import FoodProfile component
import BuyCard01 from "../ProductBuyCard/BuyCard01.jsx";  // Import CategoryPageFood component

const CombineFoods = () => {
  return (
    <div>
      {/* Render FoodProfile first */}
      <NavBar />

      {/* Render CategoryPageFood after FoodProfile */}
      <BuyCard01/>
    </div>
  );
};

export default CombineFoods;

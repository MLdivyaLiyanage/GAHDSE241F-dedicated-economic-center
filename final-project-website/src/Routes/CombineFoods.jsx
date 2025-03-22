import  "react";
import FoodCard from "../FoodCard/FoodCard";  // Import FoodProfile component
import FoodSlider from "../FoodSlider/FoodSlider";  // Import CategoryPageFood component

const CombineFoods = () => {
  return (
    <div>
      {/* Render FoodProfile first */}
      <FoodSlider />

      {/* Render CategoryPageFood after FoodProfile */}
      <FoodCard />
    </div>
  );
};

export default CombineFoods;

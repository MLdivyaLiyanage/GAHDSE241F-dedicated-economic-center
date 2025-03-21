import  "react";
import CardBox from "../CardBox/CardBox";  // Import FoodProfile component
import CategaryPageFood from "../CategaryPageFood/CategaryPageFood";  // Import CategoryPageFood component

const CombineFoods = () => {
  return (
    <div>
      {/* Render FoodProfile first */}
      <CategaryPageFood />

      {/* Render CategoryPageFood after FoodProfile */}
      <CardBox />
    </div>
  );
};

export default CombineFoods;

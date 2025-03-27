import  "react";
import NavBar from "../NavBar/NavBar.jsx";
import CombinPaymentAndBuyCard from "../CombinPaymentAndBuyCard/CombinPaymentAndBuyCard.jsx";


const CombineFoods = () => {
  return (
    <div>
      {/* Render FoodProfile first */}
      <NavBar />

      {/* Render CategoryPageFood after FoodProfile */}
      <CombinPaymentAndBuyCard/>
    </div>
  );
};

export default CombineFoods;

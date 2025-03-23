import  "react";
import NavBar from "../NavBar/NavBar";
import HomeFirstPage from "../Home/HomeFirstPage";


const CombineFoods = () => {
  return (
    <div>
      {/* Render FoodProfile first */}
      <NavBar />

      {/* Render CategoryPageFood after FoodProfile */}
      <HomeFirstPage />
    </div>
  );
};

export default CombineFoods;

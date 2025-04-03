import  "react";
import NavBar from "../NavBar/NavBar";
import Profile01 from "../FarmerProfiles/Profile01";  // Import FoodProfile component
import Foodcard01 from "../FarmerFoodCard/Foodcard01";  // Import CategoryPageFood component
import FeedBack from "../RivevAndFeedBack/FeedBack.jsx";

const CombineFarmers = () => {
  return (
    <div>
       <NavBar/>
      <Profile01 />
      <Foodcard01 />
      <FeedBack />

    </div>
  );
};

export default CombineFarmers;

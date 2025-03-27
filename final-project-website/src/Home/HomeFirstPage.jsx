import  "react";
import "bootstrap/dist/css/bootstrap.min.css";

const NavigationWithVideo = () => {
  return (
    <div className="video-container">
      {/* Background Video */}
      <video className="w-100 background-video" autoPlay  muted>
        <source src="src/assets/backgroundVedeo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      
    </div>
  );
};

export default NavigationWithVideo;

import React from "react";
import "./styles/Section1main.scss";
import section1_images from "../../../../assets/landing_images/section1_mobile.webp";
import section_background from "../../../../assets/landing_images/right_land_image.webp";
import landing_off from "../../../../assets/landing_images/landing_off_circle.webp";
import { useHistory } from "react-router-dom";
import ReactPlayer from "react-player";
import round_imag from "../../../../assets/landing_images/passion_image1.jpg";
import videos from "../../../../assets/video/-3031389958503494483dont_blink.mp4";
import { LandingText } from "../../const/Const_Landing";
function Section1main() {
  const usehistory = useHistory();
  return (
    <>
      <div className="landing-section1" id="home">
        <div className="main-section_image">
          <img src={section_background} className="img1"     alt="" />
        </div>
        <div className="main-section1">
          <div className="left_box_content">
            <div className="box_middle">
              <h1 className="preparation mb-2 mt-3 ">
                {LandingText.Preparationto}
              </h1>
              <p className="indias mt-3 mb-4">{LandingText.Indiasbest}</p>
              <div className="buttons">
                <button
                  className="landing_button"
                  // onClick={() => usehistory.push("/register")}
                >
                  {LandingText.SignUpNow}
                </button>
              </div>
            </div>
          </div>
          <div className="right_box_image">
            <img src={section1_images}     alt="" />
          </div>
        </div>
      </div>
      <div className="next_lan_section1">
        <div className="inside_land_section1">
          <div className="left_section_land">
            <div className="left_contents" id="whypassion">
              <h2 className="why mt-5">{LandingText.WhyPassion}</h2>
              <p className="with_a_complete mt-4">{LandingText.Withacomplet}</p>
              <p className="with_a_complete mb-5">
                {LandingText.Wehelpstudents}
              </p>
              <button
                className="landing_button"
                // onClick={() => usehistory.push("/login")}
              >
                {LandingText.LearnMore}
              </button>
            </div>
          </div>
          <div className="right_section_land">
            <div className="land_image_video">
              <div className="inside_land_box mt-5">
                <div className="image_box ">
                  <div className="person_round_image">
                    <img src={round_imag}     alt="" />
                    <div className="person_name">
                      <span className="ram">{LandingText.RamVignesh}</span>
                      <span className="rams">{LandingText.Founder}</span>
                    </div>
                  </div>
                </div>
                <div className="inside_video">
                  <ReactPlayer
                    className="videos_player"
                    controls
                    url={videos}
                  />
                </div>
              </div>
            </div>
            <img src={landing_off} className="right_off"     alt=""/>
          </div>
        </div>
      </div>
    </>
  );
}
export default Section1main;

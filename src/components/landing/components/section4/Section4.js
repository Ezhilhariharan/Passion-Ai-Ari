import React from "react";
import "./styles/Section4.scss";
import landing_bank from "../../../../assets/landing_images/landing_bank_image.webp";
import landing_batch from "../../../../assets/landing_images/landing_batch_image.webp";
import landing_tree_book from "../../../../assets/landing_images/landing_tree_book.webp";
import landing_hand from "../../../../assets/landing_images/landing_hand_image.webp";
import landing_system from "../../../../assets/landing_images/landing_system_image.png";
import ReactPlayer from "react-player";
import { LandingText } from "../../const/Const_Landing";
import videos from "../../../../assets/video/-3031389958503494483dont_blink.mp4";
function Section4() {
  return (
    <div className="section5">
      <div className="left_section5">
        <h1 className="landing_gain_what mt-3">
          {LandingText.Whatdo}
          <span className="institute">{LandingText.Institute}</span>{" "}
          {LandingText.gain}
          <br />
          {LandingText.frompassionAi}
        </h1>
        <div className="split_section5">
          <div className="row g-3">
            <div className="col-sm-6 ">
              <div className="cards">
                <div className="row">
                  <div className="inside_cards">
                    <div className="left_card">
                      <img src={landing_bank} className="boost_image" alt="" />
                    </div>
                    <div className="right_card">
                      <h1 className="boost">{LandingText.BOOSTININSTITUTES}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 ">
              <div className="cards">
                <div className="row">
                  <div className="inside_cards">
                    <div className="left_card">
                      <img src={landing_batch} className="img-leftcard" alt=""/>
                    </div>
                    <div className="right_card">
                      <h1 className="boost">
                        {LandingText.RISEIN}
                        <br /> {LandingText.ADMISSIONSE}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="cards">
                <div className="row">
                  <div className="inside_cards">
                    <div className="left_card">
                      <img src={landing_tree_book} className="img-leftcard" alt=""/>
                    </div>
                    <div className="right_card">
                      <h1 className="boost">{LandingText.GROWTHINKNOWLEDGE}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="cards">
                <div className="row">
                  <div className="inside_cards">
                    <div className="left_card">
                      <img src={landing_hand} className="img-leftcard" alt=""/>
                    </div>
                    <div className="right_card">
                      <h1 className="boost">
                        {LandingText.GUARANTEEDPLACEMENTS}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="right_section5">
        <div className="box1">
          <div className="videos">
            <ReactPlayer
              url={videos}
              controls={true}
              className="videos_passions"
            />
          </div>
          <div className="image1">
            <img src={landing_system} className="landing_systems" alt=""/>
          </div>
        </div>
        {/* <div className="right_video_image">
          <ReactPlayer
            url={videos}
            controls
            className="videos_passions"
          />
        </div>
        <img src={landing_system} className="landing_systems" /> */}
      </div>
    </div>
  );
}
export default Section4;

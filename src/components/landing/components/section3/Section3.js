import React from "react";
import "./styles/Section3.scss";
import Slider from "react-slick";
import screen_mobile from "../../../../assets/landing_images/landing_screen_person.webp";
import mobile_owner from "../../../../assets/landing_images/mobile_passion_image.svg";
import calender from "../../../../assets/landing_images/calendor.svg";
import light from "../../../../assets/landing_images/light.svg";
import line_scroll from "../../../../assets/landing_images/person_arrow.svg";
import persontick from "../../../../assets/landing_images/person_tick.svg";
import ReactPlayer from "react-player";
import { LandingText } from "../../const/Const_Landing";
import videos from "../../../../assets/video/-3031389958503494483dont_blink.mp4";
function Section3(props) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="section4 d-none d-xxl-block">
        <div className="inside_section4">
          <div className="left_section4">
            <div className="image_mobile">
              <div className="passion-ai-ari-image">
                <img src={mobile_owner} className="mobile_image w-50" alt="" />
              </div>
              <div className="react-player">
                <ReactPlayer
                  className="videos"
                  controls
                  url={videos}
                />
              </div>
            </div>
          </div>
          <div className="right_section4">
            <div className="right_landing_contents">
              <span className="what_dos">
                {" "}
                {LandingText.Whatdo}
                <span className="colors px-4">{LandingText.Mentor}</span>
              </span>
              <span className="gain">{LandingText.gainfromPassionAi}</span>
            </div>
            <div className="split_sharing mt-2">
              <div className="left_split_sharing">
                <div className="box1">
                  <div className="light">
                    <img src={light} alt=""/>
                  </div>
                  <p className="konowledge mt-3">
                    {LandingText.KNOWLEDGESHARING}
                  </p>
                  <p className="choose">
                    {LandingText.Choosefromaplethoraofcareer}
                    <br />
                    {LandingText.opportunitiestotake}
                  </p>
                </div>
              </div>
              <div className="right_split_sharing ">
                <div className="box1">
                  <div className="light">
                    <img src={line_scroll} alt=""/>
                  </div>
                  <p className="konowledge mt-3">
                    {LandingText.FINANCIALBENEFITS}
                  </p>
                  <p className="choose">
                    {LandingText.Aneasywaytogenerate}
                    <br /> {LandingText.passiveincomeonthego}
                  </p>
                </div>
              </div>
            </div>
            <div className="split_sharing mt-5 ">
              <div className="left_split_sharing">
                <div className="box1">
                  <div className="light">
                    <img src={calender} alt=""/>
                  </div>
                  <p className="konowledge mt-3">
                    {LandingText.FLEXIWORKSCHEDULE}
                  </p>
                  <p className="choose">
                    {LandingText.Scheduleyourappointments}
                    <br /> {LandingText.asperyourconvenience}
                  </p>
                </div>
              </div>
              <div className="right_split_sharing ">
                <div className="box1">
                  <div className="light">
                    <img src={persontick} alt=""/>
                  </div>
                  <p className="konowledge mt-3">{LandingText.CareerGrowth}</p>
                  <p className="choose">
                    {LandingText.Educateandget} <br />
                    {LandingText.thesametimebylearning}
                    <br /> {LandingText.preachingtogether}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* another responsie websites */}
      <div className="another_slide  d-noe d-block d-xxl-none">
        <div className="main">
          <div className="left_landing_content">
            <p className="what_do">
              {LandingText.Whatdo}{" "}
              <span className="colors">{LandingText.Mentor}</span>{" "}
              {LandingText.gainfromPassionAi}
            </p>
          </div>
          <div className="right_landing_content">
            <img src={screen_mobile} alt="" />
          </div>
        </div>
        <div className="another_resposive">
          <Slider {...settings}>
            <div>
              <div className="left_split_sharing">
                <div className="box1">
                  <div className="light mt-2">
                    <img src={light} alt=""/>
                  </div>
                  <p className="konowledge mt-3">
                    {LandingText.KNOWLEDGESHARING}
                  </p>
                  <p className="choose">
                    {LandingText.Choosefromaplethoraofcareer}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="right_split_sharing ">
                <div className="box1">
                  <div className="light">
                    <img src={line_scroll} alt=""/>
                  </div>
                  <p className="konowledge mt-3">
                    {LandingText.FINANCIALBENEFITS}
                  </p>
                  <p className="choose">{LandingText.Aneasywaytogenerate}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="left_split_sharing">
                <div className="box1">
                  <div className="light">
                    <img src={calender} alt="" />
                  </div>
                  <p className="konowledge mt-3">
                    {LandingText.FLEXIWORKSCHEDULE}
                  </p>
                  <p className="choose">
                    {LandingText.Scheduleyourappointments}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="right_split_sharing ">
                <div className="box1">
                  <div className="light">
                    <img src={persontick} alt="" />
                  </div>
                  <p className="konowledge mt-3">{LandingText.CareerGrowth}</p>
                  <p className="choose">{LandingText.Educateandget}</p>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </>
  );
}
export default Section3;

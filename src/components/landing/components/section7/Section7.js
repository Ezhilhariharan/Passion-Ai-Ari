import React from "react";
import Slider from "react-slick";
import "./styles/Section7.scss";
import left_shadow from "../../../../assets/landing_images/left_image_shadow.webp";
import right_shadow from "../../../../assets/landing_images/right_image_shadow.webp";
import abinesh_image from "../../../../assets/landing_images/abinesh.webp";
import SlideNextArrow from "./slidenextarrow/SlideNextArrow";
import SlidePreArrow from "./slideprearrow/SlidePreArrow";
import { LandingText } from "../../const/Const_Landing";
function Section7() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <SlideNextArrow />,
    preletrow: <SlidePreArrow />,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          dots: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
          dots: false,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };
  return (
    <div className="section8">
      <h1 className="here">{LandingText.Hereiswhat}</h1>
      <img src={left_shadow} className="img1" />
      <div className="review-holder">
        <Slider {...settings}>
          <div>
            <div className="insitute_main">
              <div className="card ">
                <button className="buttons">{LandingText.Mentor}</button>
                <div className="image_box mt-5 mb-3">
                  <img src={abinesh_image} alt="" />
                </div>
                <h1 className="text-center abinesh">{LandingText.Abinesh}</h1>
                <p className="text-center ceo">{LandingText.CEOCampusAvenue}</p>
                <p className="lorteams">{LandingText.Loremipsumdolor}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="insitute_main">
              <div className="card ">
                <button className="buttons">{LandingText.Institute}</button>
                <div className="image_box mt-5 mb-3">
                  <img src={abinesh_image} alt="" />
                </div>
                <h1 className="text-center abinesh">{LandingText.Abinesh}</h1>
                <p className="text-center ceo">{LandingText.CEOCampusAvenue}</p>
                <p className="lorteams">{LandingText.Loremipsumdolor}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="insitute_main">
              <div className="card ">
                <button className="buttons">{LandingText.Mentor}</button>
                <div className="image_box mt-5 mb-3">
                  <img src={abinesh_image} alt="" />
                </div>
                <h1 className="text-center abinesh">{LandingText.Abinesh}</h1>
                <p className="text-center ceo">{LandingText.CEOCampusAvenue}</p>
                <p className="lorteams">{LandingText.Loremipsumdolor}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="insitute_main">
              <div className="card ">
                <button className="buttons">{LandingText.Institute}</button>
                <div className="image_box mt-5 mb-3">
                  <img src={abinesh_image} alt="" />
                </div>
                <h1 className="text-center abinesh">{LandingText.Abinesh}</h1>
                <p className="text-center ceo">{LandingText.CEOCampusAvenue}</p>
                <p className="lorteams">{LandingText.Loremipsumdolor}</p>
              </div>
            </div>
          </div>
        </Slider>
      </div>
      <img src={right_shadow} className="img2" />
    </div>
  );
}
export default Section7;

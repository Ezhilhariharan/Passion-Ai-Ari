import React from "react";
import "./styles/Section2.scss";
import left_off from "../../../../assets/landing_images/landing_left_off.webp";
import landing_person_smile from "../../../../assets/landing_images/landing_person_smile.webp";
import light from "../../../../assets/landing_images/light.svg";
import careermentorship from "../../../../assets/landing_images/career-mentorship.svg";
import multicareer from "../../../../assets/landing_images/multi-career.svg";
import group from "../../../../assets/landing_images/student_path.png";
import assistent from "../../../../assets/landing_images/assistent.svg";
import Slider from "react-slick";
import { LandingText } from "../../const/Const_Landing";
function Section2(props) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2300,
    pauseOnHover: true,
  };
  return (
    <div className="section3">
      <div className="inside_section3">
        <img src={left_off} className="img2"     alt=""/>
        <h1 className="student_map">{LandingText.StudentRoadMap}</h1>
        <img src={group} className="student_image"     alt=""></img>
        <div className="over_content d-none d-xl-block">
          <div className="main-person-images">
            <div className="inside_land_content">
              <h1 className="whats">
                {LandingText.Whatdo}{" "}
                <span className="colors">{LandingText.student}</span>{" "}
                {LandingText.gain}
                <br /> {LandingText.frompassionAi}
              </h1>
            </div>
            <div className="landing_smilys">
              <div className="person-backs">
                <div className="image">
                  <img src={landing_person_smile}     alt="" />
                  <div className="empty-colors">
                    <h1 className="we">{LandingText.welcome}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="splits d-none d-xxl-block">
            <div className="row">
              <div className="col-md-3 col-lg-2">
                <div className="card">
                  <div className="light mx-auto">
                    <img src={multicareer} alt="" />
                  </div>
                  <h3 className="landing-h3 mt-3">
                    {LandingText.MULTICAREERSUPPORT}
                  </h3>
                  <p className="choose_plat">
                    {LandingText.Choosefromaplethora}
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-lg-2">
                <div className="card">
                  <div className="light mx-auto mb-3">
                    <img src={assistent} alt="" />
                  </div>
                  <h3 className="landing-h3 mt-3">
                    {LandingText.CAREERASSISTANCE}
                  </h3>
                  <p className="choose_plat">
                    {LandingText.Apersonalisedapproach}
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-lg-2">
                <div className="card">
                  <div className="light mx-auto mb-3">
                    <img src={light} alt="" />
                  </div>
                  <h3 className="landing-h3 mt-3">
                    {LandingText.HOLISTICKNOWLEDGE}
                  </h3>
                  <p className="choose_plat">{LandingText.Acollectionofvast}</p>
                </div>
              </div>
              <div className="col-md-3 col-lg-2">
                <div className="card">
                  <div className="light mx-auto mb-3">
                    <img src={careermentorship} alt="" />
                  </div>
                  <h3 className="landing-h3 mt-3">
                    {LandingText.OneMENTORSHIP}
                  </h3>
                  <p className="choose_plat">
                    {LandingText.Adedicatedindustryexpert}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="split d-block d-xxl-none">
            <div className="row">
              <div className="col-md-3 col-lg-2">
                <div className="card">
                  <div className="light mx-auto">
                    <img src={multicareer} alt="" />
                  </div>
                  <h3 className="landing-h3">
                    {LandingText.MULTICAREERSUPPORT}
                  </h3>
                  <p className="choose_plat">
                    {LandingText.Choosefromaplethora}
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-lg-2">
                <div className="card">
                  <div className="light mx-auto mb-3">
                    <img src={assistent} alt="" />
                  </div>
                  <h3 className="landing-h3">{LandingText.CAREERASSISTANCE}</h3>
                  <p className="choose_plat">
                    {LandingText.Apersonalisedapproach}
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-lg-2">
                <div className="card">
                  <div className="light mx-auto mb-3">
                    <img src={light} alt=""/>
                  </div>
                  <h3 className="landing-h3">
                    {LandingText.HOLISTICKNOWLEDGE}
                  </h3>
                  <p className="choose_plat">{LandingText.Acollectionofvast}</p>
                </div>
              </div>
              <div className="col-md-3 col-lg-2">
                <div className="card">
                  <div className="light mx-auto mb-3">
                    <img src={careermentorship} alt="" />
                  </div>
                  <h3 className="landing-h3">{LandingText.OneMENTORSHIP}</h3>
                  <p className="choose_plat">
                    {LandingText.Adedicatedindustryexpert}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="block-sliders d-block d-xl-none">
          <div>
            <div className="slide_split_class">
              <div className="left_inside_land_content">
                <h1 className="whats">
                  {LandingText.Whatdo}{" "}
                  <span className="colors">{LandingText.student}</span>{" "}
                  {LandingText.gain}
                  <br /> {LandingText.frompassionAi}
                </h1>
              </div>
              <div className="rigfht_smile_image">
                <img src={landing_person_smile} className="landing_smiles" alt=""/>
                <div className="empty-color-apply">hhhss</div>
              </div>
            </div>
            <div className="move_slick">
              <Slider {...settings}>
                <div>
                  <div className="cards">
                    <div className="light">
                      <img src={multicareer} alt=""/>
                    </div>
                    <h3 className="landing-h3 mb-2 mt-3 text-center">
                      {LandingText.MULTICAREERSUPPORT}
                    </h3>
                    <p className="choose_plat text-center">
                      {LandingText.Choosefromaplethora}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="cards">
                    <div className="light">
                      <img src={assistent} alt=""/>
                    </div>
                    <h3 className="landing-h3 mb-2 mt-3 text-center">
                      {LandingText.CAREERASSISTANCE}
                    </h3>
                    <p className="choose_plat text-center">
                      {LandingText.Apersonalisedapproach}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="cards">
                    <div className="light">
                      <img src={light} alt=""/>
                    </div>
                    <h3 className="landing-h3 mb-2 mt-3 text-center">
                      {LandingText.HOLISTICKNOWLEDGE}
                    </h3>
                    <p className="choose_plat text-center">
                      {LandingText.Acollectionofvast}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="cards">
                    <div className="light">
                      <img src={careermentorship} alt=""/>
                    </div>
                    <h3 className="landing-h3 mb-2 mt-3 text-center">
                      {LandingText.OneMENTORSHIP}
                    </h3>
                    <p className="choose_plat text-center">
                      {LandingText.Adedicatedindustryexpert}
                    </p>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Section2;

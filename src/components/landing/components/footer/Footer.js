import React from "react";
import { NavLink } from "react-router-dom";
import "./styles/Footer.scss";
import footer_logo from "../../../../assets/Landing_logo/landing_footer_logo.png";
import landing_facebook from "../../../../assets/Landing_logo/landing_facbook.webp";
import landing_linked_in from "../../../../assets/Landing_logo/landing_footer_linkedin.webp";
import landing_instagram from "../../../../assets/Landing_logo/landing_instagram.webp";
import { useHistory } from "react-router-dom";
import { LandingText } from "../../const/Const_Landing";
function Footer(props) {
  return (
    <>
      <div className="footer_section8">
        <div className="inside_footer_section">
          <div className="left_footer_section">
            <a href="#home">
              <img src={footer_logo} alt="" />
            </a>
          </div>
          <div className="right_footer_section">
            <div className="footer_right_inside">
              <div className="left_footer_inside">
                <p className="footer_content mb-3">{LandingText.COMPANY}</p>
                <div className="links_page">
                  <span>
                    <a class="nav-links " href="#home">
                      {LandingText.Home}
                    </a>
                  </span>
                  <span>
                    {" "}
                    <a href="#whypassion" class="nav-links">
                      {LandingText.WhyPassionAiAri}
                    </a>
                  </span>
                  <span>
                    {" "}
                    <a href="#blogs" class="nav-links ">
                      {LandingText.Blogs}
                    </a>
                  </span>
                  <span>
                    {" "}
                    <a href="#contacts" class="nav-links ">
                      {LandingText.ContactUs}
                    </a>
                  </span>{" "}
                </div>
              </div>
              <div className="right_footer_inside">
                <span className="footer_content">
                  {LandingText.CONNECTWITHUS}
                </span>
                <div className="logo_footer">
                  <p className="facebook">
                    {" "}
                    <a href="https://www.linkedin.com/passionai_ari/">
                      <img src={landing_facebook} alt="" />
                    </a>
                  </p>
                  <p className="facebook">
                    {" "}
                    <a href="https://www.linkedin.com/company/passion-ai-ari-llp/">
                      <img src={landing_linked_in} alt="" />
                    </a>
                  </p>
                  <p className="facebook">
                    {" "}
                    <a href="https://www.instagram.com/passionai_ari/">
                      <img src={landing_instagram} alt="" />
                    </a>
                  </p>
                </div>
                <div className="terms_conditions mt-1">
                  <span>
                    <NavLink to="/terms" className="linksed">
                      {LandingText.TermsandConditions}
                    </NavLink>
                  </span>
                  <span>
                    <NavLink to="/datapolicy" className="linksed">
                      {LandingText.DataPolicy}
                    </NavLink>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copys">
        <span className="right">{LandingText.Copyright2021Passion}</span>
      </div>
    </>
  );
}
export default Footer;

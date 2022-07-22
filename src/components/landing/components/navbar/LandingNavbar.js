import React from "react";
import "./styles/LandingNavbar.scss";
import Passion_logo from "../../../../assets/Landing_logo/passion_logo.png";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { LandingText } from "../../const/Const_Landing";
import { Link } from "react-scroll";
function LandingNavbar() {
    const [navbar, Shownavbar] = useState(true);
    return (
        <>
            <nav class="navbar navbar-expand-lg navbar-light d-flex  d-lg-none ">
                <div class="container-fluid">
                    {navbar ? (
                        <div className="d-flex flex-row col-12 mobile-image">
                            <a class="navbar-brand" href="#">
                                <img
                                    src={Passion_logo}
                                    className="image2"
                                    style={{ width: "40%" }}
                                />
                            </a>
                            <button
                                class="navbar-toggler ms-auto mt-2"
                                type="button"
                                onClick={() => Shownavbar(!navbar)}
                            >
                                <span className="fa fa-bars"></span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex flex-row col-12">
                                <a class="navbar-brand" href="#">
                                    <img
                                        src={Passion_logo}
                                        className="image2"
                                        style={{ width: "40%" }}
                                    />
                                </a>
                                <button
                                    class="navbar-toggler ms-auto mt-2"
                                    type="button"
                                    onClick={() => Shownavbar(!navbar)}
                                >
                                    <span className="fa fa-bars"></span>
                                </button>
                            </div>
                            <div class="">
                                <ul class="navbar-nav mx-auto">
                                    <li class="nav-item mb-2 mt-2">
                                        <Link
                                            to="home"
                                            spy={true}
                                            smooth={true}
                                        >
                                            {LandingText.Home}
                                        </Link>
                                    </li>
                                    <li class="nav-item mb-1">
                                        <Link
                                            to="whypassion"
                                            spy={true}
                                            smooth={true}
                                        >
                                            {LandingText.WhyPassionAiAri}
                                        </Link>
                                    </li>
                                    <li class="nav-item">
                                        <Link
                                            to="blogs"
                                            spy={true}
                                            smooth={true}
                                            class="nav-link"
                                        >
                                            {LandingText.Blogs}
                                        </Link>
                                    </li>
                                    <li class="nav-item">
                                        <Link
                                            to="contacts"
                                            spy={true}
                                            smooth={true}
                                            class="nav-link"
                                        >
                                            {LandingText.ContactUs}
                                        </Link>
                                    </li>
                                </ul>
                                <form class="d-flex">
                                    {/* <NavLink to="/login" className="nav-link ">
                                        {LandingText.LoginSignUp}
                                    </NavLink> */}
                                    <div className="nav-link ">
                                        {LandingText.LoginSignUp}
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </nav>
            <div className="inside_navbar d-lg-flex d-md-none d-none">
                <div className="box_navbar">
                    <img
                        src={Passion_logo}
                        // src="/image/passionlogo.png"
                        className="passion_logo"
                    />
                </div>
                <div className="middle_content ">
                    <p className="my-auto">
                        <Link
                            to="home"
                            spy={true}
                            smooth={true}
                            class="nav-link"
                        >
                            {LandingText.Home}
                        </Link>
                    </p>
                    <p className="my-auto">
                        <Link
                            to="whypassion"
                            spy={true}
                            smooth={true}
                            class="nav-link"
                        >
                            {LandingText.WhyPassionAiAri}
                        </Link>
                    </p>
                    <p className="my-auto">
                        <Link
                            to="blogs"
                            spy={true}
                            smooth={true}
                            class="nav-link "
                        >
                            {LandingText.Blogs}
                        </Link>
                    </p>
                    <p className="my-auto">
                        <Link
                            to="contacts"
                            spy={true}
                            smooth={true}
                            class="nav-link"
                        >
                            {LandingText.ContactUs}
                        </Link>
                    </p>
                </div>
                <div className="end_content ">
                    <p className="login my-auto">
                        {" "}
                        {/* <NavLink
                            to="/login"
                            class="nav-link"
                            style={{
                                color: "#ff7a00",
                            }}
                        >
                            {LandingText.LoginSignUp}
                        </NavLink> */}
                        <div className="nav-link ">
                            {LandingText.LoginSignUp}
                        </div>
                    </p>
                </div>
            </div>
        </>
    );
}
export default LandingNavbar;
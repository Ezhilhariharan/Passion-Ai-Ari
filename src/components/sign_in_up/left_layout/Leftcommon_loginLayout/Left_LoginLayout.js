import React from "react";
import "./styles/Left_LoginLayout.scss";
import { useHistory } from "react-router-dom";
import { loginText } from "../LeftLayoutConst";
function LoginLayout(props) {
  let history = useHistory();
  return (
    <div className="page-left">
      <div className="login-logo d-flex flex-row  ps-xxl-5 pt-5 ps-lg-0 ps-md-0">
        <img
          src="/image/dark-theme-Passionlogo.png"
          alt=""
          className="img-fluid  ms-3"
          onClick={() => history.push("/")}
        />
        {/* <div className="app-name my-auto ms-3"><span className="app-name-yellow">Passion</span> Ai Ari </div> */}
      </div>
      <div className="pageleft-middle  pt-3 ps-lg-0 ps-md-0  ps-xxl-5">
        <h1 className="mt-5 ms-5 ">{loginText.title}</h1>
        <h2 className="mt-3 ms-5 ">
          {loginText.paragraph}
          <span className="app-name-yellow">{loginText.passion}</span>
        </h2>
      </div>
      <div className="pageleft-fotter mt-auto">
        <img src="/image/loginimage.webp" alt="" className="img-fluid" />
      </div>
    </div>
  );
}
export default LoginLayout;

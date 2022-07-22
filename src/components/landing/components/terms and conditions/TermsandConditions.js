import React, { useState, useEffect } from "react";
import { GetTermsData } from "./api/GET";
import "./styles/TermsandConditions.scss";
import { useHistory } from "react-router-dom";
import { LandingText } from "../../const/Const_Landing";
import ReactHtmlParser from "react-html-parser";
function TermsandConditions() {
  const [termsdata, SetTermsData] = useState([]);
  const usehistory = useHistory();
  useEffect(() => {
    getTermsDatas();
  }, []);
  const getTermsDatas = () => {
    GetTermsData()
      .then((res) => {
        if (res.status) {
          SetTermsData(res.data.terms);
        }
      })
  };
  return (
    <div className="terms-main">
      <div className="nav-bar">
        <span className="round-icon" onClick={() => usehistory.goBack("/")}>
          <i class="fa-solid fa-angle-left"></i>
        </span>
        <h1 className="termsed">{LandingText.TermsandConditions}</h1>
      </div>
      <div className="terms-body-content">
        <div className="terms-content-text">{ReactHtmlParser(termsdata)}</div>
      </div>
    </div>
  );
}
export default TermsandConditions;

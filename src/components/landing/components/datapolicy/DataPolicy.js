import React, { useEffect, useState } from "react";
import { getDataPolicy } from "./api/GET";
import ReactHtmlParser from "react-html-parser";
import { useHistory } from "react-router-dom";
import { LandingText } from "../../const/Const_Landing";
function DataPolicy() {
  const [datapolicy, setDataPolicy] = useState([]);
  const usehistory = useHistory();
  useEffect(() => {
    getDataEmpty();
  }, []);
  const getDataEmpty = () => {
    getDataPolicy()
      .then((res) => {
        if (res.status) {
          setDataPolicy(res.data.policy);    
        }     
      })    
  };
  return (
    <div className="terms-main">
      <div className="nav-bar">
        <span className="round-icon" onClick={() => usehistory.goBack("/")}>
          <i class="fa-solid fa-angle-left"></i>
        </span>
        <h1 className="termsed">{LandingText.DataPolicy}</h1>
      </div>
      <div className="terms-body-content">
        <div className="terms-content-text">{ReactHtmlParser(datapolicy)}</div>
      </div>
    </div>
  );
}
export default DataPolicy;

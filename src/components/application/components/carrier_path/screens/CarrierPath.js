import React, { Component } from "react";
import "../styles/CarrierPath.scss";
import { withRouter } from "react-router-dom";
import { carrerpathText } from "../const/Const_CarrerPath";
class CarrierPath extends Component {
  render() {
    return (
      <div className="carrierpath">
        <div className="carrierpath-upper d-flex flex-row justify-content-center ">
          <h1 className="carrierpath-heading">{carrerpathText.title}</h1>
        </div>
        <div className="carrierpath-fotter">
          <div className="carrierpath-button d-md-flex flex-row ">
            <div className="carrierpath-selectcard">
              <img
                src="image/careerselection-yes.png"
                alt=""
                className="careerselection-yes img-fluid ms-5"
              />
              <div className="carrierpath-card">
                <p>{carrerpathText.testAnalysisQuestion} </p>
                <div className="d-flex flex-row">
                  <span className="circle mt-2 me-3"></span>
                  <p>{carrerpathText.testAnalysisContent}</p>
                </div>
                <button
                  className="btn-blue mt-4"
                  onClick={() => this.props.history.push("/selectcareer")}
                >
                  {carrerpathText.yes}
                </button>
              </div>
            </div>
            <div className="carrierpath-selectcard">
              <img
                src="image/carrerselection-no.png"
                alt=""
                className="careerselection-no img-fluid ms-5 ps-5"
              />
              <div className="carrierpath-card ms-md-5 mt-5 mt-md-0">
                <p>{carrerpathText.selectIndustryQuestion}</p>
                <div className="d-flex flex-row">
                  <span className="circle mt-2 me-3"></span>
                  <p>{carrerpathText.selectIndustryContent}</p>
                </div>
                <button
                  className="btn-blue mt-4"
                  onClick={() => this.props.history.push("/selectindustry")}
                >
                  {carrerpathText.yes}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(CarrierPath);

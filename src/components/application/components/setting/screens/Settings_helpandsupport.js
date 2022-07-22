import React, { Component } from "react";
import { SettingTexts } from "../const/Const_settings";
export default class Settings_helpandsupport extends Component {
  constructor(props) {
    super(props);
    this.state = { active: true };
  }
  render() {
    return (
      <div>
        {this.state.active ? (
          <div className="Settings-helpandsupport  d-flex flex-row">
            <div className="Settings-helpandsupport-left">
              <p className="para">{SettingTexts.Loremipsum}</p>
              <h6 className="heading mt-3">{SettingTexts.TrollFreeNumber}</h6>
              <div className="d-flex flex-row ">
                <p className="phone-number mt-4 ">{SettingTexts.Number}</p>
                <button
                  type="submit"
                  className="btn-blue d-sm-block d-md-none ms-auto"
                >
                  {SettingTexts.Livechat}
                </button>
              </div>
              <h6 className="heading">{SettingTexts.TermsCondtion}</h6>
              <div className="terms_conditions">
                <p className="TermsandCondtion">
                  {" "}
                  {SettingTexts.Loremipsumdolor}
                </p>
                <p className="TermsandCondtion">
                  {" "}
                  {SettingTexts.Loremipsumdolor}
                </p>
                <p className="TermsandCondtion">
                  {" "}
                  {SettingTexts.Loremipsumdolor}
                </p>
              </div>
            </div>
            <div className="Settings-helpandsupport-right my-auto">
              <img
                src="/image/signup_left_1.png"
                alt=""
                className="img-fluid"
              />
              <button type="submit" className="btn-blue">
                {SettingTexts.Livechat}
              </button>
            </div>
          </div>
        ) : (
          <div className="Settings-helpandsupport  d-flex flex-row">
            <div className="Settings-helpandsupport-left">
              <p className="para">{SettingTexts.Loremipsum}</p>
              <h6 className="heading mt-3"> {SettingTexts.TrollFreeNumber}</h6>
              <div className="d-flex flex-row ">
                <p className="phone-number mt-4 "> {SettingTexts.Number}</p>
                <button
                  type="submit"
                  className="btn-blue d-sm-block d-md-none ms-auto"
                >
                  {SettingTexts.Livechat}
                </button>
              </div>
              <h6 className="heading"> {SettingTexts.TermsCondtion}</h6>
              <div className="terms_conditions">
                <p className="TermsandCondtion">
                  {" "}
                  {SettingTexts.Loremipsumdolor}
                </p>
                <p className="TermsandCondtion">
                  {" "}
                  {SettingTexts.Loremipsumdolor}
                </p>
                <p className="TermsandCondtion">
                  {" "}
                  {SettingTexts.Loremipsumdolor}
                </p>
              </div>
            </div>
            <div className="Settings-helpandsupport-right my-auto">
              <img
                src="/image/signup_left_1.png"
                alt=""
                className="img-fluid"
              />
              <button type="submit" className="btn-blue">
                {SettingTexts.Livechat}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

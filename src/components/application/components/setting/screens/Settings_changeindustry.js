import React, { Component } from "react";
import { SettingTexts } from "../const/Const_settings";
import "../styles/Setting_user.scss";
export default class Settings_changeindustry extends Component {
  render() {
    return (
      <div className="Settings_changeindustry">
        <img
          className="img-fluid no-industry"
          src="image/changeindustry_logo.webp"
          alt=""
        />
        <span className="d-flex flex-row  mt-4">
          {SettingTexts.Youcannotchange}
        </span>
        <button
          type="button"
          className="btn-yellow mt-4 mb-2"
          data-bs-toggle="modal"
          data-bs-target="#changeindustyModal"
        >
          {SettingTexts.ChangeIndustry}
        </button>
      </div>
    );
  }
}

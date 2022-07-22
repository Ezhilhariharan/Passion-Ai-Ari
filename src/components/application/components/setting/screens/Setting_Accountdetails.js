import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../styles/Setting_user.scss";
import jwt_decode from "jwt-decode";
import { SettingAPI } from "../api/Api";
import { Skeleton } from "primereact/skeleton";
import { SettingTexts } from "../const/Const_settings";
const editusernameSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Too Short!")
    .max(30, "Too Long!")
    .required("Required"),
});
export default class SettingAccountdetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showusername: true,
      user_id: "",
      passionuserid: "",
    };
    this.SettingAPI = new SettingAPI();
    this.settingdata = this.props.settingdata.bind(this);
  }
  componentDidMount() {
    let userid = localStorage.getItem("passion_token");
    let decoded = jwt_decode(userid);
    this.setState({ passionuserid: decoded.user_id });
  }
  render() {
    const { profiledata } = this.props;
    return (
      <div className="multiple-comp pt-lg-5 pt-md-3 ps-md-5 ps-3">
        <div className="d-flex flex-row">
          <span className="field pt-1">{SettingTexts.UserName}</span>
          {this.state.showusername ? (
            <div className=" field-width d-flex flex-row">
              <span className="value ms-3 pt-1">
                {profiledata === "" ? (
                  <Skeleton
                    width="10rem"
                    className="p-mb-2 ms-4 mt-4"
                    style={{ backgroundcolor: "black" }}
                  ></Skeleton>
                ) : (
                  profiledata.username
                )}
              </span>
            </div>
          ) : (
            <div className=" field-width-setting  ">
              <Formik
                className="d-flex flex-row field-width"
                initialValues={{ username: "" }}
                onSubmit={(values, onSubmitProps) => {
                  onSubmitProps.resetForm();
                  let formDatausername = new FormData();
                  formDatausername.append("name", values.username);
                  // this.props.Loading()
                  this.SettingAPI.EditUserName(
                    formDatausername,
                    this.state.passionuserid
                  ).then((res) => {
                  });
                }}
                onBlur={this.emailverify}
                validationSchema={editusernameSchema}
              >
                <Form className="d-flex flex-row ">
                  <Field
                    id="username"
                    name="username"
                    type="username"
                    className="input-update "
                    placeholder={profiledata.username}
                  />
                  <ErrorMessage name="currentpassword">
                    {(msg) => <div style={{ color: "black" }}>{msg}</div>}
                  </ErrorMessage>
                  <button type="submit" className="btn-icon my-auto  ms-5">
                    <i class="fa-solid fa-floppy-disk cancel-icon"></i>
                  </button>
                  <span
                    className="form-cancel my-auto  ms-auto me-2"
                    onClick={() =>
                      this.setState({
                        showusername: true,
                      })
                    }
                  >
                    {SettingTexts.Cancel}
                  </span>
                </Form>
              </Formik>
            </div>
          )}
        </div>
        <div className="d-flex flex-row mt-3">
          <span className="field pt-1">{SettingTexts.Password}</span>
          <div className="field-width d-flex flex-row">
            <span className="value ms-3  pt-1">{SettingTexts.Dotts}</span>
            <i
              onClick={() => this.props.changepassword()}
              className="fa-solid fa-pen-to-square d-flex flex-row ms-auto my-auto"
            ></i>
          </div>
        </div>
      </div>
    );
  }
}

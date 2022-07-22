import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SettingTexts } from "../const/Const_settings";
import { SettingAPI } from "../api/Api";
import {  encode as base64_encode } from "base-64";
import ErrorModal from "../../../../common_Components/popup/ErrorModalpoup";
const changePasswordSchema = Yup.object().shape({
  currentpassword: Yup.string()
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    // )
    .required("Required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    )
    .required("Required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});
export default class Settingchangepassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showusername: true,
      showHidePassword: false,
      showHidecurrentPassword: false,
      showHideconfirmPassword: false,
      errormodal: false,
      errorMessage: "",
    };
    this.SettingAPI = new SettingAPI();
  }
  closeErrorModal = () => {
    this.setState({ errorMessage: "", errormodal: false });
  };
  render() {
    return (
      <div className="multiple-comp pt-lg-5 pt-md-3 ps-md-5 ps-3">
        <Formik
          initialValues={{
            currentpassword: "",
            password: "",
            confirmpassword: "",
          }}
          onSubmit={(values, onSubmitProps) => {
            onSubmitProps.resetForm();
            this.props.Loading();
            // 
            let formData = new FormData();
            let currentpassword = base64_encode(values.currentpassword);
            let confirmpassword = base64_encode(values.confirmpassword);
            formData.append("old_password", currentpassword);
            formData.append("new_password", confirmpassword);
            this.SettingAPI.PostResetPassword(formData).then((res) => {
              this.props.Loading();            
              if (res.status) {              
                this.props.backto_accountdetails();
                this.props.logoutfunc();
              } else {
                if (res.message) {
                  if (typeof res.message === "object") {
                    let value = Object.values(res.message);
                    this.setState({ errorMessage: value[0], errormodal: true });
                  } else {
                    this.setState({
                      errorMessage: res.message,
                      errormodal: true,
                    });
                  }
                } else {
                  this.setState({
                    errorMessage: "Something Went Wrong",
                    errormodal: true,
                  });
                }
              }
            });
          }}
          validationSchema={changePasswordSchema}
        >
          <Form className="">
            <div className="d-flex flex-row mt-3">
              <div
                className="field-password me-2 me-md-5 mt-1"
                htmlFor="password"
              >
                {SettingTexts.CurrentPassword}
              </div>
              <div className="password d-flex flex-row">
                <Field
                  id="currentpassword"
                  name="currentpassword"
                  type={
                    this.state.showHidecurrentPassword ? "text" : "password"
                  }
                  className="input-password"
                />
                <i
                  className={
                    this.state.showHidecurrentPassword
                      ? "fa-solid fa-eye show-icon   "
                      : "fa-solid fa-eye-slash show-icon   "
                  }
                  onClick={() =>
                    this.setState({
                      showHidecurrentPassword:
                        !this.state.showHidecurrentPassword,
                    })
                  }
                ></i>
              </div>
            </div>
            <ErrorMessage name="currentpassword">
              {(msg) => (
                <div
                  style={{
                    color: "red",
                    padding: "10px 0px 0px 250px",
                  }}
                >
                  {msg}
                </div>
              )}
            </ErrorMessage>
            <div className=" d-flex flex-row mt-4">
              <div
                className="field-password me-2 me-md-5 mt-1"
                htmlFor="password"
              >
                {SettingTexts.NewPassword}
              </div>
              <div className="password d-flex flex-row">
                <Field
                  id="password"
                  name="password"
                  type={this.state.showHidePassword ? "text" : "password"}
                  className="input-password"
                />
                <i
                  className={
                    this.state.showHidePassword
                      ? "fa-solid fa-eye show-icon "
                      : "fa-solid fa-eye-slash show-icon "
                  }
                  onClick={() =>
                    this.setState({
                      showHidePassword: !this.state.showHidePassword,
                    })
                  }
                ></i>
              </div>
            </div>
            <ErrorMessage name="password">
              {(msg) => (
                <div
                  style={{
                    color: "red",
                    padding: "10px 0px 0px 250px",
                  }}
                >
                  {msg}
                </div>
              )}
            </ErrorMessage>
            <div className=" d-flex flex-row mt-4">
              <div
                className="field-password me-2 me-md-5 mt-1"
                htmlFor="number"
              >
                {SettingTexts.ConfirmPassword}
              </div>
              <div className="password d-flex flex-row">
                <Field
                  id="confirmpassword"
                  name="confirmpassword"
                  type={
                    this.state.showHideconfirmPassword ? "text" : "password"
                  }
                  className="input-password"
                />
                <i
                  className={
                    this.state.showHideconfirmPassword
                      ? "fa-solid fa-eye show-icon "
                      : "fa-solid fa-eye-slash show-icon "
                  }
                  onClick={() =>
                    this.setState({
                      showHideconfirmPassword:
                        !this.state.showHideconfirmPassword,
                    })
                  }
                ></i>
              </div>
            </div>
            <ErrorMessage name="confirmpassword">
              {(msg) => (
                <div
                  style={{
                    color: "red",
                    padding: "10px 0px 0px 250px",
                  }}
                >
                  {msg}
                </div>
              )}
            </ErrorMessage>
            <div className="d-flex flex-row  mt-5 ms-5 mb-4">
              {" "}
              <button
                onClick={() => this.props.backto_accountdetails()}
                className="btn-submit me-5"
              >
                {SettingTexts.Cancel}
              </button>{" "}
              <button type="submit" className="btn-submit me-5">
                {SettingTexts.Submit}
              </button>{" "}
            </div>
          </Form>
        </Formik>
        {/* <Modal
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    show={this.state.errormodal}
                    onHide={() => this.setState({ errormodal: true })}
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="w-100">
                            <center className="mt-5 mb-3">
                                <h4>
                                    <b>{this.state.errorMessage}</b>
                                </h4>
                            </center>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-flex flex-row justify-content-center w-100">
                            <button
                                className="btn-blue mt-4 mb-5 w-50"
                                onClick={() => this.setState({ errormodal: false })}
                            >
                                OK
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal> */}
        <ErrorModal
          message={this.state.errorMessage}
          value={this.state.errormodal}
          closeModal={this.closeErrorModal}
        />
      </div>
    );
  }
}

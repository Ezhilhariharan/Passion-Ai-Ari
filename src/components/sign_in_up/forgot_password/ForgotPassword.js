import React, { Component } from "react";
import "./styles/ForgotPassword.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { withRouter } from "react-router-dom";
import LoginLayout from "../left_layout/Leftcommon_loginLayout/Left_LoginLayout.js";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { signinText } from "../login/LoginConst";
import { API } from "./api/Api";
import { connect } from "react-redux";
import { encode as base64_encode } from "base-64";
import ErrorModal from "../../common_Components/popup/ErrorModalpoup";
const ForgotPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters,1 Uppercase,1 Lowercase,1 Number and 1 special case Character"
    ),
  ConfirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});
const EmailSchema = Yup.object().shape({
  email: Yup.string().required("Required"),
});
let url, TokenID;
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
      showHidePassword: false,
      showHideconfirmPassword: false,
      loading: false,
      key: "",
      show: false,
      message: "User Not Found",
      showMsg: false,
    };
    url = this.props.match.path;
    TokenID = this.props.match.params;
    this.Api = new API();
    this.showLoading = this.showLoading.bind(this);
  }
  componentDidMount() {
    let locationparams = window.location.href.split("?token=")[1];
    if (locationparams === undefined) {
      this.setState({ active: true });
    } else {
      this.setState({ active: false, key: locationparams });
    }
  }
  redirecttologin = () => {
    this.setState({ showMsg: false });
    this.props.history.push("/login");
  };
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  closeErrorModal = () => {
    this.setState({ message: "", show: false });
  };
  render() {
    return (
      <div className="app">
        <div className="app-left">
          <LoginLayout />
        </div>
        <div className="app-right">
          <div className="form-border mx-auto pb-5 ">
            <div
              className="back-icon ms-auto me-5"
              onClick={() => this.props.history.push("/login")}
            >
              <i className="fa-solid fa-chevron-left "></i>
            </div>
            {this.state.active ? (
              <Formik
                initialValues={{ email: "" }}
                onSubmit={(values, onSubmitProps) => {
                  let formData = new FormData();
                  formData.append("email", values.email);
                  this.showLoading();
                  this.Api.forgotPassword(formData).then((res) => {
                    this.showLoading();
                    if (res.status) {
                      this.setState({ showMsg: true });
                    } else {
                      if (res.message) {
                        if (typeof res.message === "object") {
                          let value = Object.values(res.message);
                          this.setState({ message: value[0], show: true });
                        } else {
                          this.setState({ message: res.message, show: true });
                        }
                      } else {
                        this.setState({
                          message: "Something Went Wrong",
                          show: true,
                        });
                      }
                    }
                  });
                }}
                validationSchema={EmailSchema}
              >
                <Form className="customForm mt-4 mb-5">
                  <div className="form-group">
                    <label className="label mt-5" htmlFor="password">
                      {signinText.email}
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="input"
                    />
                    <ErrorMessage name="email">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="forgotpassword d-flex flex-row mt-5  mb-5">
                    {" "}
                    <button type="submit" className="btn-blue">
                      {signinText.submit}
                    </button>{" "}
                  </div>
                </Form>
              </Formik>
            ) : (
              <Formik
                initialValues={{ password: "" }}
                onSubmit={(values, onSubmitProps) => {
                  let formData = new FormData();
                  // formData.append(
                  //     "password",
                  //     values.password
                  // );
                  let encoded = base64_encode(values.password);
                  formData.append("password", encoded);
                  formData.append("token", this.state.key);
                  this.Api.submitForgotPassword(formData)
                    .then((res) => {
                      if (res.status) {
                        this.props.history.push("/login");
                      }
                    })
                    .catch((error) => {
                    });
                }}
                validationSchema={ForgotPasswordSchema}
              >
                <Form className="customForm mt-5 mb-5">
                  <center className="customForm-heading mt-4 mb-5"><h4>Change New Password</h4></center>
                  <div className="form-group mt-3">
                    <label className="label" htmlFor="password">
                      {signinText.newpassword}
                    </label>
                    <div className="d-flex flex-row">
                      <Field
                        id="password"
                        name="password"
                        type={this.state.showHidePassword ? "text" : "password"}
                        className="input"
                      />
                      <i
                        class={
                          this.state.showHidePassword
                            ? "fa-solid fa-eye eye-icon"
                            : "fa-solid fa-eye-slash eye-icon"
                        }
                        onClick={() =>
                          this.setState({
                            showHidePassword: !this.state.showHidePassword,
                          })
                        }
                      ></i>
                    </div>
                    <ErrorMessage name="password">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="form-group mt-3">
                    <label className="label" htmlFor="number">
                      {signinText.confirmpassword}
                    </label>
                    <div className="d-flex flex-row">
                      <Field
                        name="ConfirmPassword"
                        type={
                          this.state.showHideconfirmPassword
                            ? "text"
                            : "password"
                        }
                        className="input"
                      />
                      <i
                        class={
                          this.state.showHideconfirmPassword
                            ? "fa-solid fa-eye eye-icon"
                            : "fa-solid fa-eye-slash eye-icon"
                        }
                        onClick={() =>
                          this.setState({
                            showHideconfirmPassword:
                              !this.state.showHideconfirmPassword,
                          })
                        }
                      ></i>
                    </div>
                    <ErrorMessage name="ConfirmPassword">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="d-flex flex-row justify-content-center mt-5 mb-4">
                    {" "}
                    <button type="submit" className="btn-blue">
                      {signinText.submit}
                    </button>{" "}
                  </div>
                </Form>
              </Formik>
            )}
          </div>
          {/* <Modal
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        show={this.state.show}
                        onHide={() => this.setState({ show: false })}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="">
                                <center className="mt-3 mb-3">
                                    <h2>{this.state.message}</h2>
                                </center>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                onClick={() => this.setState({ show: false })}
                                className="btn-blue mx-auto mt-5 mb-5 w-50"
                            >
                                {signinText.Ok}
                            </button>
                        </Modal.Footer>
                    </Modal> */}
          <ErrorModal
            message={this.state.message}
            value={this.state.show}
            closeModal={this.closeErrorModal}
          />
          <Modal
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.showMsg}
            onHide={() => this.setState({ showMsg: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="">
                <center className="mt-1 mb-1">
                  <h2>{signinText.emailcontext}</h2>
                </center>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                onClick={this.redirecttologin}
                className="btn-blue mx-auto mt-5 mb-5"
              >
                {signinText.Ok}
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    showtoast: (data) => {
      dispatch({ type: "ShowToast", value: data });
    },
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
  };
};
export default connect(null, mapDispatchToProps)(withRouter(ForgotPassword));
// export default withRouter(ForgotPassword);

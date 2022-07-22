import React, { Component } from "react";
import SignupLayout from "../left_layout/signup_layout/Signup_layout.js";
import "./styles/Register.scss";
import PersonalDetails from "../register/personal_details/PersonalDetails";
import EmailIdSetup from "../register/register_id/IdSetup";
import EducationDetails from "../register/education_details/EducationDetails";
import { API } from "./api/api";
import { Modal } from "react-bootstrap";
import OtpComponent from "./OtpComponent.js";
import ClockLoader from "react-spinners/ClockLoader";
import { css } from "@emotion/react";
import { withRouter } from "react-router-dom";
import ErrorModal from "components/common_Components/popup/ErrorModalpoup.js";
import { connect } from "react-redux";
import { registerText } from "./Registerconst";
import { decode as base64_decode, encode as base64_encode } from "base-64";
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
class RegisterLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null,
      username: "",
      loading: false,
      name: "",
      country: "",
      mobile: "",
      profile_image: "",
      college_id: "",
      department_id: "",
      batch: "",
      modal: false,
      email: "",
      dataname: "",
      dataemail: "",
      collegeName: "",
      departmentName: "",
      errorMessage: "",
      showError: false,
      batchProp: "",
      profileShow: "",
      otpError: false,
      otpErrorMessage: "",
      collegeValue: "",
    };
    this.signinAPI = new API();
    this.fromregisteroauth = this.fromregisteroauth.bind(this);
    this.closemodal = this.closemodal.bind(this);
    this.showLoading = this.showLoading.bind(this);
    this.otpErrorOpen = this.otpErrorOpen.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    if (
      (state.dataname.length === 0 && props.OauthName.length !== 0) ||
      (state.dataname.length === 0 && props.OauthName.length === 0)
    ) {
      return {
        ...props,
        ...state,
        dataname: props.OauthName,
        dataemail: props.OauthEmail,
      };
    }
    return { ...state, ...props };
  }
  componentDidMount() {
  }
  getpersonaldata = (data, pagenum, layoutnum) => {
    this.setState({
      name: data.name,
      country: data.country,
      mobile: data.mobile,
      profile_image: data.profile_image,
      active: pagenum,
      username: data.name,
      profileShow: data.profileShow,
    });
    // this.setState({active: 1})
  };
  geteducationdata = (data, pagenum, layoutnum) => {
    this.setState({
      active: pagenum,
      college_id: data.college_id,
      department_id: data.department_id,
      collegeName: data.collegeName,
      departmentName: data.departmentName,
      batch: data.batch,
      batchProp: data.batchprop,
      collegeValue: data.collegeValue,
    });
  };
  changepage = (pagenum) => {
    this.setState({ active: pagenum });
  };
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  alertToaste = () => {
    this.props.showtoast({
      text: "Successfully Created Please Wait for the Approval",
      time: new Date().getTime(),
    });
  };
  signup = (data) => {
    this.showLoading();
    this.setState({ loading: true });
    this.setState({ email: data.email });
    let formData = new FormData();
    formData.append("name", this.state.name);
    formData.append("country", this.state.country);
    formData.append("mobile_no", this.state.mobile);
    formData.append("profile_image", this.state.profile_image);
    formData.append("college_id", this.state.college_id);
    formData.append("department_id", this.state.department_id);
    formData.append("batch", this.state.batch);
    let encoded = base64_encode(data.password);
    formData.append("password", encoded);
    // formData.append("password", data.password);
    formData.append("email", data.email);
    this.signinAPI.signUp(formData).then((res) => {
      this.showLoading();
      if (res.status) {
        let datauserid = res.data.data.user_id;
        // let datauserid = res.data.user_id;
        this.setState({ userid: datauserid });
        this.setState({ modal: true });
      } else {
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({
              errorMessage: value[0],
              showError: true,
            });
          } else {
            this.setState({
              errorMessage: res.message,
              showError: true,
            });
          }
        } else {
          this.setState({
            errorMessage: "Something Went Wrong",
            showError: true,
          });
        }
      }
    });
  };
  fromregisteroauth(data) {
    this.setState({ dataemail: data });
  }
  closemodal() {
    this.setState({ modal: false });
  }
  otpErrorOpen(value, msg) {
    this.setState({ otpError: value, otpErrorMessage: msg });
  }
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  render() {
    // 
    return (
      <div className="app">
        <div className="app-left">
          <SignupLayout
            layoutnum={this.state.active}
            username={this.state.username}
          />
        </div>
        <div className="app-right">
          {/* <h1 onClick={() => this.setState({ modal: true })}>green</h1> */}
          <div className="form-border mx-auto">
            {this.state.active == null && (
              <PersonalDetails
                getdata={this.getpersonaldata}
                OauthName={this.state.dataname}
                emaildatatoregister={this.fromregisteroauth}
                name={this.state.name}
                country={this.state.country}
                mobilenum={this.state.mobile}
                profileimg={this.state.profileShow}
              />
            )}
            {this.state.active === 1 && (
              // <h1>cool</h1>
              <EducationDetails
                changepage={this.changepage}
                getdata={this.geteducationdata}
                college={this.state.collegeName}
                department={this.state.departmentName}
                batch={this.state.batch}
                college_id={this.state.college_id}
                department_id={this.state.department_id}
                collegevalue={this.state.collegeValue}
              />
            )}
            {this.state.active === 2 && (
              <EmailIdSetup
                changepage={this.changepage}
                signupdata={this.signup}
                OauthEmail={this.state.dataemail}
              />
            )}
          </div>
        </div>
        <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.modal}
          onHide={() => this.setState({ modal: false })}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="register-modal">
              <div className="d-flex flex-row justify-content-center mt-3">
                <p>
                  {registerText.Wevesent} <b>{registerText.Emailid}</b>
                </p>
              </div>
              <center className="mt-3 mb-3">
                <h4>
                  {registerText.email} : {this.state.email}
                </h4>
              </center>
              <OtpComponent
                userid={this.state.userid}
                email={this.state.email}
                loading={this.showLoading}
                closemodal={this.closemodal}
                successToast={this.alertToaste}
                otpErrormodal={this.otpErrorOpen}
              />
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.otpError}
          onHide={() => this.setState({ otpError: false })}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="w-100">
              <center className="mt-5 mb-3">
                <h4>
                  <b>{this.state.otpErrorMessage}</b>
                </h4>
              </center>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex flex-row justify-content-center w-100">
              <button
                className="btn-blue mt-4 mb-5 w-50"
                onClick={() => this.setState({ otpError: false })}
              >
                {registerText.OK}
              </button>
            </div>
          </Modal.Footer>
        </Modal>
        <ErrorModal
          message={this.state.errorMessage}
          value={this.state.showError}
          closeModal={this.closeErrorModal}
        />
        {/* <Modal
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    show={this.state.showError}
                    onHide={() => this.setState({ showError: false })}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="">
                            <center className="mt-3 mb-3">
                                <h2>{this.state.errorMessage}</h2>
                            </center>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            onClick={() => this.setState({ showError: false })}
                            className="btn-blue mx-auto mt-5 mb-5 w-50"
                        >
                            Ok
                        </button>
                    </Modal.Footer>
                </Modal> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    toast: state.toast,
    loading: state.loading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (data) => {
      dispatch({ type: "SET_USER", value: data });
    },
    showtoast: (data) => {
      dispatch({ type: "ShowToast", value: data });
    },
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RegisterLayout));
// export default withRouter(RegisterLayout)

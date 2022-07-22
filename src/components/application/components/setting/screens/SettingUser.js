import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../styles/Setting_user.scss";
import Sidenavbar from "../../../../navbar/sidenavbar/Sidenavbar";
import Header from "../../../../navbar/header/Header";
import SettingsPersonaldetails from "./Settings_Personaldetails";
import SettingAccountdetails from "./Setting_Accountdetails";
import Settingshelpandsupport from "./Settings_helpandsupport";
import Settingschangeindustry from "./Settings_changeindustry";
import Settingchangepassword from "./Setting_changepassword";
import * as Yup from "yup";
import FreshChat from 'react-freshchat'
import axios from "axios";
import Settingotpcomponent from "./Settingotpcomponent.js";
import { Modal } from "bootstrap";
import jwt_decode from "jwt-decode";
import { SettingAPI } from "../api/Api";
import Emailotpcomponent from "./EmailotpComponent";
import { connect } from "react-redux";
import { SettingTexts } from "../const/Const_settings";
import ErrorModal from "../../../../common_Components/popup/ErrorModalpoup";
import { withCookies } from "react-cookie";
let usertype, ID;
class Settinguser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
      show: false,
      profiledata: {},
      otp: "",
      toggletheme: false,
      hidechangeindustry: true,
      passionuserid: "",
      email: "",
      errormodal: false,
      errorMessage: "",
      phoneNumber: "",
      currentStage: "",
      showError: false,
    };
    this.changepassword = this.changepassword.bind(this);
    this.backto_accountdetails = this.backto_accountdetails.bind(this);
    this.changeindustry = this.changeindustry.bind(this);
    this.settingdata = this.settingdata.bind(this);
    this.logout = this.logout.bind(this);
    this.SettingAPI = new SettingAPI();
    this.emailref = React.createRef();
    this.modalRef = React.createRef();
    this.EmailmodalRef = React.createRef();
    this.ErrormodalRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.phoneNumberSubmit = this.phoneNumberSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showLoading = this.showLoading.bind(this);
    ID = this.props.match.params.id;
  }
  handleChange = (otp) => this.setState({ otp });
  changepassword() {
    this.setState({ active: 5 });
  }
  backto_accountdetails() {
    this.setState({ active: 2 });
  }
  changeindustry() {
    this.SettingAPI.PatchChangeIndustry().then((res) => {
      if (res.status) {
        this.props.history.push("/selectindustry");
      } else {
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ errorMessage: value[0], showError: true });
          } else {
            this.setState({ errorMessage: res.message, showError: true });
          }
        } else {
          this.setState({
            errorMessage: "Something Went Wrong",
            showError: true,
          });
        }
      }
    });
  }
  componentDidMount() {
    if (ID && ID == "help&support") {
      this.setState({ active: 3 });
    }
    this.settingdata();
    let userid = localStorage.getItem("passion_token");
    let decoded = jwt_decode(userid);
    this.setState({ passionuserid: decoded.user_id });
  }
  settingdata() {
    usertype = localStorage.getItem("passion_usertype");
    if (usertype == 4 || usertype == 5) {
      this.SettingAPI.GetProfileDetails()
        .then((res) => {
          if (res.status) {
            this.setState({
              profiledata: res.data[0],
              currentStage: res.data[0]?.current_stage,
            });
            this.setState({ hidechangeindustry: false });
            this.props.setUser({
              user: res.data[0]?.profile_image,
            });
            this.props.setUser({
              user: res.data[0]?.profile_image + "?t=" + new Date().getTime(),
            });
            this.props.setUserName({
              user: res.data[0]?.name,
            });
          } else {
            this.setState({ profiledata: {} });
          }
        })
        .catch((err) => {
        });
    } else {
      this.SettingAPI.GetProfileDetails()
        .then((res) => {
          if (res.status) {
            this.setState({
              profiledata: res.data[0],
              currentStage: res.data[0]?.current_stage,
            });
            this.props.setUser({
              user: res.data[0]?.profile_image + "?t=" + new Date().getTime(),
            });
            this.props.setUserName({
              user: res.data[0]?.name,
            });
          } else {
            this.setState({ profiledata: {} });
          }
        })
        .catch((err) => {
        });
    }
  }
  closeOtp = () => {
    this.setState({ show: false });
    this.setState({ email: "" });
  };
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  handleSubmit(event) {
    this.showLoading();
    event.preventDefault();
    let formDataemail = new FormData();
    formDataemail.append("email", this.state.email);
    this.SettingAPI.EditGmail(formDataemail, this.state.passionuserid).then(
      (res) => {
        this.showLoading();
        if (res.status) {
          this.setState({ show: true });
          this.settingdata();
        } else {
          if (res.message) {
            if (typeof res.message === "object") {
              let value = Object.values(res.message);
              this.setState({ errorMessage: value[0], showError: true });
            } else {
              this.setState({ errorMessage: res.message, showError: true });
            }
          } else {
            this.setState({
              errorMessage: "Something Went Wrong",
              showError: true,
            });
          }
        }
      }
    );
  }
  phoneNumberSubmit(event) {
    event.preventDefault();
    this.showLoading();
    let formDataemail = new FormData();
    formDataemail.append("phonenumber", this.state.phoneNumber);
    this.SettingAPI.Editphonenumber(
      formDataemail,
      this.state.passionuserid
    ).then((res) => {
      this.showLoading();
      if (res.status) {
        this.setState({ show: true });
        this.settingdata();
      } else {
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ errorMessage: value[0], showError: true });
          } else {
            this.setState({ errorMessage: res.message, showError: true });
          }
        } else {
          this.setState({
            errorMessage: "Something Went Wrong",
            showError: true,
          });
        }
      }
    });
  }
  logout() {
    this.setState({ email: "" });
    localStorage.clear();
    this.props.cookies.remove("passion_usertype");
    this.props.cookies.remove("passion_userid");
    this.props.cookies.remove("passion_token");
    delete axios.defaults.headers.common["Authorization"];
    this.props.Logout();
  }
  apiLogout = () => {
    this.SettingAPI.logout().then((res) => {
      if (res.status) {
        localStorage.clear();
        this.props.cookies.remove("passion_usertype");
        this.props.cookies.remove("passion_userid");
        this.props.cookies.remove("passion_token");
        delete axios.defaults.headers.common["Authorization"];
        this.props.Logout();
      }
    });
  }
  clearField = () => {
    this.setState({ email: "", phoneNumber: "" })
  };
  showErrorModal = () => {
    const modalEle = this.ErrormodalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideErrorModal = () => {
    const modalEle = this.ErrormodalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  showPhoneModal = () => {
    const modalEle = this.modalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    this.setState({ email: "", phoneNumber: "" });
  };
  hidePhoneModal = () => {
    const modalEle = this.modalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
    this.setState({ show: false });
    this.clearField();
  };
  showEmailModal = () => {
    const modalEle = this.EmailmodalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    this.setState({ email: "", phoneNumber: "" });
  };
  hideEmailModal = () => {
    const modalEle = this.EmailmodalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
    this.clearField();
    this.setState({ show: false });
  };
  exitPhoneModal = () => {
    this.hidePhoneModal();
  };
  exitEmailModal = () => {
    this.hideEmailModal();
  };
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  render() {
    return (
      <div className="settinguser">
        <Sidenavbar />
        <div className="studenthomepage-header d-flex flex-row">
          <Header />
        </div>
        <div className="container-fluid settinguser-body">
          <h1 className="mt-4">{SettingTexts.Settings} </h1>
          <div className=" d-flex flex-row  justify-content-center">
            <div className="settinguser-cardbox mb-2 ">
              <div className="settinguser-body-header d-flex flex-row justify-content-around">
                <h3
                  className={"" + (this.state.active === 1 ? " ActiveTab" : "")}
                  onClick={() => this.setState({ active: 1 })}
                >
                  {SettingTexts.PersonalDetails}
                </h3>
                <h3
                  className={
                    "" +
                    (this.state.active === 2 || this.state.active === 5
                      ? " ActiveTab"
                      : "")
                  }
                  onClick={() => this.setState({ active: 2 })}
                >
                  {SettingTexts.AccountDetails}
                </h3>
                <h3
                  className={"" + (this.state.active === 3 ? " ActiveTab" : "")}
                  onClick={() => this.setState({ active: 3 })}
                >
                  {SettingTexts.HelpSupport}
                </h3>
                {this.state.hidechangeindustry &&
                  this.state.currentStage !== 3 && (
                    <h3
                      className={
                        "me-5" + (this.state.active === 4 ? " ActiveTab" : "")
                      }
                      onClick={() => this.setState({ active: 4 })}
                    >
                      {SettingTexts.ChangeIndustry}
                    </h3>
                  )}
              </div>
              <div className="settingcard-middle-line mt-2"> </div>
              <div className="child-comp">
                {this.state.active === 1 && (
                  <SettingsPersonaldetails
                    profiledata={this.state.profiledata}
                    settingdata={this.settingdata}
                    phoneModal={this.showPhoneModal}
                    emailModal={this.showEmailModal}
                    logoutfunc={this.logout}
                    Loading={this.showLoading}
                  />
                )}
                {this.state.active === 2 && (
                  <SettingAccountdetails
                    changepassword={this.changepassword}
                    profiledata={this.state.profiledata}
                    settingdata={this.settingdata}
                    logoutfunc={this.logout}
                    Loading={this.showLoading}
                  />
                )}
                {this.state.active === 3 && <Settingshelpandsupport />}
                {this.state.active === 4 && <Settingschangeindustry />}
                {this.state.active === 5 && (
                  <Settingchangepassword
                    backto_accountdetails={this.backto_accountdetails}
                    logoutfunc={this.apiLogout}
                    Loading={this.showLoading}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal fade"
          id="staticBackdrop"
          ref={this.modalRef}
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title ms-auto" id="staticBackdropLabel">
                  {SettingTexts.Phonenoverification}
                </h5>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  onClick={this.hidePhoneModal}
                ></i>
              </div>
              <div class="modal-body">
                <form onSubmit={this.phoneNumberSubmit}>
                  <div className="d-flex flex-row mt-3 justify-content-center">
                    <input
                      id="number"
                      name="number"
                      type="text"
                      maxLength="10"
                      className="input-password-modal px-3"
                      placeholder="Please enter your mobile number...."
                      value={this.state.phoneNumber}
                      pattern="[1-9]{1}[0-9]{9}"
                      title="Enter 10 digit mobile number"
                      onChange={(e) =>
                        this.setState({
                          phoneNumber: e.target.value,
                          // /^[aA-zZ\s]+$/,.replace(/^[aA-zZ\s]+$/," ")
                        })
                      }
                      disabled={this.state.show}
                      required
                    />
                  </div>
                  <div className="d-flex flex-row justify-content-center mt-5 ms-5">
                    {this.state.show ? null : (
                      <button type="submit" className="btn-yellow w-25 me-5">
                        {SettingTexts.Submit}
                      </button>
                    )}
                  </div>
                </form>
                {this.state.show ? (
                  <div>
                    <Settingotpcomponent
                      show={this.closeOtp}
                      logoutfunc={this.apiLogout}
                      exitModal={this.exitPhoneModal}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal fade"
          id="emailpopup"
          ref={this.EmailmodalRef}
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title ms-auto">
                  {SettingTexts.Emailverification}
                </h5>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  onClick={this.hideEmailModal}
                ></i>
              </div>
              <div class="modal-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="d-flex flex-row mt-3 justify-content-center">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="input-password-modal"
                      placeholder=""
                      value={this.state.email}
                      disabled={this.state.show}
                      onChange={(e) =>
                        this.setState({
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="d-flex flex-row justify-content-center mt-5 ms-5">
                    {this.state.show ? null : (
                      <button type="submit" className="btn-yellow w-25 me-5">
                        {SettingTexts.Submit}
                      </button>
                    )}
                  </div>
                </form>
                {this.state.show ? (
                  <div>
                    <Emailotpcomponent
                      show={this.closeOtp}
                      logoutfunc={this.logout}
                      exitModal={this.exitEmailModal}
                      user_id={this.state.passionuserid}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal fade"
          id="changeindustyModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              <div class="modal-header">
                {/* <h5 class="modal-title" id="exampleModalLabel">
                                    {SettingTexts.ChangeIndustry}
                                </h5> */}
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body changeindustry">
                <h1>{SettingTexts.Youhaveonly}</h1>
                <img
                  className="img-fluid mt-5"
                  src="/image/changeindustrywarning.png"
                  alt=""
                />
                <button
                  type="button"
                  className="btn-yellow  mt-5"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={this.changeindustry}
                >
                  {SettingTexts.Change}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal fade"
          id="changeindustyModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              <div class="modal-header">
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body changeindustry">
                <h1>{SettingTexts.Youhaveonly}</h1>
                <img
                  className="img-fluid mt-5"
                  src="/image/changeindustrywarning.png"
                  alt=""
                />
                <button
                  type="button"
                  className="btn-yellow  mt-5"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => this.changeindustry}
                >
                  {SettingTexts.Change}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <div
                    class="modal "
                    id="changeindustyModal"
                    tabindex="-1"
                    ref={this.ErrormodalRef}
                >
                    <div class="modal-dialog modal-dialog-centered modal-sm modal-small">
                        <div className="modal-content ">
                            <div class="modal-header">
                            </div>
                            <div class="modal-body changeindustry">
                                <div className="w-100">
                                    <center className="mt-2 mb-3">
                                        <h4>
                                            <b>{this.state.errorMessage}</b>
                                        </h4>
                                    </center>
                                </div>
                                <div className="d-flex flex-row justify-content-center w-100">
                                    <button
                                        className="btn-blue mt-2  w-50"
                                        onClick={this.hideErrorModal}
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                */}
        <ErrorModal
          message={this.state.errorMessage}
          value={this.state.showError}
          closeModal={this.closeErrorModal}
        />
        {/* <FreshChat
          token=""
          email='user@email.com'
          first_name='...'
          onInit={widget => {
            // widget.user.setProperties({
            //   email: user.email,
            //   first_name: user.firstName,
            //   last_name: user.lastName,
            //   phone: user.phoneNumber,
            // })

          }}
        /> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    isLoggedIn: state.user.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (data) => {
      dispatch({ type: "UPDATE_HEADER", value: data["user"] });
    },
    setUserName: (data) => {
      dispatch({ type: "UPDATE_USERNAME", value: data["user"] });
    },
    Logout: () => {
      dispatch({ type: "LOGOUT" });
    },
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
  };
};
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withRouter(Settinguser));
export default withCookies(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Settinguser))
);

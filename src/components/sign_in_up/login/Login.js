import React, { Component } from "react";
import "./styles/Login.scss";
import { withRouter } from "react-router-dom";
import axios from "axios";
import LoginLayout from "../left_layout/Leftcommon_loginLayout/Left_LoginLayout.js";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import FacebookLogin from "react-facebook-login";
import { GoogleAPI, GoogleLogin } from "react-google-oauth";
import { signinText } from "./LoginConst";
import instance from "services/Instance";
import { API } from "./api/Api";
import validator from "validator";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { encode as base64_encode } from "base-64";
import ErrorModal from "../../common_Components/popup/ErrorModalpoup";
import { withCookies } from "react-cookie";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHidePassword: false,
      industry_selected: null,
      show: false,
      message: "User Not Found",
      loading: false,
      registername: "",
      registeremail: "",
      password: "",
      email: "",
      passwordError: "",
      emailError: "",
      emailTouch: false,
      passwordTouch: false,
      notificationList: [],
    };
    this.showError = this.showError.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
    this.toregister = this.props.toregister.bind(this);
    this.API = new API();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showLoading = this.showLoading.bind(this);
    this.checkingCookies = this.checkingCookies.bind(this);
    this.applicationSetup = this.applicationSetup.bind(this);
    this.setupApplicationFromCookies = this.setupApplicationFromCookies.bind(this);
  }
  forgotpassword = () => {
    this.props.history.push("/forgotpassword/");
  };
  register = () => {
    this.props.history.push("/Register");
  };
  componentDidMount() {
    if (!this.props.user.isLoggedIn) {
      console.log("login ")
    } else {
      let passion_usertype = this.props.cookies.get('passion_usertype')
      let passion_userid = this.props.cookies.get('passion_userid')
      let passion_token = this.props.cookies.get('passion_token')
      let industry_selected = this.props.cookies.get("IND_S")
      console.log("industry_selected", industry_selected);
      if (passion_usertype && passion_userid && passion_token) {
        instance.defaults.headers.common["Authorization"] =
          "Token " + passion_token;
        axios.defaults.headers.common["Authorization"] =
          "Token " + passion_token;
        localStorage.setItem("passion_usertype", passion_usertype);
        localStorage.setItem("passion_userid", passion_userid);
        localStorage.setItem("passion_token", passion_token);
        console.log("passion_usertype", passion_usertype, "passion_userid", passion_userid, "passion_token", passion_token)
        switch (passion_usertype) {
          case "1":
            return this.props.history.push("/admin");
          case "2":
            return this.props.history.push("/admin");
          case "3":
            return this.props.history.push("/admin");
          case "4":
            return this.props.history.push("/home");
          case "5":
            return this.props.history.push("/home");
          case "6":
            if (industry_selected == "false") {
              return this.props.history.push("/carrerpath");
            } else {
              return this.props.history.push("/home")
            }
          // return industry_selected
          // ? this.props.history.push("/home")
          // : this.props.history.push("/carrerpath");
          default:
            return <h1>On Process</h1>;
        }
      }
    }
  }
  showError() {
    this.toast.show({
      severity: "error",
      summary: "Error Message",
      detail: "Email or Password INVALID",
      life: 5000,
    });
  }
  responseFacebook(response) {
    this.showLoading();
    let datatime = new Date().toString();
    let formData = new FormData();
    formData.append("email", response.email);
    formData.append("timezone", datatime);
    formData.append("oauth_id", response.userID);
    formData.append("oauth_type", response.graphDomain);
    if (this.props.notify.token) {
      formData.append("fcm_token", this.props.notify.token);
    }
    this.API.login(formData).then((res) => {
      if (res.status) {
        this.showLoading();
        this.setState({ email: "", password: "" });
        let payload = this.checkingCookies(res.data.industry_selected)
        if (!payload) {
          this.applicationSetup(res.data.access_token, res.data.industry_selected)
        }
      } else {
        this.showLoading();
        localStorage.clear();
        delete axios.defaults.headers.common["Authorization"];
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
  }
  login = (response) => {
    let profile = response.getBasicProfile();
    this.showLoading();
    let datatime = new Date().toString();
    let formData = new FormData();
    formData.append("email", profile.getEmail());
    formData.append("timezone", datatime);
    formData.append("oauth_id", profile.getId());
    formData.append("oauth_type", "google");
    if (this.props.notify.token) {
      formData.append("fcm_token", this.props.notify.token);
    }
    this.API.login(formData).then((res) => {
      if (res.status) {
        localStorage.clear();
        this.showLoading();
        this.setState({ email: "", password: "" });
        localStorage.setItem("OG", "true");
        this.props.cookies.set("OG", "true");
        let payload = this.checkingCookies(res.data.industry_selected)
        if (!payload) {
          this.applicationSetup(res.data.access_token, res.data.industry_selected)
        }
      } else {
        this.showLoading();
        localStorage.clear();
        delete axios.defaults.headers.common["Authorization"];
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
  };
  login_loader = () => {
    console.clear();
  };
  update = (response) => {
  };
  failure = (res) => {
  };
  handleChange(event) {
    if (event.target.name === "email") {
      let email = event.target.value;
      if (validator.isEmail(email)) {
        this.setState({ emailError: "" });
      } else {
        this.setState({ emailError: "Enter valid Email!" });
      }
      this.setState({ email: event.target.value });
    } else if (event.target.name === "password") {
      this.setState({ password: event.target.value });
    } else {
      this.setState({ password: "", email: "" });
    }
  }
  checkingCookies(industry_selected) {
    let Token = document.cookie.split(';');
    let payload = null;
    if (Token) {
      Token.forEach(item => {
        console.log('cookie item', item)
        if (item.trim().startsWith('_SecurePA2')) {
          console.log(item)
          payload = item.split('=')[1]
        }
      })
      if (payload) {
        let info = jwt_decode(payload);
        // let token = window.atob(payload.split('.')[1])
        console.log("token", info)
        if (Object.keys(info).length !== 0) {
          this.setupApplicationFromCookies(payload, industry_selected, info)
        }
        return payload;
      }
      // console.log('no token')
      return payload
    }
    return payload
  }
  setupApplicationFromCookies(access_token, industry_selected, data) {
    this.setState({ industry_selected: industry_selected });
    this.props.cookies.set("passion_token", access_token, { path: "/", });
    localStorage.setItem("passion_token", access_token);
    let token = localStorage.getItem("passion_token");
    localStorage.setItem("IND_S", industry_selected);
    this.notificationList();
    localStorage.setItem("passion_image", data.profile_image);
    this.props.cookies.set("passion_usertype", data.user_type, { path: "/", });
    this.props.cookies.set("passion_userid", data.user_id, { path: "/", });
    this.props.cookies.set("IND_S", industry_selected, { path: "/", });
    localStorage.setItem("passion_image", data.profile_image);
    localStorage.setItem("passion_usertype", data.user_type);
    localStorage.setItem("passion_userid", data.user_id);
    let usertype = localStorage.getItem("passion_usertype");
    this.props.setUser({ user: data });
    switch (usertype) {
      case "1":
        return this.props.history.push("/admin");
      case "2":
        return this.props.history.push("/admin");
      case "3":
        return this.props.history.push("/admin");
      case "4":
        return this.props.history.push("/home");
      case "5":
        return this.props.history.push("/home");
      case "6":
        return this.state.industry_selected
          ? this.props.history.push("/home")
          : this.props.history.push("/carrerpath");
      default:
        return <h1>On Process</h1>;
    }
  }
  applicationSetup(access_token, industry_selected) {
    instance.defaults.headers.common["Authorization"] =
      "Token " + access_token;
    axios.defaults.headers.common["Authorization"] =
      "Token " + access_token;
    // let industryselected = res.data.industry_selected;
    this.setState({ industry_selected: industry_selected });
    this.props.cookies.set("passion_token", access_token, { path: "/", });
    localStorage.setItem("passion_token", access_token);
    let token = localStorage.getItem("passion_token");
    let decoded = jwt_decode(token);
    this.notificationList();
    localStorage.setItem("IND_S", industry_selected);
    localStorage.setItem("passion_image", decoded.profile_image);
    this.props.cookies.set("passion_usertype", decoded.user_type, { path: "/", });
    this.props.cookies.set("passion_userid", decoded.user_id, { path: "/", });
    this.props.cookies.set("IND_S", industry_selected, { path: "/", });
    localStorage.setItem("passion_image", decoded.profile_image);
    localStorage.setItem("passion_usertype", decoded.user_type);
    localStorage.setItem("passion_userid", decoded.user_id);
    let usertype = localStorage.getItem("passion_usertype");
    this.props.setUser({ user: decoded });
    switch (usertype) {
      case "1":
        return this.props.history.push("/admin");
      case "2":
        return this.props.history.push("/admin");
      case "3":
        return this.props.history.push("/admin");
      case "4":
        return this.props.history.push("/home");
      case "5":
        return this.props.history.push("/home");
      case "6":
        return this.state.industry_selected
          ? this.props.history.push("/home")
          : this.props.history.push("/carrerpath");
      default:
        return <h1>On Process</h1>;
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    if (
      this.state.emailTouch &&
      this.state.passwordTouch &&
      this.state.email.length !== 0 &&
      this.state.password.length !== 0
    ) {
      this.showLoading();
      let formData = new FormData();
      formData.append("email", this.state.email);
      let encoded = base64_encode(this.state.password);
      formData.append("password", encoded);
      formData.append("timezone", new Date().toString());
      console.log("fcm_token", this.props.notify.token)
      if (this.props.notify.token) {
        formData.append("fcm_token", this.props.notify.token);
      }
      if (axios.defaults.headers.common.hasOwnProperty("Authorization")) {
        delete axios.defaults.headers.common["Authorization"];
      }
      if (instance.defaults.headers.common.hasOwnProperty("Authorization")) {
        delete instance.defaults.headers.common["Authorization"];
      }
      this.API.login(formData).then((res) => {
        if (res.status) {
          localStorage.clear();
          this.showLoading();
          this.setState({ email: "", password: "" });
          let payload
          if (res.data.hasOwnProperty("industry_selected")) {
            payload = this.checkingCookies(res.data.industry_selected)
          } else {
            payload = this.checkingCookies(false)
          }
          console.log('pay', payload);
          if (!payload) {
            this.applicationSetup(res.data.access_token, res.data.industry_selected)
          }
        } else {
          this.showLoading();
          localStorage.clear();
          delete axios.defaults.headers.common["Authorization"];
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
    } else {
      this.setState({ emailTouch: true, passwordTouch: true });
    }
  }
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  notificationList = () => {
    this.API.Noification().then((data) => {
      if (data.status) {
        this.props.NotificationList({
          list: data.data,
          Time: new Date().getTime(),
        });
      }
    });
  };
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
          <div className="form-border mx-auto">
            <form className="customForm " onSubmit={this.handleSubmit}>
              <div className="login-txt mx-auto mt-4 pt-1">
                {signinText.title}
              </div>
              <div className="form-group mt-4">
                <FormControl sx={{ width: "100%" }} letiant="standard">
                  <InputLabel
                    htmlFor="standard-adornment-email"
                    className="label-password"
                  >
                    {signinText.email}
                  </InputLabel>
                  <Input
                    id="standard-adornment-email"
                    type="email"
                    name="email"
                    className="input-password-mi"
                    onChange={this.handleChange}
                    onBlur={() => this.setState({ emailTouch: true })}
                  />
                </FormControl>
                {this.state.emailTouch &&
                  this.state.emailError === "" &&
                  this.state.email.length === 0 ? (
                  <div style={{ color: "red" }}>{signinText.required}</div>
                ) : (
                  <div style={{ color: "red" }}>{this.state.emailError}</div>
                )}
              </div>
              <div className="form-group mt-3">
                <FormControl sx={{ width: "100%" }} letiant="standard">
                  <InputLabel
                    htmlFor="standard-adornment-password"
                    className="label-password"
                  >
                    {" "}
                    {signinText.password}
                  </InputLabel>
                  <Input
                    id="standard-adornment-password"
                    type={this.state.showHidePassword ? "text" : "password"}
                    name="password"
                    className="input-password-mi"
                    onChange={this.handleChange}
                    onBlur={() =>
                      this.setState({
                        passwordTouch: true,
                      })
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            this.setState({
                              showHidePassword: !this.state.showHidePassword,
                            })
                          }
                        >
                          {this.state.showHidePassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {this.state.passwordTouch &&
                    this.state.password.length === 0 ? (
                    <div style={{ color: "red" }}>
                      {signinText.psswrdrequired}
                    </div>
                  ) : null}
                </FormControl>
              </div>
              <div className="mt-2 w-100 ">
                <div
                  onClick={this.forgotpassword}
                  className="cursor-pointer forgot-passwordd float-end mt-1 me-5 pe-3"
                >
                  {signinText.forgotpsswrd} ?
                </div>
              </div>
              <div className=" w-100 d-flex flex-row justify-content-center">
                <button
                  type="Submit"
                  value="Submit"
                  className="btn-blue mx-auto mt-5"
                >
                  {signinText.submit}
                </button>
              </div>
              <div className="d-flex flex-row justify-content-center w-100 mt-4">
                <div className="w-100">
                  <div className="box-border d-flex flex-row justify-content-center w-100 mt-1">
                    <span className="login-line mt-2 me-1"></span>
                    <p className="social-icon " onClick={this.focusTextInput}>
                      {signinText.oauthtitle}
                    </p>
                    <span className="login-line mt-2 ms-1"></span>
                  </div>
                  <div className="d-flex flex-row justify-content-center oauth-login w-100">
                    <FacebookLogin
                      appId="653041295692404"
                      autoLoad={false}
                      fields="name,email,picture"
                      callback={this.responseFacebook}
                      cssClass="oauth-fb"
                    />
                    <GoogleAPI
                      clientId="120284660080-eb8a6nga53829ele6458g3vs3l7k6s4e.apps.googleusercontent.com"
                      onUpdateSigninStatus={this.update}
                      onInitFailure={this.failure}
                    >
                      <GoogleLogin
                        onLoginSuccess={this.login}
                        onLoginFailure={this.login_error}
                        onRequest={this.login_loader}
                        width={"50px"}
                        disabled={false}
                        backgroundColor={"transparent"}
                        text={"none"}
                        className="oauth-g"
                      />
                    </GoogleAPI>
                    {/* <LoginSocialGoogle
                    client_id={'120284660080-eb8a6nga53829ele6458g3vs3l7k6s4e.apps.googleusercontent.com'}
                    onLogoutFailure={this.onLogoutFailure}
                    onLoginStart={this.onLoginStart}
                    onLogoutSuccess={this.onLogoutSuccess}
                    onResolve={({ data }) => {
                    }}
                    onReject={(err) => alert(err)}
                  >
                    <img className="img m-3" src="image/Google.png" alt="" />
                  </LoginSocialGoogle> */}
                    {/* <LoginSocialLinkedin
                    client_id={'Passionaiari@8421'}
                    // redirect_uri={REDIRECT_URI}
                    onResolve={({ provider, data }) => {
                      alert(provider);
                      alert(JSON.stringify(data));
                    }}
                    onReject={(err) => alert(err)}
                  >
                    <img className="img m-3 " src="image/LinkedIn.png" alt="" />
                  </LoginSocialLinkedin> */}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row justify-content-center mt-1 mb-3">
                <span className="new-user mb-2 ">{signinText.newuser}</span>
                <span className="Sign-up mb-2 ms-2 " onClick={this.register}>
                  {signinText.signup}
                </span>
              </div>
            </form>
          </div>
        </div>
        <ErrorModal
          message={this.state.message}
          value={this.state.show}
          closeModal={this.closeErrorModal}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    notify: state.notify,
    isLoggedIn: state.user.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (data) => {
      dispatch({ type: "SET_USER", value: data });
    },
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
    NotificationList: (data) => {
      dispatch({ type: "Notification_List", value: data });
    },
  };
};
export default withCookies(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Login))
);

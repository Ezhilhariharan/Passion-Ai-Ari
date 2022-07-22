import React, { Component } from "react";
import "./styles/Header.scss";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Navbar_text } from "./const/Const_navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { API } from "./api/Api";
import { withCookies } from "react-cookie";
import { GoogleLogout } from 'react-google-oauth'
import { GoogleAPI } from "react-google-oauth";

let url, passion_usertype;
export class Header extends Component {
  constructor(props) {
    super(props);
    url = this.props.match.path;
    this.state = {
      toggletheme: false,
      dropdown: false,
      showSearch: false,
      active: false,
      usertype: "",
    };
    passion_usertype = localStorage.getItem("passion_usertype");
    this.mainLogout = this.mainLogout.bind(this);
    this.onChange = this.onChange.bind(this);
    this.logoutAPI = new API();
    this.notification = React.createRef();
    switch (url) {
      case "/admin/colleges":
        this.searchValue = this.props.searchValue.bind(this);
        break;
      case "/admin/mentors":
        this.searchValue = this.props.searchValue.bind(this);
        break;
      case "/admin/experts":
        this.searchValue = this.props.searchValue.bind(this);
        break;
      case "/admin/students":
        this.searchValue = this.props.searchValue.bind(this);
        break;
      case "/admin/cms":
        this.searchValue = this.props.searchValue.bind(this);
        break;
      default:
        return undefined;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.theme.is_dark !== this.props.theme.is_dark) {
      this.setState({ active: this.props.theme.is_dark });
    }
  }
  mainLogout() {
    let googleOauth = this.props.cookies.get('OG')
    if (googleOauth) {
      this.logout()
    }
    if (url == "/chat") {
      this.props.closeChart()
      this.logoutAPI.logout().then((res) => {
        // console.log("header", res)
        if (res.status) {
          localStorage.clear();
          this.props.cookies.remove("passion_usertype");
          this.props.cookies.remove("passion_userid");
          this.props.cookies.remove("passion_token");
          delete axios.defaults.headers.common["Authorization"];
          this.props.logoutuser();
        }
      });
    } else {
      this.logoutAPI.logout().then((res) => {
        // console.log("header", res)
        if (res.status) {
          if (url == "/admin") {
            this.props.closeChart()
          }
          localStorage.clear();
          this.props.cookies.remove("passion_usertype");
          this.props.cookies.remove("passion_userid");
          this.props.cookies.remove("passion_token");
          delete axios.defaults.headers.common["Authorization"];
          this.props.cookies.remove()

          let passionusertype = this.props.cookies.get('passion_usertype')
          let passion_userid = this.props.cookies.get('passion_userid')
          let passion_token = this.props.cookies.get('passion_token')
          if (passionusertype && passion_userid && passion_token) {
            localStorage.clear();
            this.props.cookies.remove("passion_usertype");
            this.props.cookies.remove("passion_userid");
            this.props.cookies.remove("passion_token");
            this.props.logoutuser();
          } else {
            this.props.logoutuser();
          }
        }
      });
    }
  };
  logout(response) {
    console.log("google logout response", response);
  }
  changeTheme = () => {
    this.props.toggleTheme();
    this.setState({ active: !this.state.active });
  };
  onChange(e) {
    let val = e.target.value.length === 0 ? "" : e.target.value;
    this.searchValue(val.trim());
  }
  componentDidMount() {
    this.setState({ usertype: passion_usertype });
    if (this.props.theme) {
      // 
      this.setState({ active: this.props.theme.is_dark });
    }
    switch (url) {
      case "/admin/colleges":
        this.setState({ showSearch: true });
        break;
      case "/admin/mentors":
        this.setState({ showSearch: true });
        break;
      case "/admin/experts":
        this.setState({ showSearch: true });
        break;
      case "/admin/students":
        this.setState({ showSearch: true });
        break;
      case "/admin/cms":
        this.setState({ showSearch: true });
        break;
      default:
        return this.setState({ showSearch: false });
    }
  }
  render() {
    // console.log("passionlogo",this.props.user)
    return (
      <>
        <div className="header-logo my-auto d-flex flex-row col-5 col-sm-10 col-md-5 col-lg-7 my-auto">
          <img
            src="/image/passionlogo.png"
            alt=""
            className=" passion-logo  img-fluid d-none d-sm-none d-md-block "
          />
          <img
            src="/image/passion_logo.png"
            alt=""
            className=" passion-logo  img-fluid d-block d-sm-block d-md-none my-auto ms-3"
          />
        </div>
        <div className="header-logo pt-3 d-none d-sm-none d-md-block col-md-3 col-lg-2 col-3">
          {this.state.showSearch ? (
            this.state.usertype == 1 ? (
              <div class="input-group ">
                <input
                  type="text"
                  class="form-control type-search"
                  onChange={(e) => this.onChange(e)}
                />
                <div class="input-group-append">
                  <button class="btn search-color" type="button">
                    <i class="fa fa-search"></i>
                  </button>
                </div>
              </div>
            ) : null
          ) : null}
        </div>
        <div className="header-logo my-auto ms-auto d-flex flex-row  col-sm-1 col-md-3 col-lg-3 col-4">
          <h1 className="my-auto ms-auto d-none d-sm-none d-md-block me-4">
            {" "}
            {this.props.user.username}{" "}
          </h1>

          <div className=" w-sm-100 d-flex flex-row justify-content-end ">
            <Dropdown autoClose="outside">
              <Dropdown.Toggle variant="none" id="dropdown-basic">
                <div className=" profile-img-header d-flex my-auto  me-4">
                  <img
                    src={this.props.user.profile_image}
                    alt=""
                    className="profile-imgin"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image/errorprofileimg.webp";
                    }}
                  />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="logo-dropdown ">
                <Dropdown.Item
                  className="dropdown-row  my-auto "
                  onClick={() => this.props.showNotification()}
                >
                  <img
                    src="/image/notification.webp"
                    alt=""
                    className="col-1 me-2"
                  />
                  <span className="col-6">{Navbar_text.Notification}</span>
                  <div className="col-3"></div>
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-row  my-auto ">
                  <img src="/image/theme.webp" alt="" className="col-1 me-2" />
                  <span className="col-6">{Navbar_text.Darkmode}</span>
                  <div className="col-3 ">
                    <label
                      class="customised-switch"
                      onClick={() => this.changeTheme()}
                    >
                      <input type="checkbox" />
                      <span
                        className={
                          this.state.active
                            ? "customised-slider customised-slider-active customised-round"
                            : "customised-slider customised-slider-inactive customised-round"
                        }
                      ></span>
                    </label>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item
                  className="dropdown-row  my-auto "
                  onClick={this.mainLogout}
                >
                  <img src="/image/logout.webp" alt="" className="col-1 me-2" />
                  <span className="col-6"> {Navbar_text.Logout}</span>
                  <div className="col-3"></div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="d-none">
          <GoogleAPI
            clientId="120284660080-eb8a6nga53829ele6458g3vs3l7k6s4e.apps.googleusercontent.com"
          // onUpdateSigninStatus={this.update}
          // onInitFailure={this.failure}
          >
            <GoogleLogout
              buttonText="Logout"
              onLogoutSuccess={this.logout}
            >
            </GoogleLogout>
          </GoogleAPI>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    theme: state.theme,
    isLoggedIn: state.user.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleTheme: () => {
      dispatch({ type: "TOGGLE_THEME" });
    },
    logoutuser: () => {
      dispatch({ type: "LOGOUT" });
    },
    showNotification: () => {
      dispatch({ type: "ShowNotification" });
    },
  };
};
export default withCookies(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Header))
);

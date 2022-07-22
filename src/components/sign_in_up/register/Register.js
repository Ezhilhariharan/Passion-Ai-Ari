import React, { Component } from "react";
import "./styles/Register.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { withRouter } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import OtpComponent from "./OtpComponent.js";
import LoginLayout from "../left_layout/Leftcommon_loginLayout/Left_LoginLayout.js";
import { CountryService } from "./CountryService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  LoginSocialFacebook,
  LoginSocialGoogle,
  LoginSocialLinkedin,
} from "reactjs-social-login";
import SignupLayout from "../left_layout/signup_layout/Signup_layout.js";
import { Modal } from "react-bootstrap";
import { registerText } from "./Registerconst";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(30, "Too Long!")
    .required("Required"),
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
let datauserid;
let getcollegelist = [];
let getdepartmentlist = [];
let collegelistprime;
let collegelistprimetrim;
let departmentlistprime;
let country;
const { Dropdown } = window.primereact.dropdown;
const { InputTextarea } = window.primereact.inputtextarea;
const { AutoComplete } = window.primereact.autocomplete;
const { Tooltip } = window.primereact.tooltip;
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value1: "",
      value2: "",
      show: false,
      userid: "",
      emailcustom: "",
      modal: false,
      showHidePassword: false,
      showHideconfirmPassword: false,
      collegelist: getcollegelist,
      department: "",
      college: "",
      departments: "",
      collegeData: null, // this value go to DB
      departmentData: null, // this value go to DB
      selectedCountry2: "",
      selectedCountry2error: "error",
      selectedCountryname: "",
      filteredCountries: null,
      value3: "",
      countries: [],
      profilepicture: "PA",
      touchpic: false,
      profilepicupload: "",
      StartDate: "",
      modalhide: false,
      buttonfeild: "",
      buttonfeilderror: "error",
      collegelisterror: "error",
      departmenterror: "error",
      dateerror: "error",
      password: "",
      enddate: new Date(),
      layoutnum: null,
      emailerror: "",
      passwardvalidate: "",
      confirmpasswardvalidate: "",
      mobile_no: "",
      name: "",
    };
    // this.emailverify = this.emailverify.bind(this);
    this.cities = [
      { name: "New York", code: "NY" },
      { name: "Rome", code: "RM" },
      { name: "London", code: "LDN" },
      { name: "Istanbul", code: "IST" },
      { name: "Paris", code: "PRS" },
    ];
    // this.emailverify = this.emailverify.bind(this);
    this.collegename = getcollegelist;
    this.departmentname = getdepartmentlist;
    this.collegenamelist = this.collegenamelist.bind(this);
    this.ondepartmentchange = this.ondepartmentchange.bind(this);
    this.searchCountry = this.searchCountry.bind(this);
    this.itemTemplate = this.itemTemplate.bind(this);
    this.countryservice = new CountryService();
    this.inputOpenFileRef = React.createRef();
    this.showOpenFileDlg = this.showOpenFileDlg.bind(this);
    this.showpicture = React.createRef();
    this.getvalue = React.createRef();
    // this.Openpicture = this.Openpicture.bind(this);
    this.getfeilddata = this.getfeilddata.bind(this);
    this.changeLayout = this.changeLayout.bind(this);
    this.validatemobilenumber = this.validatemobilenumber.bind(this);
  }
  searchCountry(event) {
    // 
    setTimeout(() => {
      let filteredCountries;
      if (!event.query.trim().length) {
        filteredCountries = [...this.state.countries];
      } else {
        filteredCountries = this.state.countries.filter((country) => {
          // 
          return country.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }
      this.setState({ filteredCountries });
    }, 250);
  }
  validatemobilenumber(e) {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    const isValid = new RegExp("[0-9]").test(keyValue);
    if (!isValid) {
      e.preventDefault();
      return;
    }
  }
  itemTemplate(item) {
    return (
      <div className="country-item">
        <div>{item.name}</div>
      </div>
    );
  }
  componentDidMount() {
    // 
    collegelistprime = this.state.college;
    departmentlistprime = this.state.departments;
    country = this.state.selectedCountry2;
    this.countryservice
      .getCountries()
      .then((data) => this.setState({ countries: data }));
    axios
      .get("student/get_colleges/")
      .then((res) => {
        // 
        // getcollegelist = [];
        if (res.data.data[0]) {
          // getcollegelist = [];
          for (let i of res.data.data) {
            getcollegelist.push({ code: i.id, name: i.name });
          }
          // let getcollegelisttrimed = getcollegelist;
          // 
          this.setState({ collegelist: getcollegelist });
        }
      })
      .catch((err) => {
      });
    // 
    // 
  }
  collegenamelist(e) {
    this.setState({
      collegelisterror: e.target.value,
    });
    // 
    if (typeof e.value !== "string") {
      this.setState({ college: e.value.name, collegeData: e.value.code });
    }
    if (typeof e.value === "string") {
      getcollegelist.forEach((obj) => {
        if (obj.name.toLowerCase() === e.value.toLowerCase()) {
          this.setState({ college: obj.name, collegeData: obj.code });
        } else {
          this.setState({ college: e.value, collegeData: e.value });
        }
      });
    }
    axios
      .get("student/get_departments/", {
        params: {
          college_id: e.value.code,
        },
      })
      .then((res) => {
        if (res.data.data[0]) {
          getdepartmentlist = [];
          for (let i of res.data.data) {
            getdepartmentlist.push({ code: i.id, name: i.name });
          }
          this.setState({ department: getdepartmentlist });
        }
      })
      .catch((err) => {
      });
  }
  ondepartmentchange(e) {
    if (typeof e.value !== "string") {
      this.setState({
        departments: e.value.name,
        departmentData: e.value.code,
      });
    }
    if (typeof e.value === "string") {
      getdepartmentlist.forEach((obj) => {
        if (obj.name.toLowerCase() === e.value.toLowerCase()) {
          this.setState({
            departments: obj.name,
            departmentData: obj.code,
          });
        } else {
          this.setState({
            departments: e.value,
            departmentData: e.value,
          });
        }
      });
    }
    this.setState({ departments: e.value, departmentData: e.value });
  }
  fileChangedHandler = (event) => {
    const file = event.target.files[0];
    this.setState({ touchpic: true });
    this.setState({ profilepicupload: file });
    if (file.size < 2097152) {
      if (file) {
        let reader = new FileReader();
        reader.onload = function () {
          document.getElementById("profile_preview").src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    } else {
    }
  };
  showOpenFileDlg() {
    this.inputOpenFileRef.current.handleFocus();
  }
  // Openpicture() {
  //   this.showpicture.current.click()
  // }
  getfeilddata() {
    // 
  }
  changeLayout(prop) {
    // 
    this.setState({ layoutnum: prop });
  }
  componentDidUpdate() {
  }
  render() {
    // const { country } = this.state;
    return (
      <div className="app">
        <div className="app-left">
          <SignupLayout
            layoutnum={this.state.layoutnum}
            username={this.state.profilepicture}
          />
        </div>
        {/* <div className=""> */}
        <div className=" app-right ">
          <Formik
            initialValues={{
              name: "",
              password: "",
              ConfirmPassword: "",
            }}
            onSubmit={(values, onSubmitProps) => {
              let data = values;
              data["time_zone"] = new Date().toString();
              // data["email"] = this.state.emailcustom;
              let list = "";
              data["batch"] = this.state.StartDate.getFullYear().toString();
              data["email"] = this.state.emailcustom;
              data["department_id"] = this.state.departmentData;
              data["college_id"] = this.state.collegeData;
              data["mobile_no"] = this.state.mobile_no;
              data["country"] = this.state.selectedCountry2.name;
              this.state.touchpic
                ? (data["profile_image"] = this.state.profilepicupload.name)
                : (data[
                    "profile_image"
                  ] = `https://avatars.dicebear.com/api/initials/${this.state.profilepicture}.svg`);
              // axios.post("register/", data).then((res) => {
              //   
              //   datauserid = res.data.data.data.user_id;
              //   // 
              //   this.setState({ userid: datauserid });
              //   this.setState({ modal: true });
              // });
            }}
            onBlur={this.emailverify}
            validationSchema={signupSchema}
          >
            {({ errors, touched, props }) => (
              <Form className="" style={{ height: "100%" }}>
                <div
                  id="carouselExampleControls"
                  className="carousel slide carousel-width mx-auto"
                  data-bs-interval="false"
                >
                  <div className="carousel-inner">
                    <div className="carousel-item active carousel-form">
                      <div
                        className="back-icon ms-auto "
                        onClick={() => this.props.history.push("/login")}
                      >
                        <i className="fa-solid fa-chevron-left "></i>
                      </div>
                      <div className="carousel-body">
                        <h1
                          className="login-txt mt-2"
                          onClick={this.getfeilddata}
                        >
                          {registerText.Signup}
                        </h1>
                        <div className="form-group mt-4">
                          <label className="label" htmlFor="name">
                            {registerText.name}
                          </label>
                          <Field
                            id="name"
                            name="name"
                            type="text"
                            value={this.state.name}
                            className="input"
                            // ref={this.getvalue}
                            //   onChangeText={(val) => {
                            //     
                            //   }
                            // }
                            onChange={(e) =>
                              this.setState({
                                name: e.target.value,
                              })
                            }
                            // onBlur={
                            //   this.setState({
                            //     name:
                            //       document.getElementById("name").value,
                            //   })
                            // }
                          />
                          {/* {this.state.name === "" &&
                            <div style={{ color: "red" }}>Required</div>
                          } */}
                          {this.state.name.length === 0 ? (
                            <div
                              style={{
                                color: "green",
                              }}
                            >
                              {errors.name}
                            </div>
                          ) : null}
                          {/* <ErrorMessage name="name">
                          {(msg) => (
                            <div style={{ color: "red" }}>{msg}</div>
                          )}
                        </ErrorMessage> */}
                        </div>
                        <div className="form-group mt-2">
                          <label className="label" htmlFor="mobile">
                            {registerText.mobile}
                          </label>
                          <input
                            id="mobile"
                            name="mobile"
                            type="text"
                            className="input"
                            maxlength="10"
                            // oninput={this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')}
                            onKeyPress={(e) =>
                              this.validatemobilenumber(e, this.maxlength)
                            }
                            // pattern="[0-9]+"
                            onBlur={() => {
                              this.setState({
                                buttonfeild:
                                  document.getElementById("mobile").value,
                                buttonfeilderror:
                                  document.getElementById("mobile").value,
                              });
                            }}
                          />
                          {this.state.buttonfeilderror === "" && (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {registerText.Required}
                            </div>
                          )}
                        </div>
                        <div className="form-group mt-2">
                          <label className="label" htmlFor="mobile">
                            {registerText.country}
                          </label>
                          <AutoComplete
                            id="country"
                            value={this.state.selectedCountry2}
                            suggestions={this.state.filteredCountries}
                            completeMethod={this.searchCountry}
                            field="name"
                            // className="input"
                            className="auto-complete mb-3"
                            dropdown
                            forceSelection
                            itemTemplate={this.itemTemplate}
                            onChange={(e) =>
                              this.setState({
                                selectedCountry2: e.value,
                                selectedCountry2error: e.value,
                              })
                            }
                            onBlur={(e) => {
                              // this.setState({
                              //   selectedCountry2error:e.value
                              //     :e.value
                              // })
                              // this.state.countries.map((data) => {
                              //   
                              //   // 
                              //   if (this.state.selectedCountry2.name === data.name ) {
                              //     
                              //     this.setState({
                              //       selectedCountryname: ""
                              //     })
                              //   }
                              //   else{
                              //     this.setState({
                              //       selectedCountryname: "wrongcountry"
                              //     })
                              //   }
                              // })
                            }}
                          />
                          {/* {this.state.selectedCountry2error === "" &&
                          <div style={{ color: "red" }}>Required</div>
                        } */}
                          {this.state.selectedCountry2error === null && (
                            <div
                              style={{
                                color: "red",
                              }}
                            >
                              {registerText.Required}
                            </div>
                          )}
                          {/* {this.state.selectedCountryname === "wrongcountry" &&
                          <div style={{ color: "Green", fontWeight: "bold" }}>Select the listed Country</div>
                        }
                        {this.state.selectedCountryname === "" && null }                     */}
                        </div>
                        <div className="form-group mt-2">
                          <label className="label" htmlFor="mobile">
                            {registerText.ProfilePicture}
                          </label>
                          <div className=" hide-position d-flex flex-row">
                            <div className=" profile-img-reg d-flex mt-3">
                              <img
                                src={`https://avatars.dicebear.com/api/initials/${this.state.profilepicture}.svg`}
                                className="profile-imgin "
                                onClick={this.Openpicture}
                                id="profile_preview"
                                alt=""
                              />
                            </div>
                            <input
                              type="file"
                              className=" hide-inputfile mt-5"
                              onChange={this.fileChangedHandler}
                              ref={this.showpicture}
                              style={{
                                display: "none",
                              }}
                            ></input>
                            <img
                              src="image/folder-img.webp"
                              className="folder-img my-auto ms-3"
                              onClick={this.Openpicture}
                              id="profile_preview"
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="d-flex flex-row justify-content-center mt-2">
                          {/* {
                          this.state.selectedCountry2 === "" ||
                            this.state.buttonfeild === "" ||
                            this.state.profilepicture === ""
                            ?
                            <button
                              className="btn-next-opacity "
                              disabled={true}
                            >
                              Next
                            </button>
                            : */}
                          <button
                            href="#carouselExampleControls"
                            data-bs-slide="next"
                            className="btn-blue"
                            onClick={() => this.changeLayout(1)}
                          >
                            {registerText.Next}
                          </button>
                          {/* } */}
                        </div>
                        <div className="d-flex flex-row justify-content-center ">
                          <div>
                            <div className="box-border d-flex flex-row justify-content-center mt-4">
                              <span className="login-line mt-2 me-1"></span>
                              <p className="social-icon ">
                                {registerText.orsignupwith}
                              </p>
                              <span className="login-line mt-2 ms-1"></span>{" "}
                            </div>
                            <div className="d-flex flex-row justify-content-center">
                              <LoginSocialFacebook
                                appId={process.env.FB_APP_ID || ""}
                                onResolve={({ data }) => {
                                  alert(JSON.stringify(data));
                                }}
                                onReject={(err) => alert(err)}
                              >
                                <img
                                  className="img m-1 "
                                  src="image/Facebook.png"
                                  alt=""
                                />
                              </LoginSocialFacebook>
                              <LoginSocialGoogle
                                client_id={
                                  "414688866984-pkmica6f9sv2l6p6mgms3guaguk8enhe.apps.googleusercontent.com"
                                }
                                onResolve={({ data }) => {
                                }}
                                onReject={(err) => alert(err)}
                              >
                                <img
                                  className="img m-1"
                                  src="image/Google.png"
                                  alt=""
                                />
                              </LoginSocialGoogle>
                              <LoginSocialLinkedin
                                client_id={"Passionaiari@8421"}
                                // redirect_uri={REDIRECT_URI}
                                onResolve={({ provider, data }) => {
                                  alert(provider);
                                  alert(JSON.stringify(data));
                                }}
                                onReject={(err) => alert(err)}
                              >
                                <img
                                  className="img m-1 "
                                  src="image/LinkedIn.png"
                                  alt=""
                                />
                              </LoginSocialLinkedin>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-item carousel-form">
                      <div className="carousel-header">
                        <div
                          className="back-icon ms-auto "
                          href="#carouselExampleControls"
                          data-bs-slide="prev"
                          onClick={() => this.changeLayout(null)}
                        >
                          <i className="fa-solid fa-chevron-left "></i>
                        </div>
                      </div>
                      <div className="carousel-body">
                        <h1 className="login-txt mt-5">
                          {registerText.Department}
                        </h1>
                        <div className="form-group mt-5">
                          <label className="label" htmlFor="organization">
                            {registerText.College}
                          </label>
                          <div className="dropdownfield d-flex flex-row">
                            <Dropdown
                              id="collegelist"
                              value={this.state.college}
                              name="organization"
                              options={this.collegename}
                              onChange={this.collegenamelist}
                              optionLabel="name"
                              className="dropdown "
                              editable
                              onBlur={(e) => {
                                this.setState({
                                  collegelisterror: e.target.value,
                                });
                                //   
                                //   
                              }}
                            />
                            <div>
                              <Tooltip target=".custom-target-icon" />
                              <i
                                class="fa-light fa-circle-info info-icon mt-1 ms-4 pt-2 "
                                data-pe-tooltip="No notifications"
                                data-pe-position="top"
                              ></i>
                            </div>
                          </div>
                        </div>
                        {this.state.collegelisterror === "" && (
                          <div
                            style={{
                              color: "red",
                              padding: "10px 0px 0px 40px",
                            }}
                          >
                            {registerText.Required}
                          </div>
                        )}
                        <div className="form-group mt-2">
                          <label className="label" htmlFor="department">
                            {registerText.Department}
                          </label>
                          <div className="dropdownfield d-flex flex-row">
                            <Dropdown
                              value={this.state.departments}
                              options={this.state.department}
                              onChange={this.ondepartmentchange}
                              optionLabel="name"
                              name="domain"
                              // className="input"
                              className="dropdown "
                              editable
                              onBlur={(event) => {
                                // 
                                this.setState({
                                  departmenterror: event.target.value,
                                });
                              }}
                            />
                            <div>
                              <Tooltip target=".custom-target-icon" />
                              <i
                                class="fa-light fa-circle-info info-icon mt-2 pt-2 ms-4 "
                                data-pe-tooltip="No notifications No notifications No notifications No notifications"
                                data-pe-position="top"
                              ></i>
                            </div>
                          </div>
                          {this.state.departmenterror === "" && (
                            <div
                              style={{
                                color: "red",
                                padding: "10px 0px 0px 0px",
                              }}
                            >
                              {registerText.Required}
                            </div>
                          )}
                        </div>
                        <div className="form-group mt-2 ms-auto pe-2">
                          <label className="label" htmlFor="graduation">
                            {registerText.Graduation}
                          </label>
                          <DatePicker
                            name=""
                            type="number"
                            id="datefeild"
                            selected={this.state.StartDate}
                            onChange={(date) => {
                              this.setState({
                                StartDate: date,
                              });
                            }}
                            showYearPicker
                            dateFormat="yyyy"
                            className="input "
                            maxDate={this.state.enddate}
                            // endDate={this.state.enddate}
                            ref={this.inputOpenFileRef}
                            onBlur={() => {
                              // 
                              this.setState({
                                dateerror:
                                  document.getElementById("datefeild").value,
                              });
                            }}
                          />
                          <i
                            className="fa-light fa-calendar calendar-icon "
                            onClick={this.showOpenFileDlg}
                          ></i>
                          {this.state.dateerror === "" && (
                            <div
                              style={{
                                color: "red",
                                padding: "10px 0px 0px 0px",
                              }}
                            >
                              {registerText.Required}
                            </div>
                          )}
                        </div>
                        <div className="d-flex justify-content-center mt-5 pt-5">
                          {/* {
                          this.state.StartDate === "" ||
                            this.state.departments === "" ||
                            this.state.college === ""
                            ?
                            <button
                              className="btn-next-opacity  me-lg-5 "
                              disabled={true}
                            >
                              Next
                            </button>
                            : */}
                          <button
                            href="#carouselExampleControls"
                            data-bs-slide="next"
                            className="btn-blue   "
                            onClick={() => this.changeLayout(2)}
                          >
                            {registerText.Next}
                          </button>
                          {/* } */}
                        </div>
                      </div>
                    </div>
                    <div className="carousel-item carousel-form ">
                      {" "}
                      {/* <div
                        className="icon x-right-5 mt-5 mb-5"
                        href="#carouselExampleControls"
                        data-bs-slide="prev"
                      >
                        <i className="fa-solid fa-chevron-left "></i>
                        <span className="icon-back justify-content-center ">
                          Back
                        </span>
                      </div> */}
                      <div className="carousel-header">
                        <div
                          className="back-icon ms-auto "
                          href="#carouselExampleControls"
                          data-bs-slide="prev"
                          onClick={() => this.changeLayout(1)}
                        >
                          <i className="fa-solid fa-chevron-left "></i>
                        </div>
                      </div>
                      <div className="carousel-body">
                        <h1 className="login-txt mt-5">{registerText.email}</h1>
                        <div className="form-group mt-5">
                          <label className="label" htmlFor="number">
                            {registerText.email}
                          </label>
                          <input
                            id="emailerror"
                            name="email"
                            type="email"
                            className="input"
                            // value={this.state.emailcustom}
                            onChange={(e) =>
                              this.setState({
                                emailerror: e.target.value,
                                emailcustom: e.target.value,
                              })
                            }
                          />
                          <ErrorMessage name="email">
                            {(msg) => (
                              <div
                                style={{
                                  color: "red",
                                }}
                              >
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                        <div className="form-group mt-2">
                          <label className="label" htmlFor="number">
                            {registerText.password}
                          </label>
                          <div className="d-flex">
                            <Field
                              id="password"
                              name="password"
                              type={
                                this.state.showHidePassword
                                  ? "text"
                                  : "password"
                              }
                              className="input"
                              // onChange={(e) =>
                              //   this.setState({
                              //     passwardvalidate: e.target.value,
                              //   })
                              // }
                            />
                            <i
                              class={
                                this.state.showHidePassword
                                  ? "fa-solid fa-eye eye-icon"
                                  : "fa-solid fa-eye-slash eye-icon"
                              }
                              onClick={() =>
                                this.setState({
                                  showHidePassword:
                                    !this.state.showHidePassword,
                                })
                              }
                            ></i>
                          </div>
                          <ErrorMessage name="password">
                            {(msg) => (
                              <div
                                style={{
                                  color: "red",
                                }}
                              >
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                        <div className="form-group mt-2">
                          <label className="label" htmlFor="number">
                            {registerText.ConfirmPassword}
                          </label>
                          <div className="d-flex">
                            <Field
                              id="ConfirmPassword"
                              name="ConfirmPassword"
                              type={
                                this.state.showHideconfirmPassword
                                  ? "text"
                                  : "password"
                              }
                              className="input"
                              // onChange={(e) =>
                              //   this.setState({
                              //     confirmpasswardvalidate: e.target.value,
                              //   })
                              // }
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
                            {(msg) => (
                              <div
                                style={{
                                  color: "red",
                                }}
                              >
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                        <div className="d-flex justify-content-center mt-5 ">
                          {this.state.emailerror === "" &&
                          this.state.passwardvalidate === "" &&
                          this.state.confirmpasswardvalidate === "" ? (
                            <button
                              className="btn-next-opacity  me-lg-5 mt-5"
                              disabled={true}
                            >
                              {registerText.SendOTP}
                            </button>
                          ) : (
                            <div className=" mt-5 ">
                              {" "}
                              <button type="submit" className="btn-blue">
                                {registerText.SendOTP}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          {/* <div class="modal fade register_otp" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h3 class="modal-title ms-auto" id="exampleModalLabel">Email Verification</h3>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div className="register-modal">
                    <div className="d-flex flex-row justify-content-center mt-3">
                      <p>We’ve sent a verification OTP code to your <b>Email id</b></p>
                    </div>
                    <center className="mt-3 mb-3"><h4>Email : {this.state.emailcustom}</h4></center>
                    <OtpComponent userid={this.state.userid} email={this.state.emailcustom} />
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        {/* </div> */}
      </div>
      // </div >
    );
  }
}
export default withRouter(Register);

import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Header from "../../../../../navbar/header/Header";
import { API } from "./utils/API";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { connect } from "react-redux";
import { mentorText } from "../../Const_Mentor";
import { CommonAPI } from "../../../../utils/CommonAPI";
let getIndustryList = [{ value: "", label: "Select an industry" }];
let url,
  logo = "";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const addMentorSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  company: Yup.string().required("Required"),
  position: Yup.string().required("Required"),
  industry_id: Yup.string().required("Required"),
  email: Yup.string().email("Enter a valid email").required("Required"),
  mobile_no: Yup.string()
    .min(10, "Too Short!")
    .max(10, "Phone number is too Long!")
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
});
class AddMentor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industryList: getIndustryList,
      mentor_name: "random-seed",
      loading: false,
      show: false,
      message: "",
    };
    url = this.props.match.path;
    url = url.replace("/" + url.split("/").pop(), "");
    this.mentorAPI = new API();
    this.showLoading = this.showLoading.bind(this);
    this.commonAPI = new CommonAPI();
    this.changeImage = this.changeImage.bind(this);
  }
  componentDidMount() {
    this.initialRender();
  }
  initialRender = () => {
    this.commonAPI.getIndustry().then(
      (res) => this.setState({ industryList: res }),    
    );
  };
  changeImage() {
    let file = document.getElementById("logo").files[0];
    logo = document.getElementById("logo").files[0];
    if (file.size < 2097152) {
      if (file) {
        let reader = new FileReader();
        reader.onload = function () {
          document.getElementById("profile_preview").src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    } 
  }
  alertToaste = () => {
    this.props.showtoast({
      text: " Mentor Successfully Created",
      time: new Date().getTime(),
    });
  };
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  closeErrorModal = () => {
    this.setState({ message: "", show: false });
  };
  render() {
    return (
      <div>
        <div className="studenthomepage-header d-flex flex-row">
          <Header />
        </div>
        <div className="d-flex flex-row align-items-center mt-4 pt-5">
          <div
            className="btn-circle-blue"
            onClick={() => this.props.history.goBack()}
          >
            <i className="fa fa-angle-left"></i>
          </div>
          <div className="main-heading ms-3">{mentorText.creatementor}</div>
        </div>
        <div className="form-wrapper-3 mt-4">
          <Formik
            initialValues={{
              name: "",
              email: "",
              mobile_no: "",
              industry_id: "",
              company: "",
              position: "",
            }}
            onSubmit={(values, onSubmitProps) => {
              this.showLoading();              
              if (logo === "") {
                logo = document.getElementById("profile_preview").src;
              }
              this.mentorAPI.postMentor(values, logo).then((res) => {
                if (res.status) {
                  this.showLoading();
                  this.alertToaste();
                  this.props.history.push("/admin/mentors");
                } else {
                  this.showLoading();
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
            validationSchema={addMentorSchema}
          >
            <Form className="customFormAdmin">
              <div className="row align-items-center">
                <div className="col-sm-12 col-md-6 col-lg-8">
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="label" htmlFor="domain">
                          {mentorText.industry}
                        </label>
                        <Field
                          name="industry_id"
                          id="industry_id"
                          render={({ field }) => (
                            <select {...field} className="form-select">
                              {this.state.industryList.map((option) => (
                                <option value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        <ErrorMessage name="industry_id">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="label" htmlFor="name">
                          {mentorText.name}
                        </label>
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          maxlength="25"
                          className="input"
                          onBlur={(e) =>
                            e.target.value != ""
                              ? this.setState({ mentor_name: e.target.value })
                              : false
                          }
                        />
                        <ErrorMessage name="name">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>
                    <div className="row ps-5 pe-4">
                      <div className="col-sm-12 col-md-12 col-lg-6 mb-3 ">
                        <div className="form-group ps-2 ">
                          <label className="label " htmlFor="email">
                            {mentorText.email}
                          </label>
                          <Field
                            id="email"
                            name="email"
                            type="text"
                            className="input "
                          />
                          <ErrorMessage name="email" className="ms-4">
                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mb-3  ">
                        <div className="form-group ">
                          <label className="label" htmlFor="mobile">
                            {mentorText.mobile}
                          </label>
                          <Field
                            id="mobile_no"
                            name="mobile_no"
                            type="text"
                            maxlength="10"
                            className="input pe-2"
                          />
                          <ErrorMessage name="mobile_no">
                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>
                    </div>
                    <div className="row  ps-5 pe-4">
                      <div className="col-sm-12 col-md-12 col-lg-6 mb-3 ">
                        <div className="form-group ps-2 ">
                          <label className="label " htmlFor="domain">
                            {mentorText.company}
                          </label>
                          <Field
                            name="company"
                            id="company"
                            type="text"
                            className="input "
                            maxlength="30"
                          />
                          <ErrorMessage name="company">
                            {(msg) => (
                              <div className="" style={{ color: "red" }}>
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mb-3 ">
                        <div className="form-group ">
                          <label className="label" htmlFor="domain">
                            {mentorText.position}
                          </label>
                          <Field
                            name="position"
                            id="position"
                            type="text"
                            className="input"
                            maxlength="30"
                          />
                          <ErrorMessage name="position">
                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-4">
                  <div className="form-group d-flex flex-column justify-content-end align-items-center mt-2">
                    <label
                      className="profile-circle mb-3 cursor-pointer"
                      htmlFor="logo"
                    >
                      <img
                        src={`https://avatars.dicebear.com/api/initials/${this.state.mentor_name}.svg`}
                        id="profile_preview"
                        alt=""
                      />
                    </label>
                    <label className="label">{mentorText.uploadprofile}</label>
                    <Field
                      id="logo"
                      name="logo"
                      type="file"
                      className="d-none"
                      accept=".png, .jpg, .jpeg"
                      onChange={this.changeImage}
                    />
                    <ErrorMessage name="profile_img">
                      {(msg) => <div>{msg}</div>}
                    </ErrorMessage>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row justify-content-center mt-4">
                <button type="submit" className="btn-yellow w-25">
                  {mentorText.creatementor}
                </button>
              </div>
            </Form>
          </Formik>
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
    toast: state.toast,
  };
};
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddMentor));

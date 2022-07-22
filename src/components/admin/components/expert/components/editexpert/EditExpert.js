import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Header from "../../../../../navbar/header/Header";
import { API } from "./utils/API";
import { CommonAPI } from "../../../../utils/CommonAPI";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { connect } from "react-redux";
import ClockLoader from "react-spinners/ClockLoader";
import { css } from "@emotion/react";
import { Tooltip } from "primereact/tooltip";
import { expertText } from "../../Const_Expert.js";
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
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
let url,
  logo = "",
  MentorID;
class EditExpert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industryList: [],
      mentor_name: "random-seed",
      loading: false,
      showError: false,
      errorMessage: "",
      collegeData: "",
    };
    url = this.props.match.path;
    MentorID = this.props.match.params.MentorID;
    url = url.replace("/" + url.split("/").splice(-2).join("/"), "");
    this.ExpertAPI = new API();
    this.commonAPI = new CommonAPI();
    this.showLoading = this.showLoading.bind(this);
    this.changeImage = this.changeImage.bind(this);
  }
  componentDidMount() {
    this.initialRender();
  }
  initialRender = () => {
    this.commonAPI.getIndustry().then(
      (res) => this.setState({ industryList: res }),     
    );
    this.ExpertAPI.getOneExpert(MentorID).then(
      (res) => {        
        this.setState({ collegeData: res.data[0] });
        this.setState({ college_name: res.name });
      },    
    );
  };
  alertToaste = () => {
    this.props.showtoast({
      text: "Expert Successfully Edited",
      time: new Date().getTime(),
    });
  };
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
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
    } else {      
    }
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
          <NavLink className="btn-circle-blue" to={`${url}`}>
            <i className="fa fa-angle-left"></i>
          </NavLink>
          <div className="main-heading ms-3">{expertText.EditExpert}</div>
        </div>
        <div className="loading-icon-admin">
          <ClockLoader
            color="#979797"
            loading={this.state.loading}
            css={override}
            size={130}
          />
        </div>
        <div className="form-wrapper-3 mt-4">
          <Formik
            initialValues={{
              name: this.state.collegeData.name,
              email: this.state.collegeData.email,
              mobile_no: this.state.collegeData.mobile_no,
              industry_id: this.state.collegeData.industry_id,
              company: this.state.collegeData.company,
              position: this.state.collegeData.position,
            }}
            enableReinitialize={true}
            onSubmit={(values, onSubmitProps) => {              
              this.showLoading();
              if (logo === "") {
                logo = this.state.collegeData.profile_image;
              }
              let formData = new FormData();
              formData.append("industry_id", values.industry_id);
              formData.append("name", values.name);
              if (values.email == this.state.collegeData.email) {
                formData.append("email", "");
              } else {
                formData.append("email", values.email);
              }
              formData.append("company", values.company);
              formData.append("position", values.position);
              formData.append("mobile_no", values.mobile_no);
              formData.append("profile_image", logo);
              this.ExpertAPI.editMentor(formData, logo, MentorID).then(
                (res) => {                  
                  if (res.status) {
                    this.showLoading();
                    this.alertToaste();
                    this.props.history.push("/admin/experts");
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
                }
              );
            }}
            validationSchema={addMentorSchema}
          >
            <Form className="customFormAdmin">
              <div className="row align-items-center">
                <div className="col-sm-12 col-md-6 col-lg-7">
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="label" htmlFor="domain">
                          {expertText.industry}
                        </label>
                        <div className="d-flex flex-row">
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
                          <div>
                            <Tooltip target=".custom-target-icon" />
                            <i
                              className="custom-target-icon pi pi-exclamation-circle info-icon ms-3 mt-3"
                              data-pr-tooltip="Ipsum passages, and more recently with desktop publishing software like Aldus 
                                    PageMaker including versions of Lorem Ipsum"
                              data-pr-position="top"
                              style={{
                                fontSize: "1.5rem",
                                cursor: "pointer",
                              }}
                            ></i>
                          </div>
                        </div>
                        <ErrorMessage name="industry_id">
                          {(msg) => (
                            <div
                              className=""
                              style={{
                                color: "red",
                              }}
                            >
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="label" htmlFor="name">
                          {expertText.name}
                        </label>
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          className="input"
                          maxlength="25"
                          onBlur={(e) =>
                            e.target.value != ""
                              ? this.setState({
                                  mentor_name: e.target.value,
                                })
                              : false
                          }
                        />
                        <ErrorMessage name="name">
                          {(msg) => (
                            <div
                              className=""
                              style={{
                                color: "red",
                              }}
                            >
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                    <div className="row  ps-5 pe-4">
                      <div className="col-sm-12 col-md-12 col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="label" htmlFor="email">
                            {expertText.email}
                          </label>
                          <Field
                            id="email"
                            name="email"
                            type="text"
                            className="input"
                          />
                          <ErrorMessage name="email">
                            {(msg) => (
                              <div
                                className=""
                                style={{
                                  color: "red",
                                }}
                              >
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="label" htmlFor="mobile">
                            {expertText.mobile}
                          </label>
                          <Field
                            id="mobile_no"
                            name="mobile_no"
                            type="text"
                            className="input"
                          />
                          <ErrorMessage name="mobile_no">
                            {(msg) => (
                              <div
                                className=""
                                style={{
                                  color: "red",
                                }}
                              >
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                    </div>
                    <div className="row  ps-5 pe-4">
                      <div className="col-sm-12 col-md-12 col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="label" htmlFor="company">
                            {expertText.company}
                          </label>
                          <Field
                            id="company"
                            name="company"
                            type="text"
                            className="input"
                            maxlength="30"
                          />
                          <ErrorMessage name="company">
                            {(msg) => (
                              <div
                                className=""
                                style={{
                                  color: "red",
                                }}
                              >
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="label" htmlFor="position">
                            {expertText.position}
                          </label>
                          <Field
                            id="position"
                            name="position"
                            type="text"
                            className="input"
                            maxlength="30"
                          />
                          <ErrorMessage name="position">
                            {(msg) => (
                              <div
                                className=""
                                style={{
                                  color: "red",
                                }}
                              >
                                {msg}
                              </div>
                            )}
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
                        src={this.state.collegeData.profile_image}
                        id="profile_preview"
                        alt=""
                      />
                      {/* <img src={`https://avatars.dicebear.com/api/initials/${this.state.mentor_name}.svg`} id="profile_preview" alt="" /> */}
                    </label>
                    <label className="label">{expertText.uploadprofile}</label>
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
                  {expertText.CreateExpert}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
        {/* <Modal
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    show={this.state.show}
                    onHide={() => this.setState({ show: false })}
                >
                    <Modal.Header >
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
                            ok
                        </button>
                    </Modal.Footer>
                </Modal> */}
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
)(withRouter(EditExpert));
// export default withRouter(EditMentor);

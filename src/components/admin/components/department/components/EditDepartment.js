import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { postAPI } from "../api/Post";
import { API } from "../../dashboard/components/collegeDashBoard/api/Get";
import Header from "../../../../../components/navbar/header/Header";
import "../../college/components/addCollege/styles/AddCollege.scss";
import { connect } from "react-redux";
import { collegeText } from "../../college/Const_College";
import ErrorModal from "../../../../common_Components/popup/ErrorModalpoup";
import { encode as base64_encode } from "base-64";
import { withCookies } from "react-cookie";
import axios from "axios";
let url,
  logo = "",
  ID;
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const addCollegeSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  email: Yup.string().email("Enter a valid email").required("Required"),
  mobile_no: Yup.string()
    .min(10, "Too Short!")
    .max(10, "Phone number is too Long!")
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
});
export class EditDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeList: [],
      college_name: "",
      subscriptiontype: [],
      loading: false,
      show: false,
      message: "",
      documentname: "",
      updatelogo: "",
      collegeadmindetails: "",
    };
    ID = this.props.match.params.id;
    url = this.props.match.path;
    url = url.replace("/" + url.split("/").pop(), "");
    this.API = new postAPI();
    this.detailsAPI = new API();
    this.showSuccess = this.showSuccess.bind(this);
    this.showLoading = this.showLoading.bind(this);
    this.changeImage = this.changeImage.bind(this);
  }
  showSuccess() {
    this.props.showtoast({
      text: "Successfully Updated",
      time: new Date().getTime(),
    });
  }
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  changeImage() {
    let file = document.getElementById("logo").files[0];
    logo = document.getElementById("logo").files[0];
    if (file) {
      if (file.size < 2097152) {
        let reader = new FileReader();
        reader.onload = function () {
          document.getElementById("profile_preview").src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.setState({
          message: "Size is too big",
          show: true,
        });
      }
    }
  }
  componentDidMount() {
    this.detailsAPI.getDashboard().then((res) => {
      if (res.status) {       
        let data = res.data;        
        if (data.length) {
          this.setState({ collegeadmindetails: data[0] });
        } else {
          this.setState({ collegeadmindetails: {} });
        }
      } else {
        this.setState({ collegeadmindetails: {} });
      }
    });
  }
  closeErrorModal = () => {
    this.setState({ message: "", show: false });
  };
  logout = () => {
    this.API
      .logout()
      .then((res) => {
        if (res.status) {               
          localStorage.clear();
          this.props.cookies.remove("passion_usertype");
          this.props.cookies.remove("passion_userid");
          this.props.cookies.remove("passion_token");
          delete axios.defaults.headers.common["Authorization"];
          this.props.Logout();
        }
      })
  };
  render() {    
    return (
      <div>
        <div className="studenthomepage-header d-flex flex-row">
          <Header />
        </div>
        <div className="d-flex flex-row align-items-center mt-4 pt-4">
          <div
            className="btn-circle-blue"
            onClick={() => this.props.history.goBack()}
          >
            <i className="fa fa-angle-left"></i>
          </div>
          <div className="main-heading ms-4">Edit College</div>
        </div>
        <div className="form-wrapper-3 mt-4">
          <Formik
            initialValues={{
              name: this.state.collegeadmindetails.name,
              address: this.state.collegeadmindetails.address,
              mobile_no: this.state.collegeadmindetails.mobile_no,
              email: this.state.collegeadmindetails.email,
              password: "",
              logo: "",
            }}
            validationSchema={addCollegeSchema}
            enableReinitialize={true}
            onSubmit={(values, onSubmitProps) => {
              this.showLoading();           
              let formData = new FormData();
              if (
                !values.password &&
                !values.name &&
                !values.email &&
                !values.address &&
                !values.mobile_no &&
                !values.logo
              ) {
                this.setState({ show: true, message: "Feild Required" });
              } else {
                if (values.password) {
                  let encoded = base64_encode(values.password);
                  formData.append("password", encoded);             
                }
                if (values.name) {
                  formData.append("name", values.name);
                }
                if (values.email) {
                  formData.append("email", values.email);
                }
                if (values.address) {
                  formData.append("address", values.address);
                }
                if (values.mobile_no) {
                  formData.append("mobile_no", values.mobile_no);
                }
                if (logo === "") {
                  logo = this.state.collegeadmindetails.logo;
                }
                formData.append("logo", logo);
              }
              this.API.editDepartment(ID, formData).then((res) => {
                this.showLoading();
                onSubmitProps.resetForm();
                console.log(res)
                if (res.status) {
                  this.showSuccess();
                  this.logout();
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
          >
            <Form className="customFormAdmin" id="addcollege">
              <div className="row">
                {" "}
                {/* Row that splits fields and logo input */}
                <div className="col-sm-12 col-md-6 col-lg-8 pe-5 ">
                  <div className="row w-100">
                    {" "}
                    {/* Row that has each of the inputs  */}
                    <div className=" mb-3 col-sm-12 col-md-12 col-lg-12 ">
                      <div className="form-group w-100 ps-4">
                        <label className="label" htmlFor="name">
                          {" "}
                          {collegeText.collegename}
                        </label>
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          className="input"
                          maxlength="25"
                          onBlur={(e) =>
                            e.target.value != ""
                              ? this.setState({ college_name: e.target.value })
                              : false
                          }
                        />
                        <ErrorMessage name="name">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group w-100 ps-4">
                        <label className="label" htmlFor="address">
                          {collegeText.address}
                        </label>
                        <Field
                          id="address"
                          name="address"
                          type="text"
                          className="input"
                        />
                        <ErrorMessage name="address">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12 mb-3 ps-2">
                      <div className="form-group w-100 ps-4">
                        <label className="label" htmlFor="mobile_no">
                          {collegeText.phonenumber}
                        </label>
                        <Field
                          id="mobile_no"
                          name="mobile_no"
                          type="text"
                          className="input"
                          maxlength="10"
                        />
                        <ErrorMessage name="mobile_no">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group w-100 ps-4">
                        <label className="label" htmlFor="email">
                          {collegeText.email}
                        </label>
                        <Field
                          id="email"
                          name="email"
                          type="text"
                          className="input"
                        />
                        <ErrorMessage name="email">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group w-100 ps-4">
                        <label className="label" htmlFor="password">
                          Password{" "}
                        </label>
                        <div className="password-input mb-3 ">
                          <Field
                            id="password"
                            name="password"
                            type={
                              this.state.showHidePassword ? "text" : "password"
                            }
                            className="input mb-3 "
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
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-4">
                  <div className="form-group d-flex flex-column justify-content-end align-items-center mt-5">
                    <label
                      className="profile-circle mb-3 cursor-pointer"
                      htmlFor="logo"
                    >
                      <img
                        src={
                          this.state.collegeadmindetails.logo
                            ? this.state.collegeadmindetails.logo
                            : "/image/errorlogoadmin.png"
                        }
                        id="profile_preview"
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/image/errorlogoadmin.png";
                        }}
                      />
                    </label>
                    <label className="label">{collegeText.uploadlogo}</label>
                    <Field
                      id="logo"
                      name="logo"
                      type="file"
                      className="d-none"
                      accept=".png, .jpg, .jpeg"
                      onChange={this.changeImage}
                    />
                    <ErrorMessage name="logo">
                      {(msg) => <div>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="d-flex flex-row justify-content-center mt-4 pt-5">
                    <button type="submit" className="btn-yellow w-75 ">
                      {collegeText.update}
                    </button>
                  </div>
                </div>
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
                            {collegeText.Ok}
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
    isLoggedIn: state.user.isLoggedIn,
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
    Logout: () => {
      dispatch({ type: "LOGOUT" });
    },
  };
};
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withRouter(EditDepartment));
export default withCookies(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(EditDepartment))
);

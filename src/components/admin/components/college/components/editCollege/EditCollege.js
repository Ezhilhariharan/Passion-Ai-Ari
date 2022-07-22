import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CollegeAPI } from "./utils/CollegeAPI";
import Header from "../../../../../navbar/header/Header";
import "./styles/EditCollege.scss";
import ClockLoader from "react-spinners/ClockLoader";
import { css } from "@emotion/react";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { connect } from "react-redux";
import { collegeText } from "../../Const_College";
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
let url,
  collegeID,
  logo = "";
let documentorpdf;
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const number = /^[1-9]{1,5}$/;
const addCollegeSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  email: Yup.string().email("Enter a valid email").required("Required"),
  student_limit: Yup.string()
    .min(1, "Invalid")
    .max(5, "Limit is too Long!")
    .required("Required"),
  subscription_type: Yup.string().required("Required"),
  mobile_no: Yup.string()
    .min(10, "Too Short!")
    .max(10, "Phone number is too Long!")
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
});
class EditCollege extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeData: [],
      college_name: "random-seed",
      subscriptiontype: [],
      loading: false,
      showError: false,
      errorMessage: "",
      documentname: "",
    };
    url = this.props.match.path;
    collegeID = this.props.match.params.collegeID;
    url = url.replace("/" + url.split("/").splice(-2).join("/"), "");
    this.CollegeAPI = new CollegeAPI();
    this.showLoading = this.showLoading.bind(this);
  }
  componentDidMount() {
    this.initialRender();
  }
  initialRender = () => {
    let getSubscriptionType = [{ id: "", subscription_type: "Select" }];
    this.CollegeAPI.getCollege(collegeID).then(
      (res) => {
        this.setState({ collegeData: res.data[0] });
        this.setState({ college_name: res.name });
      },
      (err) => {
      }
    );
    this.CollegeAPI.subscription()
      .then((res) => {
        if (res.status) {
          for (let i of res.data) {
            getSubscriptionType.push({
              id: i.id,
              subscription_type: i.subscription_type,
            });
          }
          this.setState({ subscriptiontype: getSubscriptionType });
        }
      })
      .catch((err) => {
      });
  };
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  selectFile = () => {
    documentorpdf = document.getElementById("contract_doc").files[0];
    if (documentorpdf.size < 5242880) {
      if (documentorpdf != null) {
        this.documentToast();
        this.setState({ documentname: documentorpdf.name });
      }
    }else{
      this.setState({ errorMessage: "Size limit Exceeded", showError: true});
    }
  };
  documentToast = () => {
    this.props.showtoast({
      text: "Document Uploaded Successfully ",
      time: new Date().getTime(),
    });
  };
  alertToaste = () => {
    this.props.showtoast({
      text: "College Successfully Edited",
      time: new Date().getTime(),
    });
  };
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
      }
    }
  }
  onChange(e) {
    let collegeData = this.state.collegeData;
    collegeData[e.target.name] = e.target.value;
    this.setState({ collegeData: collegeData });
  }
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  render() {
    return (
      <div>
        <div className="studenthomepage-header d-flex flex-row">
          <Header />
        </div>
        <div className="d-flex flex-row align-items-center mt-4 pt-4">
          <div className="loading-icon-admin">
            <ClockLoader
              color="#979797"
              loading={this.state.loading}
              css={override}
              size={130}
            />
          </div>
          <NavLink className="btn-circle-blue" to={`${url}`}>
            <i className="fa fa-angle-left"></i>
          </NavLink>
          <div className="main-heading ms-3">Edit College</div>
        </div>
        <div className="form-wrapper-3 mt-4">
          <Formik
            initialValues={{
              name: this.state.collegeData.name,
              address: this.state.collegeData.address,
              mobile_no: this.state.collegeData.mobile_no,
              email: this.state.collegeData.email,
              student_limit: this.state.collegeData.student_limit,
              subscription_type: this.state.collegeData.subscription_type_id,
              contract_doc: "",
              logo: "",
            }}
            validationSchema={addCollegeSchema}
            enableReinitialize={true}
            onSubmit={(values, onSubmitProps) => {
              this.showLoading();
              if (logo === "") {
                logo = `https://avatars.dicebear.com/api/initials/${values.name}.svg`;
              }
              this.CollegeAPI.patchCollege(
                this.state.collegeData.id,
                values,
                logo,
                documentorpdf
              ).then((res) => {
                if (res.status) {
                  this.showLoading();
                  this.alertToaste();
                  this.props.history.push("/admin/colleges");
                } else {
                  this.showLoading();
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
            }}
          >
            {({ values }) => (
              <Form className="customFormAdmin">
                <div className="row">
                  {" "}
                  {/* Row that splits fields and logo input */}
                  <div className="col-sm-12 col-md-6 col-lg-8 pe-5">
                    <div className="row w-100">
                      {" "}
                      {/* Row that has each of the inputs  */}
                      <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                        <div className="form-group w-100 ps-4">
                          <label className="label" htmlFor="name">
                            {collegeText.collegename}
                          </label>
                          <Field
                            id="name"
                            name="name"
                            type="text"
                            className="input"
                            maxlength="50"
                            onBlur={(e) =>
                              e.target.value != ""
                                ? this.setState({
                                  college_name: e.target.value,
                                })
                                : false
                            }
                          />
                          <ErrorMessage name="name">
                            {(msg) => (
                              <div style={{ color: "red" }}>
                                {collegeText.required}
                              </div>
                            )}
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
                            {(msg) => (
                              <div style={{ color: "red" }}>
                                {collegeText.required}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mb-3 ">
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
                            {(msg) => (
                              <div style={{ color: "red" }}>
                                {collegeText.required}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mb-3 pe-4">
                        <div className="form-group w-100 ps-3">
                          <label className="label" htmlFor="email">
                            {collegeText.email}
                          </label>
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            className="input"
                          />
                          <ErrorMessage name="email">
                            {(msg) => (
                              <div style={{ color: "red" }}>
                                {collegeText.required}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mb-3">
                        <div className="form-group w-100 ps-4">
                          <label className="label" htmlFor="student_limit">
                            {collegeText.studentlimit}
                          </label>
                          <Field
                            id="student_limit"
                            name="student_limit"
                            type="number"
                            className="input"
                          />
                          <ErrorMessage name="student_limit">
                            {(msg) => (
                              <div style={{ color: "red" }}>
                                {collegeText.required}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-6 mb-3">
                        <div className="form-group w-100 ps-4">
                          <label className="label" htmlFor="subscription_type">
                            {collegeText.subscription}
                          </label>
                          <Field
                            name="subscription_type"
                            id="subscription_type"
                            render={({ field }) => (
                              <select {...field} className="form-select">
                                {this.state.subscriptiontype.map((option) => {
                                  return (
                                    <option value={option.id}>
                                      {option.subscription_type}
                                    </option>
                                  );
                                })}
                              </select>
                            )}
                          />
                          <ErrorMessage name="subscription_type">
                            {(msg) => (
                              <div style={{ color: "red" }}>
                                {collegeText.required}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                        <div className="form-group d-flex flex-row align-items-center w-100 ps-4">
                          <label className="label">
                            {collegeText.contractdoc}
                          </label>
                          <label
                            className="btn-yellow mx-4"
                            htmlFor="contract_doc"
                          >
                            {collegeText.upload}
                          </label>
                          <span className="text-muted info-text document_name">
                            {this.state.documentname !== ""
                              ? this.state.documentname
                              : this.state.collegeData.contract_document}
                          </span>
                          <Field
                            id="contract_doc"
                            name="contract_doc"
                            type="file"
                            className="d-none"
                            accept=".pdf,.doc"
                            onChange={this.selectFile}
                          />
                          <ErrorMessage name="contract_doc">
                            {(msg) => <div>{msg}</div>}
                          </ErrorMessage>
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
                            this.state.collegeData.logo
                              ? this.state.collegeData.logo
                              : `https://avatars.dicebear.com/api/initials/${values.name}.svg`
                          }
                          id="profile_preview"
                          alt=""
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
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end me-5">
                  <button type="submit" className="btn-yellow w-25">
                    {collegeText.updatecollege}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <ErrorModal
          message={this.state.errorMessage}
          value={this.state.showError}
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
)(withRouter(EditCollege));
// export default withRouter(EditCollege)

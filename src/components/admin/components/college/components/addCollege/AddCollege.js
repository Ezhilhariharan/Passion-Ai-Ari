import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CollegeAPI } from "./utils/CollegeAPI";
import Header from "../../../../../navbar/header/Header";
import "./styles/AddCollege.scss";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { Toast } from "primereact/toast";
import { connect } from "react-redux";
import { collegeText } from "../../Const_College";
let getCollegeList = [];
let url,
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
class AddCollege extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeList: getCollegeList,
      college_name: "",
      subscriptiontype: [],
      loading: false,
      showError: false,
      errorMessage: "",
      documentname: "",
      updatelogo: "",
    };
    url = this.props.match.path;
    url = url.replace("/" + url.split("/").pop(), "");
    this.CollegeAPI = new CollegeAPI();
    this.showSuccess = this.showSuccess.bind(this);
    this.showLoading = this.showLoading.bind(this);
    this.changeImage = this.changeImage.bind(this);
  }
  changeImage() {
    // 
    let file = document.getElementById("logo").files[0];
    logo = document.getElementById("logo").files[0];
    if (file) {
      if (file.size < 2097152) {
        let reader = new FileReader();
        reader.onload = function () {
          document.getElementById("profile_preview").src = reader.result;
        };
        reader.readAsDataURL(file);
        this.setState({
          updatelogo: document.getElementById("profile_preview").src,
        });
      } else {
      }
    }
  }
  selectFile = () => {
    documentorpdf = document.getElementById("contract_doc").files[0];
    console.log("documentor",documentorpdf)
    if (documentorpdf.size < 5242880) {
      if (documentorpdf != null) {
        this.documentToast();
        this.setState({ documentname: documentorpdf.name });
      }
    } else {
      this.setState({ errorMessage: "Size limit Exceeded", showError: true,documentname:"" });
    }
  };
  documentToast = () => {
    this.props.showtoast({
      text: "Document Uploaded Successfully ",
      time: new Date().getTime(),
    });
  };
  componentDidMount() {
    this.initialRender();
  }
  initialRender = () => {
    let getSubscriptionType = [{ id: "", subscription_type: "Select" }];
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
  };
  showSuccess() {
    this.toast.show({
      severity: "success",
      summary: "College Created Successfully",
      detail: "Message Content",
      life: 5000,
    });
  }
  alertToaste = () => {
    this.props.showtoast({
      text: "College Successfully Created",
      time: new Date().getTime(),
    });
  };
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  render() {
    return (
      <div>
        <Toast ref={(el) => (this.toast = el)} />
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
          <div className="main-heading ms-4">{collegeText.createcollege}</div>
        </div>
        <div className="form-wrapper-3 mt-4">
          <Formik
            initialValues={{
              name: "",
              address: "",
              mobile_no: "",
              email: "",
              student_limit: "",
              subscription_type: "",
              contract_doc: "",
              logo: "",
            }}
            onSubmit={(values, onSubmitProps) => {
              if (documentorpdf) {
                this.showLoading();
                if (logo === "") {
                  logo = document.getElementById("profile_preview").src;
                }
                this.CollegeAPI.postCollege(values, logo, documentorpdf).then(
                  (res) => {
                    onSubmitProps.resetForm();
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
                  }
                );
              } else {
                this.setState({
                  showError: true,
                  errorMessage: "Add Contract Document",
                });
              }
            }}
            validationSchema={addCollegeSchema}
          >
            <Form className="customFormAdmin" id="addcollege">
              <div className="row">
                {" "}
                <div className="col-sm-12 col-md-6 col-lg-8 pe-5 ">
                  <div className="row w-100">
                    {" "}
                    <div className=" mb-3 col-sm-12 col-md-12 col-lg-12 ">
                      <div className="form-group w-100 ps-4">
                        <label
                          className="label"
                          htmlFor="name"
                        >
                          {" "}
                          {collegeText.collegename}
                        </label>
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          className="input"
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
                          maxlength="50"
                        />
                        <ErrorMessage name="address">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6 mb-3 ps-2">
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
                    <div className="col-sm-12 col-md-12 col-lg-6 mb-3">
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
                            : collegeText.sizelimit}
                        </span>
                        <Field
                          id="contract_doc"
                          name="contract_doc"
                          type="file"
                          accept=".pdf,.doc"
                          className="d-none"
                          onChange={this.selectFile}
                        />
                        <ErrorMessage name="contract_doc" className="ms-5">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
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
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
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
                        // maxlength="5"
                        />
                        <ErrorMessage name="student_limit">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
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
                          this.state.updatelogo
                            ? this.state.updatelogo
                            : `https://avatars.dicebear.com/api/initials/${this.state.college_name}.svg`
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
                      {collegeText.createcollege}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
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
)(withRouter(AddCollege));

import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { withRouter } from "react-router-dom";
import * as Yup from "yup";
import "../styles/Setting_user.scss";
import { SettingAPI } from "../api/Api";
import jwt_decode from "jwt-decode";
import { Skeleton } from "primereact/skeleton";
import { SettingTexts } from "../const/Const_settings";
import ErrorModal from "../../../../common_Components/popup/ErrorModalpoup";
const editnameSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(30, "Too Long!")
    .matches(/^[aA-zZ\s]+$/, "Please enter valid name")
    .required("Required"),
});
class Settings_Personaldetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showname: true,
      showemail: true,
      editprofilepic: true,
      user_id: "",
      data: "",
      profilepicupload: "",
      passionuserid: "",
      errormodal: false,
      errorMessage: "",
      btnDisable: true,
    };
    this.settingdata = this.props.settingdata.bind(this);
    this.editpicture = React.createRef();
    this.Openprofilepicture = this.Openprofilepicture.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.SettingAPI = new SettingAPI();
  }
  Openprofilepicture() {
    this.editpicture.current.click();
  }
  componentDidMount() {
    this.setState({ data: this.props.profiledata });
    let userid = localStorage.getItem("passion_token");
    let decoded = jwt_decode(userid);
    this.setState({ passionuserid: decoded.user_id });
  }
  changeImage = (event) => {
    document.getElementById("profile_preview").src = "";
    let file = event.target.files[0];
    // 
    this.setState({ profilepicupload: file });
    this.setState({ editprofilepic: false });
    if (file) {
      if (file.size < 2097152) {
        let reader = new FileReader();
        reader.onload = function () {
          document.getElementById("profile_preview").src = reader.result;
        };
        reader.readAsDataURL(file);
        this.setState({ btnDisable: false });
      } else {
        // 
        this.setState({
          errorMessage: "Size Limit Exceeds",
          errormodal: true,
        });
        document.getElementById("profile_preview").src = "";
        file = [];
      }
    }
  };
  closeErrorModal = () => {
    this.setState({ errorMessage: "", errormodal: false });
  };
  render() {
    return (
      <div className="">
        <div className="multiple-comp pt-lg-3 pt-md-3 ps-md-5 ps-3 mb-4">
          <div className="d-flex flex-row">
            <div className="field pt-1">{SettingTexts.Name}</div>
            {this.state.showname ? (
              <div className="field-width  d-flex flex-row">
                <span className="value  my-auto">
                  {this.props.profiledata === "" ? (
                    <Skeleton
                      width="10rem"
                      className="p-mb-2 ms-4 mt-4 "
                    ></Skeleton>
                  ) : (
                    this.props.profiledata.name
                  )}
                </span>
                <i
                  onClick={() => this.setState({ showname: false })}
                  className="fa-solid fa-pen-to-square edit ms-auto  my-auto"
                ></i>
              </div>
            ) : (
              <div>
                <Formik
                  className=""
                  initialValues={{ name: this.props.profiledata.name }}
                  enableReinitialize={true}
                  onSubmit={(values, onSubmitProps) => {
                    onSubmitProps.resetForm();
                    this.props.Loading();
                    let formDataname = new FormData();
                    formDataname.append("name", values.name);
                    this.SettingAPI.EditName(
                      formDataname,
                      this.state.passionuserid
                    ).then((res) => {
                      this.props.Loading();
                      if (res.status) {
                        this.settingdata();
                        this.setState({
                          showname: true,
                        });
                      } else {
                        if (res.message) {
                          if (typeof res.message === "object") {
                            let value = Object.values(res.message);
                            this.setState({
                              errorMessage: value[0],
                              errormodal: true,
                            });
                          } else {
                            this.setState({
                              errorMessage: res.message,
                              errormodal: true,
                            });
                          }
                        } else {
                          this.setState({
                            errorMessage: "Something Went Wrong",
                            errormodal: true,
                          });
                        }
                      }
                    });
                  }}
                  validationSchema={editnameSchema}
                >
                  <Form>
                    <div className="d-flex flex-row  ">
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        maxlength={41}
                        className="input-update"
                      />
                      <button
                        type="submit"
                        className="btn-icon ms-auto my-auto me-3"
                      >
                        <i class="fa-solid fa-floppy-disk cancel-icon"></i>
                      </button>
                      <span
                        className="form-cancel my-auto"
                        onClick={() =>
                          this.setState({
                            showname: true,
                          })
                        }
                      >
                        {SettingTexts.Cancel}
                      </span>
                    </div>
                    <ErrorMessage name="name">
                      {(msg) => (
                        <div
                          style={{ color: "red" }}
                          className=" error-msg mt-3"
                        >
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </Form>
                </Formik>
              </div>
            )}
          </div>
          <div className="d-flex flex-row mt-3">
            <span className="field  pt-1">{SettingTexts.Email}</span>
            {this.state.showemail ? (
              <div className="field-width  d-flex flex-row">
                <span className="value  my-auto">
                  {this.props.profiledata === "" ? (
                    <Skeleton
                      width="10rem"
                      className="p-mb-2 ms-4 mt-4 "
                    ></Skeleton>
                  ) : (
                    this.props.profiledata.email
                  )}
                </span>
                <i
                  onClick={() => this.props.emailModal()}
                  className="fa-solid fa-pen-to-square edit my-auto ms-auto "
                ></i>
              </div>
            ) : (
              <div className=" field-width-setting"></div>
            )}
          </div>
          <div className="d-flex flex-row mt-3">
            <span className="field  pt-1">{SettingTexts.Phone}</span>{" "}
            <div className="  field-width  d-flex flex-row">
              <span className="value  my-auto">
                {this.props.profiledata === "" ? (
                  <Skeleton
                    width="10rem"
                    className="p-mb-2 ms-4 mt-4"
                    style={{ backgroundcolor: "black" }}
                  ></Skeleton>
                ) : (
                  this.props.profiledata.mobile_no
                )}
              </span>
              <i
                onClick={() => this.props.phoneModal()}
                className="fa-solid fa-pen-to-square edit-icon my-auto ms-auto"
              ></i>
            </div>
          </div>
          <div className="d-flex flex-row mt-3 ms-4">
            <span className="field my-auto ">{SettingTexts.Image}</span>
            <div className="value ">
              <div className=" profile-img-setting d-flex  me-md-5 ">
                <img
                  src={this.props.profiledata.profile_image}
                  alt=""
                  className="profile-imgi "
                  onClick={this.Openprofilepicture}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/image/errorprofileimg.webp";
                  }}
                  id="profile_preview"
                />
              </div>
              <Formik
                initialValues={{ photo1: "" }}
                onSubmit={(values, onSubmitProps) => {
                  this.props.Loading();
                  let formDatapicture = new FormData();
                  formDatapicture.append(
                    "profile_image",
                    this.state.profilepicupload
                  );
                  this.SettingAPI.EditPicture(
                    formDatapicture,
                    this.state.passionuserid
                  ).then((res) => {
                    this.props.Loading();
                    if (res.status) {
                      this.settingdata();
                    } else {
                      if (res.message) {
                        if (typeof res.message === "object") {
                          let value = Object.values(res.message);
                          this.setState({
                            errorMessage: value[0],
                            errormodal: true,
                          });
                        } else {
                          this.setState({
                            errorMessage: res.message,
                            errormodal: true,
                          });
                        }
                      } else {
                        this.setState({
                          errorMessage: "Something Went Wrong",
                          errormodal: true,
                        });
                      }
                    }
                  });
                }}
              >
                <Form className=" ">
                  <input
                    type="file"
                    name="photo1"
                    id="file"
                    accept=".png, .jpg, .jpeg"
                    style={{ display: "none" }}
                    onChange={this.changeImage}
                    ref={this.editpicture}
                  />
                  <button
                    type="submit"
                    className="btn-update mt-4 ms-3"
                    disabled={this.state.btnDisable}
                  >
                    {SettingTexts.update}
                  </button>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
        {/* <Modal
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    show={this.state.errormodal}
                    onHide={() => this.setState({ errormodal: false })}
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="w-100">
                            <center className="mt-5 mb-3">
                                <h4>
                                    <b>{this.state.errorMessage}</b>
                                </h4>
                            </center>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-flex flex-row justify-content-center w-100">
                            <button
                                className="btn-blue mt-4 mb-5 w-50"
                                onClick={() => this.setState({ errormodal: false })}
                            >
                                OK
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal> */}
        <ErrorModal
          message={this.state.errorMessage}
          value={this.state.errormodal}
          closeModal={this.closeErrorModal}
        />
      </div>
    );
  }
}
export default withRouter(Settings_Personaldetails);

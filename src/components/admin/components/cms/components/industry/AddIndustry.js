import React, { Component } from "react";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { API } from "./utils/API";
import "../homePageContent/styles/HomePageContent.scss";
import Modal from "react-bootstrap/Modal";
import { cmsText } from "../../Const_CMS";
const createpostSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  // contract_video: Yup.mixed().required("Video is required"),
});
export default class AddIndustry extends Component {
  constructor(props) {
    super(props);
    this.state = {     
      showPreview: false,
      showEditPreview: false,
      editImage: "",
      errorMessage: "",
      showMessage: "",
      allowPost: false,
      showmodal: false,
      openmodal: false,
      modalmessage: "",
      id: "",
      industry_value: 1,
      showbtn: false,
      topiclearntId: "",
      renderQuestionModal: false,
      videoupload: false,
    };
    this.closeModal = this.closeModal.bind(this);
    this.openmodal = this.openmodal.bind(this);
    this.industryAPI = new API();
  }
  changeImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size < 20971520) {
        let reader = new FileReader();
        this.setState({ allowPost: true });
        reader.onload = function () {
          document.getElementById("profile_preview").src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.setState({ errorMessage: "Size Limit Exceeds", showError: true });
        event.target.value = "";
      }
    }
  };
  openmodal() {
    this.setState({ showmodal: true });
  }
  closeModal() {
    this.setState({ showmodal: false });
    this.props.closefeed(false);
  }
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  uploadVideo = (event) => {
    const file = event.target.files[0];
    // 
    if (file) {
      if (file.size < 524288000) {
        // let reader = new FileReader();
        // this.setState({ allowPost: true });
        // reader.onload = function () {
        //     document.getElementById("profile_preview").src = reader.result;
        // };
        // reader.readAsDataURL(file);
        this.setState({ videoupload: true });
      } else {
        this.setState({ errorMessage: "Size Limit Exceeds", showError: true });
        event.target.value = "";
      }
    }
  };
  render() {
    return (
      <div>
        <div>
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={this.state.showmodal}
            onHide={() => this.setState({ showmodal: false })}
            className={
              this.props.theme ? "themeblack_modal" : "themewhite_modal"
            }
          >
            <Modal.Header>
              <h4 className="ms-auto ps-3">{cmsText.CreateIndustry}</h4>
              <i
                class="fa-regular fa-circle-xmark  ms-auto"
                onClick={this.closeModal}
              ></i>
            </Modal.Header>
            <Modal.Body>
              <div className="form-wrapper-2 ">
                <Formik
                  initialValues={{
                    name: "",
                    description: "",
                    // contract_video: "",
                  }}
                  onSubmit={(values, onSubmitProps) => {
                    let data = values;
                    let image;
                    if (this.state.videoupload) {
                      if (this.state.allowPost) {
                        this.props.loading();
                        // 
                        //     "contract_video"
                        // ).files[0])
                        let videoObject =
                          document.getElementById("contract_video").files[0];
                        if (videoObject != null) {
                          data.contract_video = videoObject;
                        }
                        if (
                          document.getElementById("contract_doc").files[0] !=
                          null
                        ) {
                          image =
                            document.getElementById("contract_doc").files[0];
                        }
                        let formData = new FormData();
                        formData.append("name", data["name"]);
                        formData.append("description", data["description"]);
                        formData.append(
                          "description_video",
                          data["contract_video"]
                        );
                        formData.append("logo", image);
                        formData.append("industry_status", "active");
                        this.industryAPI
                          .createIndustry(formData)
                          .then((res) => {
                            if (res.status) {
                              this.props.loading();
                              this.closeModal();
                              this.props.industryList();
                            } else {
                              if (res.message) {
                                if (typeof res.message === "object") {
                                  let value = Object.values(res.message);
                                  this.setState({
                                    errorMessage: value[0],
                                    showError: true,
                                  });
                                } else {
                                  this.setState({
                                    errorMessage: res.message,
                                    showError: true,
                                  });
                                }
                              } else {
                                if (res.message) {
                                  if (typeof res.message === "object") {
                                    let value = Object.values(res.message);
                                    this.setState({
                                      errorMessage: value[0],
                                      showError: true,
                                    });
                                  } else {
                                    this.setState({
                                      errorMessage: res.message,
                                      showError: true,
                                    });
                                  }
                                } else {
                                  this.setState({
                                    errorMessage: "Something Went Wrong",
                                    showError: true,
                                  });
                                }
                              }
                              this.props.loading();
                            }
                          });
                        onSubmitProps.resetForm();
                      } else {
                        this.setState({
                          errorMessage: "Upload Image",
                          showError: true,
                        });
                      }
                    } else {
                      this.setState({
                        errorMessage: "Upload video",
                        showError: true,
                      });
                    }
                  }}
                  validationSchema={createpostSchema}
                >
                  <Form className="customFormAdmin px-3 mt-4">
                    <div className="form-group">
                      <label className="label" htmlFor="name">
                        {cmsText.industryname}
                      </label>
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        className="input"
                        maxlength="20"
                      />
                      <ErrorMessage name="name">
                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                      </ErrorMessage>
                    </div>
                    <div className="form-group">
                      <label htmlFor="description" className="label">
                        {cmsText.industrydescription}
                      </label>
                      <Field
                        id="description"
                        name="description"
                        as="textarea"
                        className="input-cms"
                        maxlength="150"
                      />
                      <ErrorMessage name="description">
                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                      </ErrorMessage>
                    </div>
                    <div className="form-group d-flex flex-row align-items-center">
                      <label htmlFor="contract_video" className="video_upload">
                        <div className="add_video_icon">
                          <i class="fa-solid fa-plus "></i>
                        </div>
                        <div className="p mt-1">{cmsText.content}</div>
                        {this.state.videoupload ? (
                          <span className="text-success">Uploaded</span>
                        ) : (
                          <span>Accept file :mp4 and mov up to 500MB</span>
                        )}
                      </label>
                      <Field
                        id="contract_video"
                        name="contract_video"
                        type="file"
                        className="d-none"
                        accept="video/mp4,video/x-m4v,video/*"
                        onChange={this.uploadVideo}
                      />
                    </div>
                    <div className=" d-flex flex-row justify-content-center">
                      <ErrorMessage name="contract_video">
                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                      </ErrorMessage>
                    </div>
                    <div className="form-group d-flex flex-row align-items-center">
                      <div className="logo-upload">
                        <img
                          src=""
                          alt=""
                          className=""
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/image/errorprofileimg.webp";
                          }}
                          id="profile_preview"
                        />
                      </div>
                      <label
                        className="label mx-4 cursor-pointer"
                        htmlFor="contract_doc"
                      >
                        {cmsText.uploadlogo}
                      </label>
                      <span className="text-muted info-text">
                        {cmsText.sizelimitidustry}
                      </span>
                      <Field
                        id="contract_doc"
                        name="contract_doc"
                        type="file"
                        className="d-none"
                        accept=".png, .jpg, .jpeg"
                        onChange={this.changeImage}
                      />
                    </div>
                    <Modal.Footer>
                      <div className="d-flex flex-row justify-content-center mt-3 mb-4 w-100">
                        <button type="submit" className="btn-blue">
                          {cmsText.save}
                        </button>
                      </div>
                    </Modal.Footer>
                  </Form>
                </Formik>
              </div>
            </Modal.Body>
          </Modal>
          <ErrorModal
            message={this.state.errorMessage}
            value={this.state.showError}
            closeModal={this.closeErrorModal}
          />
        </div>
      </div>
    );
  }
}

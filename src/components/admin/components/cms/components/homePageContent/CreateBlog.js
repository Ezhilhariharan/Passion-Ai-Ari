import React, { Component } from "react";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BlogAPI } from "./utils/Api";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";
import "./styles/HomePageContent.scss";
import { cmsText } from "../../Const_CMS";
// import "../../styles/CmsLayout.scss";
const createpostSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});
class CreateBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openmodal: false,
      modalmessage: "",
      id: "",
      showPreview: false,
      showEditPreview: false,
      editImage: "",
      errorMessage: "",
      showMessage: "",
      allowPost: false,
      showmodal: false,
    };
    this.closeModal = this.closeModal.bind(this);
    this.openmodal = this.openmodal.bind(this);
    this.BlogAPI = new BlogAPI();
  }
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
  changeImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size < 20971520) {
        this.setState({ showPreview: true });
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
  render() {
    // 
    return (
      <div>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.showmodal}
          onHide={() => this.setState({ showmodal: false })}
          className={this.props.theme ? "themeblack_modal" : "themewhite_modal"}
        >
          <Modal.Header>
            <h4 className="ms-auto ps-4">{cmsText.createblog}</h4>
            <i
              class="fa-regular fa-circle-xmark  ms-auto"
              onClick={this.closeModal}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <div className="form-wrapper-2 mt-4">
              <Formik
                initialValues={{
                  title: "",
                  description: "",
                  // image: '',
                }}
                onSubmit={(values, onSubmitProps) => {
                  if (this.state.allowPost) {
                    this.props.loading();
                    let formData = new FormData(
                      document.getElementById("createblog")
                    );
                    this.BlogAPI.createBlog(formData).then((res) => {
                      if (res.status) {
                        this.closeModal();
                        this.props.loading();
                        this.props.blogList();
                        onSubmitProps.resetForm();
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
                        this.props.loading();
                      }
                    });
                  } else {
                    this.setState({
                      errorMessage: "Upload Image",
                      showError: true,
                    });
                  }
                }}
                validationSchema={createpostSchema}
              >
                <Form className="customFormAdmin px-3 mt-4" id="createblog">
                  <div className="form-group">
                    <label className="label" htmlFor="title">
                      {cmsText.title}
                    </label>
                    <Field
                      id="addtitle"
                      name="title"
                      type="text"
                      className="input"
                      maxlength="50"
                    />
                    <ErrorMessage name="title">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="form-group">
                    <label htmlFor="description" className="label">
                      {cmsText.description}
                    </label>
                    <Field
                      id="adddescription"
                      name="description"
                      as="textarea"
                      className="input-cms"
                      maxlength="500"
                    />
                    <ErrorMessage name="description">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="form-group d-flex flex-row align-items-center">
                    <Field
                      id="image"
                      name="image"
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      className="d-none"
                      onChange={this.changeImage}
                    />
                    <label htmlFor="image" className="video_upload">
                      <div className="add_video_icon">
                        <i class="fa-solid fa-plus "></i>
                      </div>
                      <div className="p">{cmsText.content}</div>
                      <span>{cmsText.imagesize}</span>
                    </label>
                    {this.state.showPreview ? (
                      <div className="preview_image ms-4 p-2">
                        <img
                          src=""
                          alt=""
                          className="img-fluid"
                          id="profile_preview"
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className=" d-flex flex-row justify-content-center">
                    <ErrorMessage name="image" className="ps-5">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <Modal.Footer>
                    <div className="d-flex flex-row justify-content-center mt-3 mb-4 w-100">
                      <button type="submit" className="btn-blue ">
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
    );
  }
}
export default CreateBlog;

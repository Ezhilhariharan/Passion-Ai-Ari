import React, { Component } from "react";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { API } from "./utils/API";
import "../homePageContent/styles/HomePageContent.scss";
import Modal from "react-bootstrap/Modal";
import { cmsText } from "../../Const_CMS";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const number = /^[0-9]{1,5}$/;
const createpostSchema = Yup.object().shape({
  title: Yup.string().required("Required"), 
  Content_duration: Yup.string()
    .max(5, "Limit is too Long!")
    .matches(number, "number is not valid")
    .required("Required"),
});
let logo;
export default class CreateCourse extends Component {
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
      documentname: "",
      htmlFile: "",
      courseVideo: "",
      CourseDescriptionData: "",
    };
    this.closeModal = this.closeModal.bind(this);
    this.openmodal = this.openmodal.bind(this);
    this.courseAPI = new API();
  }
  openmodal() {
    this.setState({ showmodal: true });
  }
  closeModal() {
    this.setState({ showmodal: false });
    this.props.closefeed(false);
  }
  selectFile = () => {
    let documentovideo = document.getElementById("contract_doc_video").files[0];    
    if (documentovideo != null) {
      if (documentovideo.size < 524288000) {
        this.setState({
          documentname: documentovideo.name,
          courseVideo: documentovideo,
        });
      }else{
        this.setState({ errorMessage: "Size Limit Exceeds", showError: true });
      }    
    }
  };
  selectHtmlFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size < 20971520) {
        logo = file;
        let reader = new FileReader();
        this.setState({ allowPost: true });
        reader.onload = function () {
          document.getElementById("course_preview").src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.setState({ errorMessage: "Size Limit Exceeds", showError: true });
        event.target.value = "";
      }
    }
    event.target.value = "";
  };
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
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
              <h4 className="ms-auto ps-3">{cmsText.createcourse}</h4>
              <i
                class="fa-regular fa-circle-xmark  ms-auto"
                onClick={this.closeModal}
              ></i>
            </Modal.Header>
            <Modal.Body>
              <div className="form-wrapper-2 ">
                <Formik
                  initialValues={{
                    title: "",
                    // description: "",
                    content_type: "",
                    Content_duration: "",
                    contract_doc_video: "",
                    html_file: "",
                  }}
                  onSubmit={(values, onSubmitProps) => {
                    if (this.state.CourseDescriptionData !== "") {
                      if (this.state.courseVideo !== "" || logo) {
                        this.props.loading();
                        let formData = new FormData();
                        formData.append("title", values.title);
                        formData.append("industry_id", this.props.industry_id);
                        formData.append(
                          "description",
                          this.state.CourseDescriptionData
                        );
                        formData.append("content_type", values.content_type);
                        formData.append(
                          "content_duration",
                          values.Content_duration
                        );
                        if (values.content_type == "video") {
                          formData.append("file", this.state.courseVideo);
                        } else {
                          formData.append("file", logo);
                        }
                        formData.append("stage_no", this.props.stage_no);
                        this.courseAPI.CreateCourse(formData).then((res) => {
                          this.props.loading();
                          console.log("CreateCourse",res)
                          if (res.status) {                       
                        this.props.refresh(
                              this.props.industry_id,
                              this.props.stage_no,
                              true
                            );
                            this.closeModal();
                            onSubmitProps.resetForm();
                          } else {
                            this.setState({
                              errorMessage: res.message,
                              showError: true,
                            });
                          }
                        });
                      } else {
                        this.setState({
                          errorMessage: "Upload Video or Image",
                          showError: true,
                        });
                      }
                    } else {
                      this.setState({
                        errorMessage: "Description is Empty",
                        showError: true,
                      });
                    }
                  }}
                  validationSchema={createpostSchema}
                >
                  {({ values }) => (
                    <Form className="customFormAdmin px-3 mt-4">
                      <div className="form-group">
                        <label className="label" htmlFor="name">
                          {cmsText.title}
                        </label>
                        <Field
                          id="name"
                          name="title"
                          type="text"
                          className="input"
                          maxlength="30"
                        />
                        <ErrorMessage name="title">
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
                      <div className="form-group ClassicEditor">
                        <label htmlFor="description" className="label">
                          {cmsText.description}
                        </label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={this.state.CourseDescriptionData}
                          onReady={(editor) => {}}
                          const
                          config={{
                            toolbar: {
                              items: [
                                "heading",
                                "|",
                                "bold",
                                "italic",
                                "|",
                                "undo",
                                "redo",
                                "-",
                                "numberedList",
                                "bulletedList",
                                "fontfamily",
                                "fontsize",
                                "|",
                                "alignment",
                                "|",
                                "fontColor",
                                "fontBackgroundColor",
                                "|",
                                "link",
                                "|",
                                "outdent",
                                "indent",
                                "|",
                                "bulletedList",
                                "numberedList",
                                "todoList",
                                "|",
                              ],
                              shouldNotGroupWhenFull: true,
                            },
                          }}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            this.setState({ CourseDescriptionData: data });
                            // 
                          }}
                        />
                      </div>
                      {/* <div className="form-group">
                                                <label
                                                    htmlFor="description"
                                                    className="label"
                                                >
                                                    {cmsText.description}
                                                </label>
                                                <Field
                                                    id="description"
                                                    name="description"
                                                    as="textarea"
                                                    className="input-cms"
                                                />
                                                <ErrorMessage name="description">
                                                    {(msg) => (
                                                        <div
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        >
                                                            {msg}
                                                        </div>
                                                    )}
                                                </ErrorMessage> */}
                      {/* </div> */}
                      <div className="form-group">
                        <label className="label ">
                          <Field
                            type="radio"
                            id="content_type"
                            name="content_type"
                            value="image"
                            className="me-2"
                          />
                          {cmsText.text}
                        </label>
                        <label
                          // className="ms-5"
                          className="label ms-5"
                        >
                          <Field
                            type="radio"
                            id="content_type_video"
                            name="content_type"
                            value="video"
                            className="me-2"
                          />
                          {cmsText.video}
                        </label>
                      </div>
                      <div className="form-group ">
                        <label className="label" htmlFor="name">
                          {" "}
                          {cmsText.contentduration}
                        </label>
                        <Field
                          id="Content_duration"
                          name="Content_duration"
                          type="text"
                          className="input"
                          maxlength="5"
                        />
                        <ErrorMessage name="Content_duration">
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
                      {values.content_type === "video" ? (
                        <div className="form-group d-flex flex-row align-items-center">
                          <label className="label">{cmsText.video}</label>
                          <label
                            className="ms-3 me-3"
                            htmlFor="contract_doc_video"
                          >
                            {cmsText.upload}
                          </label>
                          <span className="text-muted info-text document_name mt-4">
                            {this.state.documentname !== ""
                              ? this.state.documentname
                              : cmsText.sizelimitcourse}
                          </span>
                          <Field
                            id="contract_doc_video"
                            name="contract_doc_video"
                            type="file"
                            className="d-none"
                            accept="video/mp4,video/x-m4v,video/*"
                            onChange={this.selectFile}
                          />
                          <ErrorMessage name="contract_doc">
                            {(msg) => <div>{msg}</div>}
                          </ErrorMessage>
                        </div>
                      ) : null}
                      {values.content_type === "image" ? (
                        <div className="form-group d-flex flex-row align-items-center">
                          <label className="ms-3 me-3" htmlFor="html_file">
                            {cmsText.upload}
                          </label>
                          <div className="logo-upload">
                            <img
                              src=""
                              alt=""
                              className=""
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/image/errorprofileimg.webp";
                              }}
                              id="course_preview"
                            />
                          </div>
                          <span className="text-muted info-text ms-3">
                            {cmsText.sizelimitidustry}
                          </span>
                          <Field
                            id="html_file"
                            name="html_file"
                            type="file"
                            className="d-none"
                            accept=".png,.jpg,.jpeg"
                            onChange={this.selectHtmlFile}
                          />
                          <ErrorMessage name="contract_doc">
                            {(msg) => <div>{msg}</div>}
                          </ErrorMessage>
                        </div>
                      ) : null}
                      <Modal.Footer>
                        <div className="d-flex flex-row justify-content-center mt-4 mb-4 w-100">
                          <button type="submit" className="btn-blue w-25">
                            {cmsText.create}
                          </button>
                        </div>
                      </Modal.Footer>
                    </Form>
                  )}
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

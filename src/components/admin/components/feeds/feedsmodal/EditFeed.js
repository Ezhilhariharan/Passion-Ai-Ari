import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import Modal from "react-bootstrap/Modal";
import { adminFeed } from "../api/Get";
import { editFeed } from "../api/Patch";
import { feedsText } from "../Const_feedsadmin";
import ErrorModal from "components/common_Components/popup/ErrorModalpoup";
class EditFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeData: {},
      metavalues: "",
      showmetadata: false,
      getid: "",
      editpost: "",
      url_preview: false,
      postpic: "",
      industryList: [],
      feedindustry_id: "",
      currentIndustryID: "",
      descriptionTouch: false,
      descriptionValue: "",
      titleValue: "",
      titleTouch: false,
      descriptionError: false,
      titleError: false,
      showmodal: false,
      showError: false,
      errorMessage: "",
      switchImageButton: true,
      selectindustryError: false,
    };
    this.onChangeEdit = this.onChangeEdit.bind(this);
    this.showpicture = React.createRef();
    this.Openpicture = this.Openpicture.bind(this);
    this.updateFeed = this.props.updateFeed.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openmodal = this.openmodal.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.adminFeed = new adminFeed();
    this.EditFeedApi = new editFeed();
  }
  openmodal(value) {
    // 
    this.setState({ showmodal: true, editpost: value });
    if (value.file) {
      this.setState({ switchImageButton: false });
    } else {
      this.setState({ switchImageButton: true });
    }
    if (value.industry_id) {
      this.setState({ feedindustry_id: value.industry_id });
    } else {
      this.setState({ feedindustry_id: "" });
    }
  }
  Openpicture() {
    this.showpicture.current.click();
  }
  closeModal() {
    this.setState({ showmodal: false });
    this.props.closefeed(false);
  }
  fileChangedHandler(event) {
    const file = event.target.files[0];
    this.setState({ postpic: file });
    if (file) {
      let reader = new FileReader();
      reader.onload = function () {
        document.getElementById("preview").src = reader.result;
      };
      this.setState({ switchImageButton: false });
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  }
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  onChangeEdit(e) {
    let collegeData = this.state.editpost;
    collegeData[e.target.name] = e.target.value;
    this.setState({ editpost: collegeData });
    let rgx = new RegExp(
      "([a-zA-Z]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
    );
    if (rgx.test(collegeData.description)) {
      this.adminFeed
        .getParser(this.state.collegeData.description)
        .then((res) => {
          if (res.status) {
            this.setState({ metavalues: res.data });
            this.setState({ showmetadata: true, url_preview: true });
          }
        })     
    } else {
      this.setState({ showmetadata: false });
    }
  }
  getindustryid = (event) => {   
    this.setState({ feedindustry_id: event.target.value });
  };
  render() {  
    return (
      <div>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.showmodal}
          onHide={() => this.setState({ showmodal: false })}
          className={
            this.props.theme.is_dark ? "themeblack_modal" : "themewhite_modal"
          }
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
            <div className="d-flex flex-row justify-content-end w-100">
              <i
                class="fa-regular fa-circle-xmark  ms-auto"
                onClick={() => this.closeModal()}
              ></i>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="d-flex flex-row ">
                <div className=" create-feed-profile d-flex  ms-2">
                  <img
                    src={this.props.user.profile_image}
                    alt=""
                    className="profile-imgin"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image/errorprofileimg.webp";
                    }}
                  />
                </div>
                <h5 className="my-auto ms-3 modal-username">
                  {this.props.user.username}
                </h5>
              </div>
              <Formik
                initialValues={{ description: "", title: "" }}
                enableReinitialize={true}
                onSubmit={(values, onSubmitProps) => {                  
                  if (!this.state.editpost.title) {
                    this.setState({ titleError: true });
                  } else if (!this.state.editpost.description) {
                    this.setState({ descriptionError: true });
                  } else if (this.state.feedindustry_id == "") {
                    this.setState({ selectindustryError: true });
                  } else {
                    this.props.loading();
                    let formData = new FormData();              
                    if (this.state.switchImageButton) {
                      formData.append("file", "");
                    } else {
                      formData.append("file", this.state.postpic);
                    }
                    formData.append("file_type", "image");
                    formData.append(
                      "description",
                      this.state.editpost.description
                    );
                    formData.append("title", this.state.editpost.title);
                    formData.append("url_preview", this.state.url_preview);
                    formData.append("industry", this.state.feedindustry_id);
                    this.EditFeedApi.editFeedApi(
                      this.state.editpost.id,
                      formData
                    ).then((res) => {                      
                      if (res.status) {
                        this.props.loading();
                        this.setState({ showmodal: false });
                        // this.updateFeed(this.state.feedindustry_id)
                        this.props.updateFeed();
                      } else {
                        this.props.loading();
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
                    });
                    onSubmitProps.resetForm();
                  }
                }}
              >
                <Form className=" mt-3" id="form">
                  <div className="d-flex flex-row mt-3 px-2">
                    <div className="label-modal col-3 my-auto" htmlFor="number">
                      {feedsText.title}{" "}
                    </div>
                    <div className="col-12">
                      <Field
                        id="title"
                        name="title"
                        type="text"
                        className="comment-title col-9"
                        maxlength="35"
                        value={this.state.editpost.title}
                        onChange={(e) => this.onChangeEdit(e)}
                      />
                      {this.state.titleError && (
                        <>
                          {this.state.editpost.title.length === 0 ? (
                            <div style={{ color: "red" }}>
                              {feedsText.required}
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="d-flex flex-row mt-3 px-2">
                    <div className="label-modal col-3 my-auto" htmlFor="number">
                      {feedsText.description}
                    </div>
                    <div className="col-12">
                      <Field
                        id="description"
                        name="description"
                        as="textarea"
                        className="comment-description col-9"
                        maxlength="150"
                        value={this.state.editpost.description}
                        onChange={(e) => this.onChangeEdit(e)}
                      />
                      {/* {
                        this.state.descriptionError && <div style={{ color: "red" }}>{feedsText.required}</div>
                      } */}
                      {this.state.descriptionError && (
                        <>
                          {this.state.editpost.description.length === 0 ? (
                            <div style={{ color: "red" }}>
                              {feedsText.required}
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                  {this.state.showmetadata ? (
                    <div className="metadata d-flex flex-row mx-auto mb-3 mt-4">
                      <img
                        className="metadata-img"
                        src={this.state.metavalues.image}
                      />
                      <div className="metadata-description">
                        <h7 className="ms-2 mt-3">
                          {this.state.metavalues.title}
                        </h7>
                        <p className="ms-2 mt-1">
                          {this.state.metavalues.description}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <input
                    type="file"
                    className=" hide-inputfile mt-2"
                    accept=".png, .jpg, .jpeg"
                    onChange={this.fileChangedHandler}
                    ref={this.showpicture}
                    style={{ display: "none" }}
                  ></input>
                  <div className="addimage-admin d-flex flex-row mt-3">
                    <div className="col-8 ">
                      <div className="customFormAdmin  ">
                        <div className="form-group mt-3 d-flex flex-row">
                          <select
                            className="custom-select-1 "
                            id="mySelect"
                            onChange={this.getindustryid}
                          >
                            {this.props.industryList.map((option, index) => (
                              <option
                                value={option.value}
                                key={index}
                                selected={
                                  option.value ==
                                  this.state.editpost.industry_id
                                    ? "selected"
                                    : ""
                                }
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {this.state.selectindustryError && (
                            <div style={{ color: "red" }} className="mt-2 ms-1">
                              {feedsText.required}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="addimage col-4 d-flex flex-row justify-content-end">
                      <div className="d-flex flex-row">
                        {this.state.switchImageButton ? null : (
                          <i
                            class="fa-regular fa-trash-can  my-auto ms-auto me-3"
                            onClick={() =>
                              this.setState({
                                switchImageButton: true,
                              })
                            }
                          ></i>
                        )}
                        {this.state.switchImageButton ? (
                          <div className="upload-post-active ">
                            <img
                              className=""
                              src="/image/addgallery.png"
                              onClick={this.Openpicture}
                            />
                          </div>
                        ) : (
                          <div className="upload-post ">
                            <img
                              className=""
                              id="preview"
                              src={
                                this.state.editpost.file
                                  ? this.state.editpost.file
                                  : "/image/gallery.png"
                              }
                              onClick={this.Openpicture}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* <div className="col-4 d-flex flex-row">
                      <p className="ms-auto pe-3 my-auto">{feedsText.addimage}</p>
                      <div className="upload-post">
                        <img className="" id="preview" src={this.state.editpost.file ? this.state.editpost.file
                          : "/image/gallery.png"}
                          onClick={() => this.Openpicture()}
                          onError={(e) => { e.target.onerror = null; e.target.src = "/image/gallery.png" }} />
                      </div>
                    </div> */}
                  </div>
                  <Modal.Footer>
                    <div className=" update-post d-flex flex-row mt-4 mb-4">
                      <button type="submit" className="btn-blue  mt-1 ">
                        {feedsText.post}
                      </button>{" "}
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
export default EditFeed;

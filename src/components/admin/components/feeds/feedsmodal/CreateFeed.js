import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import Modal from "react-bootstrap/Modal";
import { adminFeed } from "../api/Get";
import { createFeed } from "../api/Post";
import { feedsText } from "../Const_feedsadmin";
import ErrorModal from "components/common_Components/popup/ErrorModalpoup";
class CreateFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeData: {},
      metavalues: "",
      showmetadata: false,
      getid: "",
      editpost: "",
      publicandprivate: true,
      url_preview: false,
      postpic: "",
      industryList: [],
      feedindustry_id: "",
      currentIndustryID: "",
      industrylist: [],
      descriptionTouch: false,
      descriptionValue: "",
      titleValue: "",
      titleTouch: false,
      descriptionError: false,
      titleError: false,
      showmodal: false,
      showError: false,
      errorMessage: "",
      selectindustry: false,
      switchImageButton: true,
    };
    this.onChange = this.onChange.bind(this);
    this.showpicture = React.createRef();
    this.Openpicture = this.Openpicture.bind(this);
    this.updateFeed = this.props.updateFeed.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openmodal = this.openmodal.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.adminFeed = new adminFeed();
    this.createFeed = new createFeed();
  }
  openmodal() {
    this.setState({ showmodal: true });
  }
  Openpicture() {
    this.showpicture.current.click();
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
  onChange(e) {
    this.setState({ descriptionValue: e.target.value });
    let collegeData = this.state.collegeData;
    collegeData[e.target.name] = e.target.value;
    this.setState({ collegeData: collegeData });
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
        });
    } else {
      this.setState({ showmetadata: false });
    }
  }
  getindustryid = (event) => {
    this.setState({
      feedindustry_id: event.target.value,
      selectindustry: false,
    });
  };
  closeModal() {
    this.setState({ showmodal: false });
    this.props.closefeed(false);
  }
  render() {
    return (
      <div className="">
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
                onClick={this.closeModal}
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
                initialValues={{}}
                onSubmit={(values, onSubmitProps) => {
                  if (
                    this.state.descriptionTouch === false &&
                    this.state.titleTouch === false
                  ) {
                    this.setState({ descriptionTouch: true, titleTouch: true });
                  }
                  if (this.state.descriptionValue == "") {
                    this.setState({ descriptionTouch: true });
                  }
                  if (this.state.titleValue == "") {
                    this.setState({ titleTouch: true });
                  }
                  if (this.state.feedindustry_id == "") {
                    this.setState({ selectindustry: true });
                  }
                  if (
                    this.state.titleValue !== "" &&
                    this.state.descriptionValue !== "" &&
                    this.state.feedindustry_id !== ""
                  ) {
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
                      this.state.collegeData.description
                    );
                    formData.append("title", this.state.titleValue);
                    formData.append("url_preview", this.state.url_preview);
                    formData.append("industry_id", this.state.feedindustry_id);
                    this.createFeed.postFeed(formData).then((res) => {
                      // 
                      if (res.status) {
                        this.props.loading();
                        this.setState({ showmodal: false, titleValue: "" });
                        this.closeModal();
                        this.props.updateFeed();
                      } else {
                        this.props.loading();
                        // this.setState({ showError: true, errorMessage: res.message })
                        if (res.message) {
                          if (typeof res.message === "object") {
                            let value = Object.values(res.message);
                            this.setState({
                              errorMessage: value[0],
                              showError: true,
                            });
                          } else {
                            // 
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
                <Form className=" mt-3">
                  <div className="d-flex flex-row mt-3 px-2">
                    <div className="label-modal col-3 my-auto" htmlFor="number">
                      {feedsText.title}{" "}
                    </div>
                    <div className="col-9">
                      <Field
                        id="title"
                        name="title"
                        type="text"
                        className="comment-title col-12"
                        maxlength="35"
                        value={this.state.titleValue}
                        onChange={(e) =>
                          this.setState({ titleValue: e.target.value })
                        }
                        onBlur={() => this.setState({ titleTouch: true })}
                      />
                      {this.state.titleTouch ? (
                        <>
                          {this.state.titleValue.length === 0 ? (
                            <div style={{ color: "red" }}>
                              {feedsText.required}
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="d-flex flex-row mt-3 px-2">
                    <div className="label-modal col-3 my-auto" htmlFor="number">
                      {feedsText.description}
                    </div>
                    <div className="col-9">
                      <Field
                        id="description"
                        name="description"
                        as="textarea"
                        className="comment-description col-12"
                        maxlength="150"
                        value={this.state.collegeData.name}
                        onChange={(e) => this.onChange(e)}
                        onBlur={() => this.setState({ descriptionTouch: true })}
                      />
                      {this.state.descriptionTouch ? (
                        <>
                          {this.state.descriptionValue.length === 0 ? (
                            <div style={{ color: "red" }}>
                              {feedsText.required}
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </div>
                  {this.state.showmetadata ? (
                    <div className="metadata d-flex flex-row mx-auto mb-3">
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
                    id="logo"
                    type="file"
                    className=" hide-inputfile mt-2"
                    accept=".png, .jpg, .jpeg"
                    onChange={this.fileChangedHandler}
                    ref={this.showpicture}
                    alt="post"
                    style={{ display: "none" }}
                  ></input>
                  <div className="addimage d-flex flex-row mt-3">
                    <div className="col-8 ">
                      <div className="customFormAdmin  ">
                        <div className="form-group mt-3 d-flex flex-row">
                          <select
                            className="custom-select-1 "
                            onChange={this.getindustryid}
                          >
                            {this.props.industryList.map((option) => (
                              <option value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {this.state.selectindustry && (
                            <div style={{ color: "red" }} className="mt-2 ms-1">
                              {feedsText.required}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-4 d-flex flex-row"> */}
                    <div className="addimage-admin col-4 d-flex flex-row justify-content-end">
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
                          //   <h1 onClick={() => this.Openpicture}>hiii</h1>
                          <div className="upload-post ">
                            <img
                              className=""
                              id="preview"
                              src=""
                              alt="post"
                              onClick={this.Openpicture}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* <p className="ms-auto pe-3 my-auto">{feedsText.addimage}</p>
                      <div className="upload-post">
                        <img className="" id="preview" src="/image/gallery.png" onClick={this.Openpicture} />
                      </div> */}
                    {/* </div> */}
                  </div>
                  <Modal.Footer>
                    <div className=" update-post d-flex flex-row mt-4 mb-4">
                      <button type="submit" className="btn-blue  mt-1">
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
export default CreateFeed;

import React, { Component } from "react";
import { Formik, Form, Field} from "formik";
import { mentorhome } from "../api/Api";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";
import { feedsText } from "components/admin/components/feeds/Const_feedsadmin";
import { mentorText } from "../const/Const_mentor";
const createpostSchema = Yup.object().shape({
  post: Yup.string(),
});
export class Mentor_feed extends Component {
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
      active: 3,
      Localfeeddata: [],
      Globalfeeddata: [],
      navigation: true,
      completedpercentage: "",
      postpic: "",
      collegeData: {},
      metavalues: "",
      showmetadata: false,
      getid: "",
      editpost: "",
      comments: "",
      Iswebinar: false,
      mentordetails: "",
      expertdetails: "",
      webinardetailslist: [],
      communityfeeds: [],
      publicandprivate: true,
      url_preview: false,
      showdropdown: false,
      studentAnalysis: {},
      blockedPanel: true,
      webinardata: {},
      appointment_id: "",
      show: false,
      showReschedule: false,
      ownername: "",
      message: "",
      // publicandprivate: true,
      // url_preview: false,
      // postpic: "",
      industryList: [],
      feedindustry_id: 1,
      currentIndustryID: "",
      industrylist: [],
      descriptionTouch: false,
      descriptionValue: "",
      titleValue: "",
      titleTouch: false,
      descriptionError: false,
      titleError: false,
      // showmodal: false,
      showError: false,
      // errorMessage: "",
      switchImageButton: true,
    };
    this.closeModal = this.closeModal.bind(this);
    this.openmodal = this.openmodal.bind(this);
    this.mentorhome = new mentorhome();
    this.showpicture = React.createRef();
    this.Openpicture = this.Openpicture.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.showpicture = React.createRef();
  }
  openmodal() {
    this.setState({ showmodal: true });
  }
  closeModal() {
    this.setState({ showmodal: false });
    this.props.closefeed(false);
  }
  Openpicture() {
    this.showpicture.current.click();
  }
  fileChangedHandler(event) {
    const file = event.target.files[0];
    this.setState({ postpic: file });
    if (file) {
      if (file.size < 2097152) {
        let reader = new FileReader();
        reader.onload = function () {
          document.getElementById("preview").src = reader.result;
        };
        this.setState({ switchImageButton: false });
        reader.readAsDataURL(file);
      } else {
        this.setState({
          errorMessage: "Size Limit Exceed",
          showError: true,
        });
      }
    }
    event.target.value = "";
  }
  onChange(e) {
    this.setState({ descriptionValue: e.target.value });
    let collegeData = this.state.collegeData;
    collegeData[e.target.name] = e.target.value;
    this.setState({ collegeData: collegeData });
    let rgx = new RegExp(
      "([a-zA-Z]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
    );
    if (rgx.test(collegeData.description)) {
      this.mentorhome
        .getParser(this.state.collegeData.description)
        .then((res) => {
          this.setState({ metavalues: res.data.data });
          this.setState({ showmetadata: true, url_preview: true });
        })
        .catch((err) => {
        });
    } else {
      this.setState({ showmetadata: false });
    }
  }
  render() {
    return (
      <div>
        <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.showmodal}
          onHide={() => this.setState({ showmodal: false })}
          className={this.props.theme ? "themeblack_modal" : "themewhite_modal"}
        >
          <Modal.Header>
            <div className="d-flex flex-row justify-content-end w-100">
              <i
                class="fa-regular fa-circle-xmark  ms-auto"
                onClick={this.closeModal}
              ></i>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-row ms-2">
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
              onSubmit={(values, onSubmitProps) => {
                if (
                  this.state.descriptionTouch === false &&
                  this.state.titleTouch === false
                ) {
                  this.setState({
                    descriptionTouch: true,
                    titleTouch: true,
                  });
                } else if (this.state.descriptionTouch === false) {
                  this.setState({ descriptionTouch: true });
                } else if (this.state.titleTouch === false) {
                  this.setState({ titleTouch: true });
                } else {
                  if (
                    this.state.titleValue !== "" &&
                    this.state.descriptionValue !== ""
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
                    this.mentorhome
                      .createMentorFeed(formData)
                      // axios.post('users/feeds/', formData)
                      .then((res) => {
                        this.props.loading();
                        this.closeModal();
                        if (res.status) {
                          this.props.alertToaste();
                          this.props.refreshFeedData();                         
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
                              showError: true,
                              errorMessage: "Feeds Not Update",
                            });
                          }
                        }
                      })
                      .catch((err) => {
                      });
                    onSubmitProps.resetForm();
                  }
                }
              }}
              validationSchema={createpostSchema}
            >
              <Form className=" mt-3">
                <div className="d-sm-flex flex-row mt-3 px-2">
                  <div className="label-modal col-3 my-auto" htmlFor="number">
                    {mentorText.Title}{" "}
                  </div>
                  <div className="col-12 col-sm-9">
                    <Field
                      name="title"
                      type="text"
                      className="comment-title col-12 "
                      maxlength="35"
                      value={this.state.titleValue}
                      onChange={(e) =>
                        this.setState({
                          titleValue: e.target.value,
                        })
                      }
                      onBlur={() =>
                        this.setState({
                          titleTouch: true,
                        })
                      }
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
                <div className="d-sm-flex flex-row mt-3 px-2">
                  <div className="label-modal col-3 my-auto" htmlFor="number">
                    {mentorText.Descritption}
                  </div>
                  <div className="col-12 col-sm-9">
                    <Field
                      name="description"
                      as="textarea"
                      className="comment-description col-12 "
                      maxlength="150"
                      value={this.state.collegeData.name}
                      onChange={(e) => this.onChange(e)}
                      onBlur={() =>
                        this.setState({
                          descriptionTouch: true,
                        })
                      }
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
                  onChange={this.fileChangedHandler}
                  ref={this.showpicture}
                  accept=".png, .jpg, .jpeg"
                  style={{ display: "none" }}
                  alt=""
                ></input>
                <div className="addimage col-12 d-flex flex-row justify-content-end mt-3 me-3">
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
                          alt=""
                        />
                      </div>
                    ) : (
                      <div className="upload-post ">
                        <img
                          className=""
                          id="preview"
                          src=""
                          onClick={this.Openpicture}
                          alt=""
                        />
                      </div>
                    )}
                  </div>
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
          </Modal.Body>
        </Modal>
        <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.showError}
          onHide={() => this.setState({ showError: false })}
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
                onClick={() => this.setState({ showError: false })}
              >
                {mentorText.Ok}
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default Mentor_feed;

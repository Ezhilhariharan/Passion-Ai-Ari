import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  withRouter,
} from "react-router-dom";
import "./styles/Course.scss";
import { API } from "./utils/API";
import { Toast } from "primereact/toast";
import { css } from "@emotion/react";
import ClockLoader from "react-spinners/ClockLoader";
import { Modal } from "bootstrap";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { connect } from "react-redux";
import { cmsText } from "../../Const_CMS";
import CreateCourse from "./CreateCourse";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
let url,
  getIndustryList = [{ value: "", label: "Select an industry" }];
const number = /^[1-9]{1,5}$/;
let logo;
const editpostSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  Content_duration: Yup.string()
    .max(5, "Limit is too Long!")
    .matches(number, "number is not valid")
    .required("Required"),
});
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industrylist: [],
      course_details: "",
      coursetitle: "Course Title",
      CourseDescription: "Course Description",
      is_final: null,
      totalstage: 3,
      showbutton: false,
      content_type: "",
      course_content: {},
      editcourseplaceholder: "",
      lock: false,
      page: 1,
      industry_id: 1,
      stage_no: 1,
      openmodal: false,
      modalmessage: "",
      id: "",
      loading: false,
      showTable: false,
      documentname: "",
      htmlFile: "",
      courseVideo: "",
      showCourse: false,
      errorMessage: "",
      showMessage: "",
      CourseDescriptionData: "",
    };
    url = this.props.match.path;
    this.courseAPI = new API();
    this.getCourselist = this.getCourselist.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
    this.OrderID = this.OrderID.bind(this);
    this.Video = this.Video.bind(this);
    this.contentDuration = this.contentDuration.bind(this);
    this.editcourse = this.editcourse.bind(this);
    this.showLoading = this.showLoading.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.modalRef = React.createRef();
    this.editCourseRef = React.createRef();
    this.scrollLoader = this.scrollLoader.bind(this);
    this.getCourse = this.getCourse.bind(this);
    // this.onColReorder = this.onColReorder.bind(this);
    this.onRowReorder = this.onRowReorder.bind(this);
  }
  componentDidMount() {
    this.courseContentInitialRender();
    this.initialRender();
    this.scrollLoader();

    // this.getCourse(this.state.industry_id, this.state.stage_no, true);
  }

  initialRender = () => {
    this.courseAPI
      .getIndustryList()
      .then((res) => {
        if (res.status) {
          this.setState({ industrylist: res.data });
        } else {
          this.setState({ industrylist: getIndustryList });
        }
      })
      .catch((err) => {
      });
  };
  courseContentInitialRender = () => {
    this.showLoading();
    this.courseAPI
      .getCourseContent(this.state.industry_id, this.state.stage_no, 1)
      .then((res) => {
        console.log("res", res);
        if (res.status) {
          this.showLoading();
          this.setState({ course_content: {} }, () =>
            this.setState({ course_content: res.data }))
        }
      })
  }
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  onRowReorder(e) {
    this.toast.show({
      severity: "success",
      summary: "Rows Reordered",
      life: 3000,
    });
    // 
    let obj = {};
    let course_id;
    e.value.map((item, index) => {
      course_id = item.course_id;
      // 
      obj = { ...obj, [item.id]: index + 1 };
    });
    let formData = new FormData();
    formData.append("reordered_content", JSON.stringify(obj));
    formData.append("course_id", course_id);
    formData.append("stage_no", this.state.stage_no);
    this.courseAPI.reOrderList(formData).then((res) => {
      this.getCourse(this.state.industry_id, this.state.stage_no, true);
    });
  }
  editcourse(id) {
    this.state.course_content.results.forEach((item, index) => {
      if (item.id === id) {
        this.setState({ editcourseplaceholder: item });
        if (item.content_type == "video") {
          this.setState({
            documentname: item.link,
            courseVideo: item.link,
          });
        } else {
          logo = item.link;
        }
        if (item.description) {
          this.setState({
            CourseDescriptionData: item.description,
          });
        }
      }
    });
  }
  getCourselist(event) {
    this.setState({ industry_id: event.target.value });
    this.getCourse(event.target.value, this.state.stage_no, true);
  }
  scrollLoader() {
    // 
    let scroller = document.getElementsByClassName(
      "p-datatable-scrollable-body"
    )[0];
    let scrollerBody = document.getElementsByClassName(
      "p-datatable-scrollable-body-table"
    )[0];
    console.log("scroller", scroller);
    scroller.addEventListener("scroll", () => {
      if (
        scroller.scrollTop >
        (scrollerBody.clientHeight - scroller.clientHeight) * 0.9
      ) {
        if (!this.state.lock && this.state.course_content.next) {
          this.setState({ lock: true }, () => {
            this.setState({ page: this.state.page + 1 }, () => {
              this.getCourse(this.state.industry_id, this.state.stage_no);
            });
          });
        }
      }
    });
  }
  getCourse(value, stage_no, reset = false) {


    this.courseAPI
      .getCourseContent(value, stage_no, this.state.page)
      .then((res) => {
        console.log('getCourseContent===>', res)
        // this.showLoading();
        if (res.status) {
          this.setState({ showTable: true });
          if (Object.keys(this.state.course_content).length != 0 && !reset) {
            let list = this.state.course_content.results;
            list.push(...res.data.results);
            res.data.results = list;
            let Data = Object.assign({}, res.data);
            this.setState({ course_content: Data });
          } else {
            let Data = Object.assign({}, res.data);
            this.setState({ course_content: Data });
          }
          this.setState({ lock: false });
        } else {
          this.setState({ showTable: false });
        }
      })
      .catch((err) => {
      });
  }
  ChangeStageButton(index) {
    this.setState({ stage_no: index + 1 });
    this.getCourse(this.state.industry_id, index + 1, true);
  }
  hideModal = () => {
    const modalEle = this.modalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  showModal = () => {
    const modalEle = this.modalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideEditModal = () => {
    const modalEle = this.editCourseRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  showEditModal(id) {
    const modalEle = this.editCourseRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    this.editcourse(id);
    bsModal.show();
  }
  Video(rowData) {
    // console.log("currentItem", rowData.link, rowData)
    let currentItem = Object.assign({}, rowData);
    let videoLink = currentItem.link.split("?")[0];
    let timeStamp = global.Date.now()
    let splitedLink = videoLink.slice(0, -4);
    let type = videoLink.split(".").slice(-1);
    if (rowData.content_type == "image") {
      return (
        <React.Fragment>
          <div className="w-100 video-img">
            <img
              src={rowData.link}
              alt=""
              className=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/image/errorprofileimg.webp";
              }}
              id="profile_preview"
            />
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="w-100">
            <video width="100%" height="100%">
              <source src={rowData.link ? `${splitedLink}.${type}?${timeStamp}` : ""} type="video/mp4" />
            </video>
          </div>
        </React.Fragment>
      );
    }
  }
  OrderID(rowData) {
    return (
      <React.Fragment>
        <div className="w-100">
          <h5>{rowData.order_no}</h5>
        </div>
      </React.Fragment>
    );
  }
  contentDuration(rowData) {
    return (
      <React.Fragment>
        <div className="w-100">
          <h6>{rowData.content_duration}</h6>
        </div>
      </React.Fragment>
    );
  }
  changeStatus(i) {
    // let MentorList = this.state.MentorList;
    // if (MentorList.results[i].user_status === "active") {
    //   MentorList.results[i].user_status = "inactive";
    // } else if (MentorList.results[i].user_status === "inactive") {
    //   MentorList.results[i].user_status = "active";
    // }
    // let formData = new FormData();
    // formData.append("user_status", MentorList.results[i].user_status);
    // formData.append("user_id", MentorList.results[i].uuid);
    // this.mentorAPI
    //   .updateMentorStatus(formData)
    //   .then((res) => {
    //     this.setState({ MentorList: MentorList });
    //   })
  }
  actionTemplate(rowData) {
    // console.log("rowData", rowData);
    let i = this.state.course_content.results.indexOf(rowData);
    return (
      <React.Fragment>
        <div className="d-flex flex-row justify-content-center w-100">
          <>
            <label className="customised-switch">
              <input
                type="checkbox"
                checked={
                  this.state.course_content.results[i].user_status == "active"
                    ? true
                    : false
                }
                onChange={() => this.changeStatus(i)}
              />
              <span className="customised-slider customised-round"></span>
            </label>
            <i
              className="fa-solid fa-pen-to-square ms-4 text-black cursor-pointer"
              onClick={() => this.showEditModal(rowData.id)}
            ></i>
          </>
        </div>
      </React.Fragment>
    );
  }
  onChange(e) {
    let editcourseplaceholder = this.state.editcourseplaceholder;
    editcourseplaceholder[e.target.name] = e.target.value;
    this.setState({ editcourseplaceholder: editcourseplaceholder });
  }
  clearFeild = () => {
    document.getElementById("name").value = "";
    document.getElementById("Content_duration").value = "";
    document.getElementById("description").value = "";
  };
  selectFile = () => {
    let documentovideo = document.getElementById("contract_doc_video").files[0];
    // console.log("documentovideo",documentovideo)
    if (documentovideo != null) {
      if (documentovideo.size < 524288000) {
        this.setState({
          documentname: documentovideo.name,
          courseVideo: documentovideo,
        });
      } else {
        this.setState({ errorMessage: "Size Limit Exceeds", showError: true });
      }
    }
  };
  selectHtmlFile = (event) => {
    const file = event.target.files[0];
    // 
    if (file) {
      if (file.size < 20971520) {
        logo = file;
        let reader = new FileReader();
        this.setState({ allowPost: true });
        reader.onload = function () {
          document.getElementById("preview").src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.setState({ errorMessage: "Size Limit Exceeds", showError: true });
      }
    }
    // event.target.value = ""
  };
  closeFeed = (value) => {
    console.log("closemodal")
    this.setState({ showCourse: false });
  };
  openFeed = () => {
    this.setState({ showCourse: true }, () => {
      this.modalRef.current.openmodal();
    });
  };
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  render() {
    // 
    return (
      <div className="customFormAdmin course-wrapper mt-3">
        <Toast
          ref={(el) => {
            this.toast = el;
          }}
        ></Toast>
        <div className="loading-icon">
          <ClockLoader
            color="#ffffff"
            loading={this.state.loading}
            css={override}
            size={130}
          />
        </div>
        <div className="course-row d-flex flex-row  justify-content-between">
          <div className="w-25">
            <div className=" form-group  me-5 ">
              <select className="custom-select-1" onChange={this.getCourselist}>
                {this.state.industrylist.map((option) => (
                  <option value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="stage-width mx-auto">
            <div className="stage-wrapper ">
              {Array.from(Array(this.state.totalstage)).map((item, index) => (
                <button
                  onClick={() => this.ChangeStageButton(index)}
                  className={this.state.stage_no === index + 1 ? "active" : ""}
                >
                  Stage {index + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="w-25 d-flex flex-row">
            <div
              className="add-icon  me-auto ms-2"
              onClick={() => this.openFeed()}
            >
              <i class="fa-solid fa-plus "></i>
            </div>
            <div className="mt-2">
              {" "}
              {cmsText.numberofcount} :{" "}
              {this.state.course_content ? this.state.course_content.results?.length : ""}
            </div>
          </div>
        </div>
        {/* {this.state.showTable ? ( */}
        <div
          className="t-wrapper"
          style={{ height: "calc(82vh - 220px)", width: "100%" }}
        >
          <DataTable
            value={this.state.course_content.results}
            reorderableColumns
            scrollable
            onRowReorder={this.onRowReorder}
            width="100%"
            scrollHeight="100%"
          >
            <Column rowReorder style={{ cursor: "pointer" }} />
            <Column field="title"></Column>
            <Column field="name" body={this.Video}></Column>
            <Column
              field="Content-Duration"
              body={this.contentDuration}
            ></Column>
            <Column field="Action" body={this.actionTemplate}></Column>
          </DataTable>
        </div>
        {/* ) : null} */}
        {this.state.showCourse ? (
          <CreateCourse
            closefeed={this.closeFeed}
            loading={this.showLoading}
            industry_id={this.state.industry_id}
            stage_no={this.state.stage_no}
            refresh={this.courseContentInitialRender}
            ref={this.modalRef}
            theme={this.props.theme.is_dark}
          />
        ) : null}
        <div
          className="modal "
          id="editcoursecontentModal"
          tabindex="-1"
          ref={this.editCourseRef}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div class="modal-header">
                <h4 className="ms-auto ps-3">{cmsText.editcourse}</h4>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  onClick={this.hideEditModal}
                ></i>
                {/* <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
              </div>
              <div className="modal-body">
                <div className="form-wrapper-2 ">
                  <Formik
                    initialValues={{
                      title: this.state.editcourseplaceholder.title,
                      description: this.state.CourseDescriptionData,
                      content_type:
                        this.state.editcourseplaceholder.content_type,
                      Content_duration:
                        this.state.editcourseplaceholder.content_duration,
                      contract_doc_video: "",
                      html_file: "",
                    }}
                    enableReinitialize={true}
                    onSubmit={(values, onSubmitProps) => {
                      if (this.state.CourseDescriptionData !== "") {
                        if (this.state.courseVideo !== "" || logo) {
                          this.showLoading();
                          let formData = new FormData();
                          formData.append("title", values.title);
                          formData.append(
                            "industry_id",
                            this.state.industry_id
                          );
                          formData.append(
                            "description",
                            this.state.CourseDescriptionData
                          );
                          formData.append(
                            "content_duration",
                            values.Content_duration
                          );
                          if (values.content_type == "video") {
                            formData.append("file", this.state.courseVideo);
                          } else {
                            formData.append("file", logo);
                          }
                          formData.append("content_type", values.content_type);
                          formData.append("stage_no", this.state.stage_no);
                          this.courseAPI
                            .updateCourse(
                              this.state.editcourseplaceholder.id,
                              formData
                            )
                            .then((res) => {
                              if (res.status) {
                                this.showLoading();
                                this.hideEditModal();
                                this.getCourse(
                                  this.state.industry_id,
                                  this.state.stage_no,
                                  true
                                );
                                onSubmitProps.resetForm();
                              } else {
                                this.setState({
                                  errorMessage: res.message,
                                  showError: true,
                                });
                                this.showLoading();
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
                    validationSchema={editpostSchema}
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
                        <div className=" form-group ClassicEditor ">
                          <label htmlFor="description" className="label">
                            {cmsText.description}
                          </label>
                          <CKEditor
                            editor={ClassicEditor}
                            data={this.state.CourseDescriptionData}
                            onReady={(editor) => { }}
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
                                                                    color:
                                                                        "red",
                                                                }}
                                                            >
                                                                {msg}
                                                            </div>
                                                        )}
                                                    </ErrorMessage>
                                                </div> */}
                        <div className="form-group">
                          <label className="">
                            <Field
                              type="radio"
                              id="content_type"
                              name="content_type"
                              value="image"
                              className="me-2"
                            />
                            {cmsText.text}
                          </label>
                          <label className="ms-4">
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
                          <label className="label" htmlFor="Content_duration">
                            Content duration
                          </label>
                          <Field
                            id="name"
                            name="Content_duration"
                            type="text"
                            className="input"
                          />
                          <ErrorMessage name="Content_duration">
                            {(msg) => (
                              <div
                                style={{
                                  color: "red",
                                }}
                              >
                                {cmsText.required}
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
                            {/* <span className="text-muted info-text">
                                                            {cmsText.sizelimit}
                                                        </span> */}
                            <span className="text-muted info-text document_name mt-4">
                              {this.state.documentname !== ""
                                ? this.state.documentname
                                : cmsText.sizelimitcourse}
                            </span>
                            <input
                              id="contract_doc_video"
                              name="contract_doc_video"
                              type="file"
                              className="d-none"
                              accept="video/mp4,video/x-m4v,video/*"
                              // placeholder={this.state.editcourseplaceholder.title}
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
                                src={logo}
                                alt=""
                                className=""
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/image/errorprofileimg.webp";
                                }}
                                id="preview"
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
                        <div className="d-flex flex-row justify-content-center mt-4 mb-4">
                          <button type="submit" className="btn-yellow w-25">
                            {cmsText.edit}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Deletemodal message={this.state.modalmessage}
                    value={this.state.openmodal}
                    id={this.state.id}
                    deletefun={this.deleteblog} /> */}
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
    theme: state.theme,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Course));
// export default withRouter(Course);

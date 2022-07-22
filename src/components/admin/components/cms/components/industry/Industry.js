import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { withRouter } from "react-router-dom";
import Deletemodal from "../../../../../common_Components/popup/Deletemodal";
import "./styles/Industry.scss";
import { API } from "./utils/API";
import { css } from "@emotion/react";
import { Modal } from "bootstrap";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { connect } from "react-redux";
import { cmsText } from "../../Const_CMS";
import CreateIndustry from "./AddIndustry";
let url;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
const EditSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});
class Industry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industryList: [],
      editindustryplaceholder: "",
      openmodal: false,
      modalmessage: "",
      id: "",
      collegeData: [],
      loading: false,
      errorMessage: "",
      showMessage: "",
      allowPost: false,
      editImage: "",
      videoupload: false,
    };
    url = this.props.match.path;
    this.actionTemplate = this.actionTemplate.bind(this);
    this.nameTemplate = this.nameTemplate.bind(this);
    this.Video = this.Video.bind(this);
    this.statusTemplate = this.statusTemplate.bind(this);
    // this.deleteIndustry = this.deleteIndustry.bind(this);
    this.editblog = this.editblog.bind(this);
    this.industryAPI = new API();
    this.inputOpenFileRef = React.createRef();
    this.modalRef = React.createRef();
    this.editRef = React.createRef();
    this.showOpenFileDlg = this.showOpenFileDlg.bind(this);
    this.industryList = this.industryList.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.showLoading = this.showLoading.bind(this);
  }
  componentDidMount() {
    this.industryList();
  }
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  componentDidUpdate(prevProps) {
    if (this.props.searchValue !== prevProps.searchValue) {
      this.industryList(this.props.searchValue);
    }
  }
  industryList(value) {
    this.industryAPI
      .getIndustries(value)
      .then((res) => {
        if (res.status) {       
          this.setState({ industryList: res.data });
        }
      })
      .catch((err) => {
      });
  }
  editblog(id) {
    this.state.industryList.forEach((item, index) => {
      if (item.id === id) {
        this.setState({
          editindustryplaceholder: item,
          editImage: item.logo,
          // videoupload:
        });
        if (item.description_video) {
          this.setState({
            videoupload: true,
          });
        }
        if (item.logo) {
          this.setState({ allowPost: true });
        }
      }
    });
  }
  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click();
  };
  nameTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-row w-100 overflow-hidden">
          <div className="w-50">
            <img
              src={rowData.logo ? rowData.logo : "/image/errorprofileimg.webp"}
              className="img-fluid table-img me-3"
              alt=""
            />
          </div>
          <div className="w-50 d-flex flex-column ps-2">{rowData.name}</div>
        </div>
      </React.Fragment>
    );
  }
  actionTemplate(rowData) {
    return (
      <React.Fragment>
        <i
          className="fa-solid fa-pen-to-square me-3 text-black cursor-pointer"
          onClick={() => this.showEditModal(rowData.id)}
        ></i>
        {/* <i className="fa-solid fa-trash-can text-black cursor-pointer me-4" onClick={() => this.openDeleteModal(rowData.id)}></i> */}
      </React.Fragment>
    );
  }
  Video(rowData) {
    let videoLink = rowData.description_video.split("?")[0];
    let timeStamp = rowData.description_video.split("?")[1]
    let splitedLink = videoLink.slice(0, -4);
    let type = videoLink.split(".").slice(-1);
    console.log("rowData.description_video",rowData.description_video)
    return (
      <React.Fragment>
        <div className="">        
          <video width="100%" height="100%">            
            <source src={`${splitedLink}.${type}?${timeStamp}`} type="video/mp4" />
          </video>
        </div>
      </React.Fragment>
    );
  }
  changeStatus(i) {
    let industryList = this.state.industryList;
    if (industryList[i].industry_status == "active") {
      industryList[i].industry_status = "inactive";
    } else if (industryList[i].industry_status == "inactive") {
      industryList[i].industry_status = "active";
    }
    let formdata = new FormData();
    formdata.append("industry_status", industryList[i].industry_status);
    this.industryAPI.updateIndustryStatus(industryList[i].id, formdata).then(
      // (res) => 
      // (err) => 
    );
    this.setState({ industryList: industryList });
  }
  statusTemplate(rowData) {
    // 
    let i = this.state.industryList.indexOf(rowData);
    return (
      <React.Fragment>
        <div className="d-flex flex-row justify-content-center">
          <label className="customised-switch">
            <input
              type="checkbox"
              checked={
                this.state.industryList[i].industry_status == "active"
                  ? true
                  : false
              }
              onChange={() => this.changeStatus(i)}
            />
            <span className="customised-slider customised-round"></span>
          </label>
        </div>
      </React.Fragment>
    );
  }
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  changeEditImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size < 20971520) {
        let reader = new FileReader();
        this.setState({ allowPost: true });
        this.setState({ editImage: file.type });
        reader.onload = function () {
          document.getElementById("edit_profile_preview").src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.setState({ errorMessage: "Size Limit Exceeds", showError: true });
        event.target.value = "";
      }
    }
  };
  uploadVideo = (event) => {
    const file = event.target.files[0];
    // 
    if (file) {
      if (file.size < 524288000) {
        this.setState({ videoupload: true });
      } else {
        this.setState({ errorMessage: "Size Limit Exceeds", showError: true });
        event.target.value = "";
      }
    }
  };
  onChange(e) {
    let editindustryplaceholder = this.state.editindustryplaceholder;
    editindustryplaceholder[e.target.name] = e.target.value;
    this.setState({ editindustryplaceholder: editindustryplaceholder });
  }
  hideEditModal = () => {
    const modalEle = this.editRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  showEditModal(id) {
    const modalEle = this.editRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    this.editblog(id);
  }
  closeFeed = (value) => {
    this.setState({ showIndustry: value });
  };
  openFeed = () => {
    this.setState({ showIndustry: true }, () => {
      this.modalRef.current.openmodal();
    });
  };
  render() {
    // 
    return (
      <div className="industry-wrapper">
        <div className="d-flex flex-row align-items-center">
          <div className="main-heading ms-3 mt-1 me-3">
            {cmsText.industrylist}
          </div>
          <div className="add-icon  ms-4" onClick={this.openFeed}>
            <i class="fa-solid fa-plus "></i>
          </div>
        </div>
        <div
          className="table-wrapper w-100"
          style={{ height: "calc(100vh - 380px)" }}
        >
          <DataTable
            value={this.state.industryList}
            className="p-datatable-responsive-demo"
            scrollable
            scrollHeight="100%"
          >
            <Column
              field="name"
              header={cmsText.name}
              body={this.nameTemplate}
            ></Column>
            <Column
              field="student_count"
              header={cmsText.numberofstudent}
            ></Column>
            <Column
              field="video"
              header={cmsText.video}
              body={this.Video}
            ></Column>
            <Column
              field="status"
              header={cmsText.status}
              body={this.statusTemplate}
            ></Column>
            <Column
              field="id"
              header={cmsText.action}
              body={this.actionTemplate}
            ></Column>
          </DataTable>
        </div>
        {this.state.showIndustry ? (
          <CreateIndustry
            closefeed={this.closeFeed}
            loading={this.showLoading}
            industryList={this.industryList}
            ref={this.modalRef}
            theme={this.props.theme.is_dark}
          />
        ) : null}
        <div
          className="modal fade"
          id="editIndustryModal"
          tabindex="-1"
          ref={this.editRef}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div class="modal-header">
                <h4 className="ms-auto ps-3">{cmsText.editindustry}</h4>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  onClick={() => this.hideEditModal()}
                ></i>
              </div>
              <div className="modal-body">
                <div className="form-wrapper-2 ">
                  <Formik
                    initialValues={{
                      name: this.state.editindustryplaceholder.name,
                      description:
                        this.state.editindustryplaceholder.description,
                      contract_doc: "",
                      // contract_doc_video: ""
                      // .editindustryplaceholder
                      // .description_video,
                    }}
                    enableReinitialize={true}
                    onSubmit={(values, onSubmitProps) => {
                      // 
                      let image;
                      let videoObject =
                        document.getElementById("contract_doc_video").files[0];
                      //             if (
                      //                 values.contract_doc_video != null
                      //             ) {
                      //                 values.contract_doc_video = videoObject;
                      // }
                      if (
                        document.getElementById("contract_logo").files[0] !=
                        null
                      ) {
                        image =
                          document.getElementById("contract_logo").files[0];
                      }
                      if (this.state.videoupload) {
                        if (this.state.allowPost) {
                          this.showLoading();
                          let formData = new FormData();
                          formData.append("name", values.name);
                          formData.append("description", values.description);
                          formData.append("description_video", videoObject);
                          formData.append("logo", image);
                          formData.append("industry_status", "active");
                          this.industryAPI
                            .editIndustry(
                              this.state.editindustryplaceholder.id,
                              formData
                            )
                            .then((res) => {
                              // 
                              this.showLoading();
                              if (res.status) {
                                this.hideEditModal();
                                this.industryList();
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
                              }
                            });
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
                    validationSchema={EditSchema}
                  >
                    <Form className="customFormAdmin px-3 ">
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
                      <div className="form-group d-flex flex-row align-items-center">
                        <label
                          htmlFor="contract_doc_video"
                          className="video_upload"
                        >
                          <div className="add_video_icon">
                            <i class="fa-solid fa-plus "></i>
                          </div>
                          <div className="p">{cmsText.content}</div>
                          {this.state.videoupload ? (
                            <span className="text-success">Uploaded</span>
                          ) : (
                            <span>Accept file :mp4 and mov up to 500MB</span>
                          )}
                        </label>
                        <Field
                          id="contract_doc_video"
                          name="contract_doc_video"
                          type="file"
                          className="d-none"
                          accept="video/mp4,video/x-m4v,video/*"
                          onChange={this.uploadVideo}
                        />
                      </div>
                      <div className="form-group d-flex flex-row align-items-center">
                        <div className="logo-upload">
                          <img
                            src={this.state.editImage}
                            alt=""
                            className=""
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/image/errorprofileimg.webp";
                            }}
                            id="edit_profile_preview"
                          />
                        </div>
                        <label
                          className="mx-4 cursor-pointer"
                          htmlFor="contract_logo"
                        >
                          {cmsText.uploadlogo}
                        </label>
                        <span className="text-muted info-text">
                          {cmsText.sizelimitidustry}
                        </span>
                        <input
                          id="contract_logo"
                          name="contract_doc"
                          type="file"
                          className="d-none"
                          accept=".png, .jpg, .jpeg"
                          onChange={this.changeEditImage}
                        />
                        <ErrorMessage name="contract_doc">
                          {(msg) => <div>{msg}</div>}
                        </ErrorMessage>
                      </div>
                      <div className="d-flex flex-row justify-content-center mt-3 mb-4">
                        <button type="submit" className="btn-yellow w-25">
                          {cmsText.save}
                        </button>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Deletemodal
          message={this.state.modalmessage}
          value={this.state.openmodal}
          id={this.state.id}
          deletefun={this.deleteIndustry}
        />
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Industry));

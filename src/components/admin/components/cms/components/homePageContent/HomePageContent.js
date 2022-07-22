import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import {
  withRouter,
} from "react-router-dom";
import { BlogAPI } from "./utils/Api";
import { Modal } from "bootstrap";
import "./styles/HomePageContent.scss";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Deletemodal from "../../../../../common_Components/popup/Deletemodal";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import CreateBlog from "./CreateBlog";
import { connect } from "react-redux";
import { cmsText } from "../../Const_CMS";
const editpostSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});
let url;
let logo;
class HomePageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogList: {},
      editblogplaceholder: "",
      text1:
        "<div>Hello World!</div><div>PrimeReact <b>Editor</b> Rocks</div><div><br></div>",
      text2: "",
      TermsandCondition: "",
      showTermsandCondition: "",
      privacypolicy: "",
      showprivacypolicy: "",
      openmodal: false,
      modalmessage: "",
      id: "",
      showPreview: false,
      showEditPreview: false,
      editImage: "",
      errorMessage: "",
      showMessage: "",
      allowPost: false,
      showBlog: false,
      editTermsandcondition: false,
      editPrivacyPolicy: false,
      lock: false,
      studentCount: "",
      studentResultsLength: "",
      page: 1,
    };
    url = this.props.match.path;
    this.contentTemplate = this.contentTemplate.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
    this.editblog = this.editblog.bind(this);
    this.deleteblog = this.deleteblog.bind(this);
    this.sendPrivacypolicy = this.sendPrivacypolicy.bind(this);
    this.blogList = this.blogList.bind(this);
    this.BlogAPI = new BlogAPI();
    this.modalRef = React.createRef();
    this.modalEditRef = React.createRef();
    this.createBlog = React.createRef();
    this.PrivacyPolicy = React.createRef();
    this.TermsandConditioneditor = React.createRef();
    this.showLoading = this.showLoading.bind(this);
    this.showTermsandcondition = this.showTermsandcondition.bind(this);
    this.clearTermAndCondition = this.clearTermAndCondition.bind(this);
    this.clearPrivacyPolicy = this.clearPrivacyPolicy.bind(this);
    this.showPrivacyPolicy = this.showPrivacyPolicy.bind(this);
    this.hideEditModal = this.hideEditModal.bind(this);
    this.scrollLoader = this.scrollLoader.bind(this);
  }
  componentDidMount() {
    if (typeof axios.defaults.headers.common["Authorization"] === "undefined") {
      axios.defaults.headers.common["Authorization"] =
        "Token " + localStorage.getItem("passion_token");
    }
    this.termsAndCondition();
    this.privatePolicy();
    this.blogList();
    this.scrollLoader();
  }
  scrollLoader() {
    let scroller = document.getElementsByClassName(
      "p-datatable-scrollable-body"
    )[0];
    let scrollerBody = document.getElementsByClassName(
      "p-datatable-scrollable-body-table"
    )[0];
    scroller.addEventListener("scroll", () => {

      if (
        scroller.scrollTop >
        (scrollerBody.clientHeight - scroller.clientHeight) * 0.9
      ) {
        if (!this.state.lock && this.state.blogList.next) {
          this.setState({ lock: true }, () => {
            // if (this.state.studentCount / this.state.studentResultsLength > this.state.page) {
            this.setState({ page: this.state.page + 1 }, () => {
              this.blogList();
            });
            // }
          });
        }
      }
    });
  }
  blogList(reset = false) {
    let list;
    this.BlogAPI.getBlogList(this.state.page).then((res) => {
      if (Object.keys(this.state.blogList).length !== 0 && !reset) {
        list = this.state.blogList.results;
        list.push(...res.data.results);
        res.data.results = list;
        // 
        this.setState({ blogList: res.data });
      } else {
        this.setState({
          blogList: res.data,
          studentResultsLength: res.data.results.length,
          studentCount: res.data.count,
        });
      }
      this.setState({ lock: false });
    });
  }
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  termsAndCondition = () => {
    this.BlogAPI.getTermsandCondition().then((res) => {
      if (res.status) {
        if (res.data.terms != null) {
          this.setState({ TermsandCondition: res.data.terms });
          this.setState({
            showTermsandCondition: res.data.terms.replace(/<[^>]+>/g, ""),
          });
        }
      }
    });
  };
  privatePolicy = () => {
    this.BlogAPI.getPrivacyPolicy().then((data) => {
      if (data.status) {
        if (data.data.policy != null) {
          this.setState({ privacypolicy: data.data.policy });
          this.setState({
            showprivacypolicy: data.data.policy.replace(/<[^>]+>/g, ""),
          });
        }
      }
    });
  };
  editblog(id) {
    this.showEditModal();
    this.state.blogList.results.forEach((item, index) => {
      if (item.id === id) {
        this.setState({ editblogplaceholder: item });
        if (item.image) {
          // 
          this.setState({ editImage: item.image, showEditPreview: true });
        }
      }
    });
  }
  refreshBlogList = () => {
    this.setState({ page: 1 }, () => {
      this.blogList(true);
    });
  };
  openDeleteModal = (id) => {
    this.setState({
      openmodal: true,
      modalmessage: "Are you sure you want to delete this Blog",
      id: id,
    });
  };
  deleteblog(value, id, answer) {
    this.setState({
      openmodal: value,
    });
    if (answer === "yes") {
      this.BlogAPI.delete(id)
        .then((res) => {
          this.setState({ page: 1 }, () => {
            this.blogList(true);
          });
        })
    }
  }
  sendTermsandCondition() {
    this.showLoading();
    let formData = new FormData();
    formData.append("terms", this.state.TermsandCondition);
    this.BlogAPI.postTermsAndCondition(formData).then((res) => {
      if (res.status) {
        this.hideTermsandcondition();
        this.termsAndCondition();
        this.showLoading();
      } else {
        this.hideTermsandcondition();
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
    });
  }
  sendPrivacypolicy() {
    this.showLoading();
    let formData = new FormData();
    formData.append("policy", this.state.privacypolicy);
    this.BlogAPI.postPrivacypolicy(formData).then((res) => {
      this.showLoading();
      if (res.status) {
        this.privatePolicy();
        this.hidePrivacyPolicy();
      } else {
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
    });
  }
  contentTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-row">
          <div className="w-100">
            <img src={rowData.image} className="img-fluid rounded" alt="" />
          </div>
        </div>
      </React.Fragment>
    );
  }
  actionTemplate(rowData) {
    return (
      <React.Fragment>
        <i
          className="fa-solid fa-pen-to-square me-3 text-black cursor-pointer"
          onClick={() => this.editblog(rowData.id)}
        ></i>
        <i
          className="fa-solid fa-trash-can text-black cursor-pointer me-4"
          onClick={() => this.openDeleteModal(rowData.id)}
        ></i>
      </React.Fragment>
    );
  }
  clearFeild = () => {
    document.getElementById("description").value = "";
    document.getElementById("title").value = "";
    this.setState({ showPreview: false });
  };
  clearTermAndCondition() {
    if (this.state.editTermsandcondition) {
      this.hideTermsandcondition();
    } else {
      this.setState({ TermsandCondition: "" });
      this.hideTermsandcondition();
    }
  }
  clearPrivacyPolicy() {
    if (this.state.editPrivacyPolicy) {
      this.hidePrivacyPolicy();
    } else {
      this.setState({ privacypolicy: "" });
      this.hidePrivacyPolicy();
    }
  }
  hideModal = () => {
    const modalEle = this.modalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
    document.getElementById("adddescription").value = "";
    document.getElementById("addtitle").value = "";
    // 
    this.setState({ showPreview: false });
  };
  showTermsandcondition(value) {
    const modalEle = this.TermsandConditioneditor.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    if (value == "edit") {
      this.setState({ editTermsandcondition: true });
    }
  }
  hideTermsandcondition = () => {
    const modalEle = this.TermsandConditioneditor.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  hidePrivacyPolicy = () => {
    const modalEle = this.PrivacyPolicy.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  showPrivacyPolicy(value) {
    const modalEle = this.PrivacyPolicy.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    if (value == "edit") {
      this.setState({ editPrivacyPolicy: true });
    }
  }
  showModal = () => {
    const modalEle = this.modalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideEditModal() {
    const modalEle = this.modalEditRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  }
  showEditModal = () => {
    const modalEle = this.modalEditRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    this.setState({ showEditPreview: false });
  };
  changeImage = (event) => {
    this.setState({ showPreview: true });
    const file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      this.setState({ allowPost: true });
      reader.onload = function () {
        document.getElementById("profile_preview").src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };
  changeEditImage = (event) => {
    const file = event.target.files[0];
    // 
    if (file) {
      if (file.size < 20971520) {
        this.setState({ showEditPreview: true });
        let reader = new FileReader();
        reader.onload = function () {
          document.getElementById("edit_profile_preview").src = reader.result;
          // 
        };
        reader.readAsDataURL(file);
      } else {
        this.setState({ errorMessage: "Size Limit Exceeds", showError: true });
      }
    }
  };
  closeFeed = (value) => {
    this.setState({ showBlog: value });
  };
  openFeed = () => {
    this.setState({ showBlog: true }, () => {
      this.createBlog.current.openmodal();
    });
  };
  closeModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  render() {
    // 
    return (
      <div className="homepage-wrapper">
        <div className="blog-wrapper">
          <div className="d-flex flex-row justify-content-between align-items-center px-3 mt-2">
            <h5 className="Gilroy-Medium mt-2">{cmsText.bloglist}</h5>
            <button className="btn-yellow w-25" onClick={this.openFeed}>
              {cmsText.create}
            </button>
          </div>
          {/* style={{ height: "calc(100% - 400px)" }} */}
          <div
            className="blog-table-wrapper"
            style={{ height: "calc(100% - 100px)" }}
          >
            <DataTable
              value={this.state.blogList.results}
              scrollable
              scrollHeight="100%"
            >
              <Column
                field="name"
                header={cmsText.image}
                body={this.contentTemplate}
              ></Column>
              <Column field="title" header={cmsText.title}></Column>
              <Column field="description" header={cmsText.description}></Column>
              <Column field="id" body={this.actionTemplate}></Column>
            </DataTable>
          </div>
        </div>
        <div className="paged-content-wrapper">
          <div className="pc-wrapper">
            <div className="title">{cmsText.termsandcondition}</div>
            <div className="content mt-3">
              <div className="content-text">
                {this.state.showTermsandCondition}
              </div>
              {this.state.showTermsandCondition === "" ? (
                <div className="d-flex flex-row justify-content-end align-content-end mt-1 me-3">
                  <button
                    className="btn-yellow"
                    onClick={this.showTermsandcondition}
                  >
                    {cmsText.add}
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-row justify-content-end align-content-end mt-1 me-3">
                  <button
                    className="btn-yellow"
                    onClick={() => this.showTermsandcondition("edit")}
                  >
                    {cmsText.edit}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="pc-wrapper mt-3">
            <div className="title">{cmsText.privacypolicy}</div>
            <div className="content mt-3">
              <div className="content-text">
                {" "}
                {this.state.showprivacypolicy}
              </div>
              {this.state.showprivacypolicy === "" ? (
                <div className="d-flex flex-row justify-content-end align-content-end mt-1 me-3">
                  <button
                    onClick={this.showPrivacyPolicy}
                    className="btn-yellow"
                  >
                    {cmsText.add}
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-row justify-content-end align-content-end mt-1 me-3">
                  <button
                    onClick={() => this.showPrivacyPolicy("edit")}
                    className="btn-yellow"
                  >
                    {cmsText.edit}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {this.state.showBlog ? (
          <CreateBlog
            closefeed={this.closeFeed}
            loading={this.showLoading}
            blogList={this.refreshBlogList}
            ref={this.createBlog}
            theme={this.props.theme.is_dark}
          />
        ) : null}
        <div
          className="modal fade"
          id="editBlogModal"
          tabindex="-1"
          ref={this.modalEditRef}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div class="modal-header">
                <h4 className="ms-auto ps-3">{cmsText.editblog}</h4>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={this.hideEditModal}
                ></i>
              </div>
              <div className="modal-body">
                <div className="form-wrapper-2 mt-4">
                  <Formik
                    initialValues={{
                      title: this.state.editblogplaceholder.title,
                      description: this.state.editblogplaceholder.description,
                      // image: '',
                    }}
                    enableReinitialize={true}
                    onSubmit={(values, onSubmitProps) => {
                      let data = values;
                      this.showLoading();
                      let image;
                      logo = document.getElementById("video_upload").files[0];
                      if (
                        document.getElementById("video_upload").files[0] != null
                      ) {
                        image =
                          document.getElementById("video_upload").files[0];
                      }
                      let formData = new FormData();
                      formData.append("title", data["title"]);
                      formData.append("description", data["description"]);
                      formData.append("image", image);
                      this.BlogAPI.editBlog(
                        this.state.editblogplaceholder.id,
                        formData
                      ).then((res) => {
                        document.getElementById("video_upload").value = "";
                        if (res.status) {
                          this.setState({ page: 1 }, () => {
                            this.blogList(true);
                          });
                          this.hideEditModal();
                          this.showLoading();
                        } else {
                          this.showLoading();
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
                    }}
                    validationSchema={editpostSchema}
                  >
                    <Form className="customFormAdmin px-3 mt-4">
                      <div className="form-group">
                        <label className="label" htmlFor="title">
                          {cmsText.title}
                        </label>
                        <Field
                          id="title"
                          name="title"
                          type="text"
                          className="input"
                          maxlength="50"
                        // placeholder={this.state.editblogplaceholder.title}
                        />
                        <ErrorMessage name="title">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                      <div className="form-group">
                        <label htmlFor="description" className="label">
                          {cmsText.bodycontent}
                        </label>
                        <Field
                          id="description"
                          name="description"
                          as="textarea"
                          className="input-cms"
                          maxlength="500"
                        // placeholder={this.state.editblogplaceholder.description}
                        />
                        <ErrorMessage name="description">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                      <div className="form-group d-flex flex-row align-items-center">
                        <Field
                          id="video_upload"
                          name="video_upload"
                          type="file"
                          className="d-none"
                          accept=".png,.jpg,.jpeg"
                          onChange={this.changeEditImage}
                        />
                        <label htmlFor="video_upload" className="video_upload">
                          <div className="add_video_icon">
                            <i class="fa-solid fa-plus "></i>
                          </div>
                          <div className="p">{cmsText.content}</div>
                          <span>{cmsText.imagesize}</span>
                        </label>
                        {this.state.showEditPreview ? (
                          <div className="preview_image ms-4 p-2">
                            <img
                              src={this.state.editImage}
                              alt=""
                              className="img-fluid"
                              id="edit_profile_preview"
                            />
                          </div>
                        ) : null}
                      </div>
                      <div className="d-flex flex-row justify-content-center mt-5 mb-4">
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
        <div
          className="modal fade"
          id="TermsandConditioneditor"
          tabindex="-1"
          ref={this.TermsandConditioneditor}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className=" editor modal-content">
              <div class="modal-header">
                <h4 className="ms-auto ps-3">{cmsText.termsandcondition}</h4>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  onClick={this.clearTermAndCondition}
                ></i>
              </div>
              <div className="modal-body">
                <div className=" form-wrapper-2 mt-4">
                  <CKEditor
                    editor={ClassicEditor}
                    data={this.state.TermsandCondition}
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
                      this.setState({ TermsandCondition: data });
                      // 
                    }}
                  />
                  <div className="d-flex flex-row justify-content-center mt-5 mb-4">
                    <button
                      className="btn-yellow w-25 "
                      data-bs-dismiss="modal"
                      onClick={() => this.sendTermsandCondition()}
                    >
                      {cmsText.save}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="editorprivacypolicy"
          tabindex="-1"
          ref={this.PrivacyPolicy}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className=" editor modal-content">
              <div class="modal-header">
                <h4 className="ms-auto ps-3">{cmsText.privacypolicy}</h4>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  onClick={this.clearPrivacyPolicy}
                ></i>
              </div>
              <div className="modal-body">
                <div className="  form-wrapper-2 mt-4">
                  <CKEditor
                    editor={ClassicEditor}
                    data={this.state.privacypolicy}
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
                      this.setState({ privacypolicy: data });
                    }}
                  />
                  <div className="d-flex flex-row justify-content-center mt-5 mb-4">
                    <button
                      className="btn-yellow w-25"
                      data-bs-dismiss="modal"
                      onClick={() => this.sendPrivacypolicy()}
                    >
                      {cmsText.save}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Deletemodal
          message={this.state.modalmessage}
          value={this.state.openmodal}
          id={this.state.id}
          deletefun={this.deleteblog}
        />
        <ErrorModal
          message={this.state.errorMessage}
          value={this.state.showError}
          closeModal={this.closeModal}
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
)(withRouter(HomePageContent));

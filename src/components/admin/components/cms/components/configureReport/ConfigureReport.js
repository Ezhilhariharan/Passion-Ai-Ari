import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { withRouter, } from "react-router-dom";
import Deletemodal from "../../../../../common_Components/popup/Deletemodal";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import "./styles/ConfigureReport.scss";
import { API } from "./utils/API";
import { Modal } from "bootstrap";
import { cmsText } from "../../Const_CMS";
import { connect } from "react-redux";
import AddQuestion from "../configureReport/AddQuestion";
import AddTopicLearned from "../configureReport/AddTopicLearned";
import { configuretext } from "./const/Const_config_report";
const editQuestion = Yup.object().shape({
  editcontent: Yup.string().required("Required"),
});
const editTopicLearned = Yup.object().shape({
  editcontent: Yup.string().required("Required"),
});
let url;
class ConfigureReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configurereportList: [],
      industrylist: [],
      topiclearnt: "",
      industry_id: 1,
      editcourseplaceholder: "",
      openmodal: false,
      modalmessage: "",
      id: "",
      industry_value: 1,
      showbtn: false,
      topiclearntId: "",
      renderQuestionModal: false,
      renderTopicLearned: false,
    };
    url = this.props.match.path;
    this.actionTemplate = this.actionTemplate.bind(this);
    this.nameTemplate = this.nameTemplate.bind(this);
    this.Delete = this.Delete.bind(this);
    this.getquestionlist = this.getquestionlist.bind(this);
    this.Configurereport = new API();
    this.editcourse = this.editcourse.bind(this);
    this.deleteblog = this.deleteblog.bind(this);
    this.addQuestion = React.createRef();
    this.editQuestion = React.createRef();
    this.addTopicLearned = React.createRef();
    this.editTopicLearned = React.createRef();
    this.showLoading = this.showLoading.bind(this);
    this.hideeditTopicLearned = this.hideeditTopicLearned.bind(this);
  }
  componentDidMount() {
    this.topicLearnt(1);
    this.initialRender();
  }
  initialRender = () => {
    this.Configurereport.getIndustryList()
      .then((res) => {
        // 
        if (res.status) {
          this.setState({ industrylist: res.data });
        } else {
          this.setState({ industrylist: [] });
        }
      })
      .catch((err) => {
      });
    this.Configurereport.getQuestion(1)
      .then((res) => {
        // 
        if (res.status) {
          this.setState({ configurereportList: res.data });
        }
      })
      .catch((err) => {
      });
  };
  QuestionList = (id) => {
    this.Configurereport.getQuestion(id)
      .then((res) => {
        if (res.status) {
          this.setState({ configurereportList: res.data });
        }
      })
      .catch((err) => {
      });
  };
  topicLearnt = (industry_id) => {
    this.setState({ showbtn: true });
    this.Configurereport.getTopicLearned(industry_id)
      .then((res) => {       
        if (res.status) {        
          if (res.data.length) {
            let currentItem = Object.assign({}, res.data[0]);
            console.log("currentItem", currentItem)
            this.setState({
              topiclearnt: currentItem.content,
              topiclearntId: currentItem.id,
            });
          } else {
            this.setState({
              topiclearnt: "",
              topiclearntId: "",
            });
          }
        } else {
          this.setState({ topiclearnt: "" });
        }
      })     
  };
  nameTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-row">
          <div className="w-100">
            <h6>{rowData.question}</h6>
          </div>
        </div>
      </React.Fragment>
    );
  }
  actionTemplate(rowData) {
    return (
      <React.Fragment>
        <i
          className="fa-solid fa-pen-to-square me-3 text-warning cursor-pointer"
          onClick={() => this.editcourse(rowData.id)}
        ></i>
        <i
          className="fa-solid fa-trash-can text-black cursor-pointer"
          onClick={() => this.openDeleteModal(rowData.id)}
        ></i>
      </React.Fragment>
    );
  }
  editcourse(id) {
    this.showEditQuestionModal();
    this.state.configurereportList.forEach((item, index) => {
      if (item.id === id) {
        // 
        this.setState({ editcourseplaceholder: item });
      }
    });
  }
  openDeleteModal = (id) => {
    this.setState({
      openmodal: true,
      modalmessage: "Are you sure you want to delete this industry",
      id: id,
    });
  };
  deleteblog(value, id, answer) {
    this.setState({
      openmodal: value,
    });
    if (answer === "yes") {
      this.Configurereport.deleteQuestion(id)
        .then((res) => {
          this.Configurereport.getQuestion(this.state.industry_value)
            .then((res) => {
              if (res.status) {
                this.setState({
                  configurereportList: res.data,
                });
              } else {
                this.setState({
                  configurereportList: [],
                });
              }
            })
            .catch((err) => {
            });
        })
        .catch((err) => {
          return [];
        });
    }
  }
  Delete(data) {
    this.Configurereport.deleteTopicLearned(data);
  }
  getquestionlist(event) {
    this.setState({ industry_id: event.target.value });
    this.setState({ industry_value: event.target.value });
    this.Configurereport.getQuestion(event.target.value)
      .then((res) => {
        if (res.status) {
          this.setState({ configurereportList: res.data });
        } else {
          this.setState({ configurereportList: [] });
        }
      })
      .catch((err) => {
      });
    this.topicLearnt(event.target.value);
  }
  clearFeildTopicLearnt = () => {
    this.hideaddTopicLearned();
    document.getElementById("question").value = "";
  };
  hideEditQuestionModal = () => {
    const modalEle = this.editQuestion.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  showEditQuestionModal = () => {
    const modalEle = this.editQuestion.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideaddTopicLearned = () => {
    const modalEle = this.addTopicLearned.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  showaddTopicLearned = () => {
    const modalEle = this.addTopicLearned.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideeditTopicLearned() {
    const modalEle = this.editTopicLearned.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  }
  showeditTopicLearned = () => {
    const modalEle = this.editTopicLearned.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  closeFeed = (value) => {
    this.setState({ renderQuestionModal: value });
  };
  openFeed = () => {
    this.setState({ renderQuestionModal: true }, () => {
      this.addQuestion.current.openmodal();
    });
  };
  closeAddtopicLearnt = (value) => {
    this.setState({ renderTopicLearned: value });
  };
  openAddtopicLearnt = () => {
    this.setState({ renderTopicLearned: true }, () => {
      this.addTopicLearned.current.openmodal();
    });
  };
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  render() {
    console.log("topiclearnt", this.state.topiclearnt)
    return (
      <div className="report-wrapper">
        <div className="q-wrapper pt-2">
          <div className="d-flex flex-row justify-content-between">
            <div className="customFormAdmin  mt-2">
              <div className="form-group  me-5">
                <select
                  className="custom-select-1"
                  onChange={this.getquestionlist}
                >
                  {this.state.industrylist.map((option) => (
                    <option value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="btn-yellow mt-3" onClick={this.openFeed}>
              {cmsText.create}
            </button>
          </div>
          <div
            className="table-wrapper"
            style={{ height: "calc(100vh - 420px)" }}
          >
            <DataTable
              value={this.state.configurereportList}
              className="p-datatable-responsive-demo"
              scrollable
              scrollHeight="100%"
            >
              <Column
                field="question"
                header={cmsText.question}
                body={this.nameTemplate}
              ></Column>
              <Column
                field="id"
                header={cmsText.action}
                body={this.actionTemplate}
              ></Column>
            </DataTable>
          </div>
        </div>
        <div className="r-wrapper py-3 ">
          <div className="d-flex flex-row justify-content-between align-items-center">
            <h3 className="Gilroy-Medium">{configuretext.TopicsLearnt}</h3>
            {this.state.topiclearnt === "" ? (
              <button
                className="btn-yellow"
                onClick={() => this.openAddtopicLearnt()}
              >
                {cmsText.add} <i className="ms-2 fal fa-plus-circle"></i>
              </button>
            ) : (
              <button
                className="btn-yellow"
                onClick={() => this.showeditTopicLearned()}
              >
                {cmsText.edit}
                <i className=" ms-2 fa-regular fa-pen-to-square"></i>
              </button>
            )}
          </div>
          <div className="descriptive-text mt-3 ">{this.state.topiclearnt}</div>
        </div>
        {this.state.renderQuestionModal ? (
          <AddQuestion
            closefeed={this.closeFeed}
            loading={this.showLoading}
            QuestionList={this.QuestionList}
            ref={this.addQuestion}
            theme={this.props.theme.is_dark}
            industry_id={this.state.industry_id}
          />
        ) : null}
        {this.state.renderTopicLearned ? (
          <AddTopicLearned
            closefeed={this.closeFeed}
            loading={this.showLoading}
            QuestionList={this.topicLearnt}
            ref={this.addTopicLearned}
            theme={this.props.theme.is_dark}
            industry_id={this.state.industry_id}
          />
        ) : null}
        <div
          class="modal fade"
          id="editQuestionModal"
          tabindex="-1"
          ref={this.editQuestion}
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 className="ms-4">{cmsText.editquestion}</h4>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  onClick={() => this.hideEditQuestionModal()}
                ></i>
              </div>
              <div class="modal-body">
                <div className="form-wrapper-2 ">
                  <Formik
                    initialValues={{
                      editcontent: this.state.editcourseplaceholder.question,
                    }}
                    enableReinitialize={true}
                    onSubmit={(values, onSubmitProps) => {
                      // 
                      this.showLoading();
                      let formData = new FormData();
                      formData.append("question", values.editcontent);
                      formData.append("question_type", "text");
                      formData.append("industry_id", this.state.industry_id);
                      this.Configurereport.editQuestion(
                        formData,
                        this.state.editcourseplaceholder.id
                      ).then((res) => {
                        if (res.status) {
                          this.hideEditQuestionModal();
                          this.showLoading();
                          this.Configurereport.getQuestion(
                            this.state.industry_id
                          ).then((res) => {
                            if (res.status) {                           
                              this.setState({
                                configurereportList: res.data,
                              });
                            } else {
                              this.setState({
                                configurereportList: [],
                              });
                            }
                          });
                        } else {
                          this.setState({
                            errorMessage: res.message,
                            showError: true,
                          });
                          this.showLoading();
                        }
                      });
                    }}
                    validationSchema={editQuestion}
                  >
                    <Form className="customFormAdmin px-3 mt-4">
                      <div className="form-group">
                        <label className="label" htmlFor="question">
                          {cmsText.editquestion}
                        </label>
                        <Field
                          id="content"
                          name="editcontent"
                          as="textarea"
                          className="input-cms"
                          maxlength="100"
                        />
                        <ErrorMessage name="editcontent">
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
                      <div className="d-flex flex-row justify-content-center mb-5">
                        <button
                          type="submit"
                          className="btn-yellow w-50"
                          data-bs-dismiss="modal"
                        >
                          {cmsText.edit}
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
          id="edittopiclearnedModal"
          tabindex="-1"
          ref={this.editTopicLearned}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div class="modal-header">
                <h4 className="ms-auto ps-3">{cmsText.edittopiclearnt}</h4>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  onClick={() => this.hideeditTopicLearned()}
                ></i>
              </div>
              <div className="modal-body">
                <div className="form-wrapper-2 ">
                  <Formik
                    initialValues={{
                      editcontent: this.state.topiclearnt,
                    }}
                    enableReinitialize={true}
                    onSubmit={(values, onSubmitProps) => {
                      this.showLoading();
                      let formData = new FormData();
                      formData.append("content", values.editcontent);
                      this.Configurereport.updateTopicLearned(
                        this.state.topiclearntId,
                        formData
                      ).then((res) => {
                        if (res.status) {
                          this.showLoading();
                          this.topicLearnt(this.state.industry_id);
                          this.hideeditTopicLearned();
                        } else {
                          this.setState({
                            errorMessage: res.message,
                            showError: true,
                          });
                          this.showLoading();
                        }
                      });
                    }}
                    validationSchema={editTopicLearned}
                  >
                    <Form className="customFormAdmin px-3 mt-4">
                      <div className="form-group">
                        <label className="label" htmlFor="question">
                          {cmsText.topiclearnt}
                        </label>
                        <Field
                          id="question"
                          name="editcontent"
                          as="textarea"
                          className="input-cms"
                        />
                        <ErrorMessage name="editcontent">
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
                      <div className="d-flex flex-row justify-content-center">
                        <button
                          type="submit"
                          className="btn-yellow w-50"
                          data-bs-dismiss="modal"
                        >
                          {cmsText.edit}
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
          deletefun={this.deleteblog}
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
)(withRouter(ConfigureReport));

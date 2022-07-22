import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Header from "../../../../navbar/header/Header";
import React, { Component } from "react";
import { API } from "../api/Get";
import { postAPI } from "../api/Post";
import { patchAPI } from "../api/patch";
import { deleteAPI } from "../api/Delete";
import { NavLink, withRouter } from "react-router-dom";
import Deletemodal from "../../../../common_Components/popup/Deletemodal";
import { connect } from "react-redux";
import { Department_text } from "../const/Department_const_text";
import Department_Create from "./Department_Create";
import { encode as base64_encode } from "base-64";
import ErrorModal from "../../../../common_Components/popup/ErrorModalpoup";
let url, i;
class Department extends Component {
  constructor(props) {
    super(props);
    url = this.props.match.path;
    this.state = {
      departmentlist: [],
      showpiechart: false,
      openmodal: false,
      modalmessage: "",
      id: "",
      editcollegeadmindetails: "",
      showCreateModal: false,
      showModal: false,
      showHidePassword: false,
    };
    this.departmentAPI = new API();
    this.adddepartmentAPI = new postAPI();
    this.mentorstatusAPI = new patchAPI();
    this.deleteAPI = new deleteAPI();
    this.actionTemplate = this.actionTemplate.bind(this);
    this.statusTemplate = this.statusTemplate.bind(this);
    this.deleteDetails = this.deleteDetails.bind(this);
    this.createModalRef = React.createRef();
    this.showLoading = this.showLoading.bind(this);
    this.addDepartment = this.addDepartment.bind(this);
  }
  componentDidMount() {
    this.departmentList();
  }
  departmentList = () => {
    this.departmentAPI.getDepartmentList().then((res) => {      
      if (res.status) {
        this.setState({ collegeadmindetails: res.data });
      } else {
      }
    });
  };
  openDeleteModal = (id) => {
    this.setState({
      openmodal: true,
      modalmessage: "Are you sure you want to delete this department",
      id: id,
    });
  };
  closeDepartment = (value) => {    
    this.setState({ showCreateModal: value });
  };
  addDepartment() {
        this.setState({ showCreateModal: true, showModal: true });
  }
  documentToast = () => {
    this.props.showtoast({
      text: "Department Created Successfully ",
      time: new Date().getTime(),
    });
  };
  editToast = () => {
    this.props.showtoast({
      text: "Department updated Successfully ",
      time: new Date().getTime(),
    });
  };
  deleteDocument = () => {
    this.props.showtoast({
      text: "Department Deleted Successfully ",
      time: new Date().getTime(),
    });
  };
  deleteDetails(value, id, answer) {    
    this.setState({
      openmodal: value,
    });
    if (answer === "yes") {
      this.deleteAPI.deleteDepartment(id).then((res) => {        
        if (res.status) {
          this.deleteDocument();
          this.departmentList();
        }
      });
    }
  }
  changeStatus(i) {   
        let collegeadmindetails = this.state.collegeadmindetails;
    if (collegeadmindetails[i].user_status === "active") {
      collegeadmindetails[i].user_status = "inactive";
    } else if (collegeadmindetails[i].user_status === "inactive") {
      collegeadmindetails[i].user_status = "active";
    }    
    let formData = new FormData();
    formData.append("status", collegeadmindetails[i].user_status);
    this.mentorstatusAPI
      .updateMentorStatus(collegeadmindetails[i].id, formData)
      // .then((res) => 
      // .catch((err) => 
    this.setState({ collegeadmindetails: collegeadmindetails });
    this.departmentAPI.getDepartmentList();
  }
  actionTemplate(rowData) {
    return (
      <React.Fragment>
        {rowData.user_status == "deleted" || !rowData.username ? null : (
          <div className="d-flex flex-row w-100">
            <div data-bs-toggle="modal" data-bs-target="#editDepartmentModal">
              <i
                class="fa-solid fa-pen-to-square me-4 text-black cursor-pointer"
                onClick={() => this.editblog(rowData.id)}
              ></i>
            </div>           
            <i
              className="fa-solid fa-trash-can text-black cursor-pointer me-4 mt-1"
              onClick={() => this.openDeleteModal(rowData.id)}
            ></i>
            <NavLink to={`/admin/department/info/${rowData.id}`}>
              <i className="fa-solid fa-chevron-right yellow-arrow cursor-pointer"></i>
            </NavLink>
          </div>
        )}
      </React.Fragment>
    );
  }
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  editblog = (id) => {
    this.state.collegeadmindetails.forEach((item, index) => {
      if (item.id === id) {
        this.setState({ editcollegeadmindetails: item });
      }
    });
  };
  statusTemplate(rowData) {
    // 
    i = this.state.collegeadmindetails.indexOf(rowData);
    if (rowData.user_status == "deleted") {
      return (
        <React.Fragment>
          <div className="">{Department_text.Deleted}</div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="d-flex flex-row justify-content-center">
            <label className="customised-switch">
              <input
                type="checkbox"
                checked={
                  this.state.collegeadmindetails[i].user_status == "active"
                    ? true
                    : false
                }
                value={i}
                onChange={(e) => {
                  this.changeStatus(e.target.value);
                }}
              />
              <span className="customised-slider customised-round"></span>
            </label>
          </div>
        </React.Fragment>
      );
    }
  }
  clearFeild = () => {
    document.getElementById("email").value = "";
    document.getElementById("name").value = "";
  };
  closeErrorModal = () => {
    this.setState({ message: "", show: false });
  };
  render() {
    // 
    return (
      <div className="department-list">
        <div className="studenthomepage-header d-flex flex-row">
          <Header />
        </div>
        <div className="d-flex flex-row mt-5 pt-3">
          <div className="main-heading me-5">
            {Department_text.departmentList}
          </div>
          <div className="add-icon mt-2" onClick={this.addDepartment}>
            <i class="fa-solid fa-plus "></i>
          </div>
        </div>
        <div className="dl-wrapper" style={{ height: "calc(100vh - 230px)" }}>
          <DataTable
            value={this.state.collegeadmindetails}
            className="p-datatable-responsive-demo"
            scrollable
            scrollHeight="100%"
          >
            <Column
              field="department_name"
              header={Department_text.Departmentname}
            ></Column>
            <Column
              field="student_count"
              header={Department_text.Noofstudent}
            ></Column>
            <Column
              field="username"
              header={Department_text.Admin_name}
            ></Column>
            <Column
              field="id"
              header={Department_text.Status}
              body={this.statusTemplate}
            ></Column>
            <Column
              header={Department_text.Action}
              body={this.actionTemplate}
            ></Column>
          </DataTable>
        </div>
        {this.state.showCreateModal ? (
          <Department_Create
            show={this.state.showModal}
            close={this.closeDepartment}
            loading={this.showLoading}
            user={this.props.user}
            theme={this.props.theme}
            update={this.departmentList}
            alertToaste={this.documentToast}
          />
        ) : null}
        <div
          className="modal fade"
          id="editDepartmentModal"
          tabindex="-1"
          aria-labelledby="createBlogModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div class="modal-header">
                <h4 className="ms-auto ps-4">
                  {Department_text.Edit_Department}
                </h4>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={this.clearFeild}
                ></i>
              </div>
              <div className="modal-body">
                <div className="form-wrapper-2 mt-4">
                  <Formik
                    initialValues={{
                      departmentname:
                        this.state.editcollegeadmindetails.department_name,
                      email: this.state.editcollegeadmindetails.email,                      
                    }}
                    enableReinitialize={true}
                    onSubmit={(values, onSubmitProps) => {
                      onSubmitProps.resetForm();
                      let formData = new FormData();
                      // if (values.passward) {
                      //   let encoded = base64_encode(values.passward);
                      //   formData.append("password", encoded);
                      // }
                      if (values.departmentname) {
                        formData.append("name", values.departmentname);
                      }
                      if (values.email) {
                        formData.append("email", values.email);
                      }
                      this.mentorstatusAPI
                        .editDepartment(
                          formData,
                          this.state.editcollegeadmindetails.id
                        )
                        .then((res) => {
                          if (res.status) {
                            this.editToast();
                            this.departmentList();
                          } else {
                            if (res.message) {
                              if (typeof res.message === "object") {
                                let value = Object.values(res.message);
                                this.setState({
                                  message: value[0],
                                  show: true,
                                });
                              } else {
                                this.setState({
                                  message: res.message,
                                  show: true,
                                });
                              }
                            } else {
                              this.setState({
                                message: "Something Went Wrong",
                                show: true,
                              });
                            }
                          }
                        })
                        .catch((err) => {
                        });
                    }}
                  >
                    <Form className="customFormAdmin px-3 mt-5">
                      <div className="form-group mt-3">
                        <label className="label" htmlFor="name">
                          {Department_text.Departmentname}
                        </label>
                        <Field
                          id="name"
                          name="departmentname"
                          type="text"
                          className="input"
                        />
                        <ErrorMessage name="name">
                          {(msg) => <div>{msg}</div>}
                        </ErrorMessage>
                      </div>
                      <div className="form-group mt-3">
                        <label className="label" htmlFor="email">
                          {Department_text.Email}
                        </label>
                        <Field
                          id="email"
                          name="email"
                          type="text"
                          className="input"
                        />
                        <ErrorMessage name="email">
                          {(msg) => <div>{msg}</div>}
                        </ErrorMessage>
                      </div>
                      {/* <div className="form-group ">
                        <label className="label" htmlFor="password">
                          {Department_text.Password}
                        </label>
                        <div className="d-flex flex-row">
                          <Field
                            id="password"
                            name="password"
                            type={
                              this.state.showHidePassword ? "text" : "password"
                            }
                            className="input mb-3 "
                          />
                          <i
                            class={
                              this.state.showHidePassword
                                ? "fa-solid fa-eye eye-icon"
                                : "fa-solid fa-eye-slash eye-icon"
                            }
                            onClick={() =>
                              this.setState({
                                showHidePassword: !this.state.showHidePassword,
                              })
                            }
                          ></i>
                        </div>
                        <div>
                          <ErrorMessage name="password">
                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div> */}
                      <div
                        className="d-flex flex-row justify-content-center mt-5 "
                        data-bs-dismiss="modal"
                      >
                        <button type="submit" className="btn-yellow w-25">
                          {Department_text.update}
                        </button>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>        
        <ErrorModal
          message={this.state.message}
          value={this.state.show}
          closeModal={this.closeErrorModal}
        />
        <Deletemodal
          message={this.state.modalmessage}
          value={this.state.openmodal}
          id={this.state.id}
          deletefun={this.deleteDetails}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    toast: state.toast,
    theme: state.theme,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    showtoast: (data) => {
      dispatch({ type: "ShowToast", value: data });
    },
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Department));
// export default withRouter(Department)

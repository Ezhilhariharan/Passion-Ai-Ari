import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Header from "../../../../../navbar/header/Header";
import Deletemodal from "../../../../../common_Components/popup/Deletemodal";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { mentorText } from "../../Const_Mentor";
import { API } from "./utils/API";
let 
  getMentorStudentList = [],
  url;
class MentorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MentorList: {},
      MentorStudentList: getMentorStudentList,
      openmodal: false,
      modalmessage: "",
      id: "",
      lock: false,
      page: 1,
      subscription: "",
      status: "",
      searchvalue: "",
      studentResultsLength: "",
      studentCount: "",
      message: "",
      show: "",
    };
    url = this.props.match.path;
    this.nameTemplate = this.nameTemplate.bind(this);
    this.mentorActionTemplate = this.mentorActionTemplate.bind(this);
    this.statusTemplate = this.statusTemplate.bind(this);
    this.deleteDetails = this.deleteDetails.bind(this);
    this.mentorAPI = new API();
    this.scrollLoader = this.scrollLoader.bind(this);
    this.getMentor = this.getMentor.bind(this);
  }
  componentDidMount() {
    this.getMentor();
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
        if (!this.state.lock && this.state.MentorList.next) {
          this.setState({ lock: true }, () => {
            if (
              this.state.studentCount / this.state.studentResultsLength >
              this.state.page
            ) {
              this.setState({ page: this.state.page + 1 }, () => {
                this.getMentor();
              });
            }
          });
        }
      }
    });
  }
  getMentor(pageNumber, searchValue, status, reset = false) {
    if (this.state.status !== "") {
      status = this.state.status;
    }
    if (pageNumber === 1) {
      this.state.page = pageNumber;
    }
    this.mentorAPI
      .getMentors(this.state.page, searchValue, status)
      .then((res) => {
        if (Object.keys(this.state.MentorList).length !== 0 && !reset) {
          let list = this.state.MentorList.results;
          list.push(...res.data.results);
          res.data.results = list;
          // 
          this.setState({ MentorList: res.data });
        } else {
          this.setState({
            MentorList: res.data,
            studentResultsLength: res.data.results.length,
            studentCount: res.data.count,
          });
        }
        this.setState({ lock: false });
      })
      .catch((err) => {
      });
  }
  changeStatus(i) {
    let MentorList = this.state.MentorList;
    if (MentorList.results[i].user_status === "active") {
      MentorList.results[i].user_status = "inactive";
    } else if (MentorList.results[i].user_status === "inactive") {
      MentorList.results[i].user_status = "active";
    }
    let formData = new FormData();
    formData.append("user_status", MentorList.results[i].user_status);
    formData.append("user_id", MentorList.results[i].uuid);
    this.mentorAPI
      .updateMentorStatus(formData)
      .then((res) => {
        this.setState({ MentorList: MentorList });
      })    
  }
  nameTemplate(rowData) {
    return (
      <React.Fragment>
        <img
          src={
            rowData.profile_image
              ? rowData.profile_image
              : "/image/errorprofileimg.webp"
          }
          onError={(e) => (e.target.src = "/image/errorprofileimg.webp")}
          width={50}
          style={{ verticalAlign: "middle" }}
          className="table-img img-fluid me-3"
        />
        <span className="image-text">{rowData.name}</span>
      </React.Fragment>
    );
  }
  openDeleteModal = (id) => {
    this.setState({
      openmodal: true,
      modalmessage: "Are you sure you want to delete this Mentor",
      id: id,
    });
  };
  deleteDetails(value, id, answer) {
    this.setState({
      openmodal: value,
    });
    if (answer === "yes") {
      // let collegelist = this.state.MentorList;
      // let currentList, i;
      this.mentorAPI
        .deleteMentor(id)
        .then((res) => {
          if (res.status) {
            this.setState({ MentorList: "" }, () => {
              this.getMentor();
            });
          } else {
            if (res.message) {
              if (typeof res.message === "object") {
                let value = Object.values(res.message);
                this.setState({ message: value[0], show: true });
              } else {
                this.setState({ message: res.message, show: true });
              }
            } else {
              this.setState({
                message: "Something Went Wrong",
                show: true,
              });
            }
          }
        })       
    }
  }
  mentorActionTemplate(rowData) {
    return (
      <React.Fragment>
        {rowData.user_status === "deleted" || !rowData.username ? null : (
          <div>
            <NavLink to={`${url}/editmentor/${rowData.username}`}>
              <i class="fa-solid fa-pen-to-square me-3 text-black cursor-pointer"></i>
            </NavLink>
            <i
              className="fa-solid fa-trash-can text-black cursor-pointer me-4"
              onClick={() => this.openDeleteModal(rowData.username)}
            ></i>
            <NavLink to={`/admin/mentors/profile/${rowData.username}&mentor`}>
              <i class="fa-solid fa-chevron-right yellow-arrow cursor-pointer"></i>
            </NavLink>
          </div>
        )}
      </React.Fragment>
    );
  }
  statusTemplate(rowData) {
    let i = this.state.MentorList.results.indexOf(rowData);
    if (rowData.user_status === "deleted") {
      return (
        <React.Fragment>
          <p>{mentorText.deleted}</p>
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
                  this.state.MentorList.results[i].user_status == "active"
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
  }
  getSearchValue = (value) => {
    this.setState({ searchvalue: value });
    this.getMentor(1, value, this.state.status, true);
  };
  getStatus = (e) => {
    this.setState({ status: e.target.value }, () => {
      this.getMentor(1, this.state.searchvalue, e.target.value, true);
    });
  };
  closeErrorModal = () => {
    this.setState({ message: "", show: false });
  };
  render() {
    // 
    return (
      <div className="">
        <div className="studenthomepage-header d-flex flex-row">
          <Header searchValue={this.getSearchValue} />
        </div>
        <div className="d-flex flex-row align-items-center mt-4 pt-3 w-100">
          <div className="main-heading me-5  col-2">
            {mentorText.mentorlist}
          </div>
          <div className=" col-1 pe-5">
            <NavLink to={`${url}/addmentor`} style={{ textDecoration: "none" }}>
              <div className="add-icon  me-auto">
                <i class="fa-solid fa-plus "></i>
              </div>
            </NavLink>
          </div>
          <div className="customFormAdmin mt-3 d-flex flex-row justify-content-end col-8">
            <div className="d-flex flex-row">
              <div className=" form-group  "></div>
              <div className=" form-group  ">
                <select className="custom-select-1" onChange={this.getStatus}>
                  <option value="">{mentorText.status}</option>
                  <option value="active">{mentorText.active}</option>
                  <option value="inactive">{mentorText.inactive}</option>
                  <option value="deleted">{mentorText.delete}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div
          className="table-wrapper pt-3"
          style={{ height: "calc(100vh - 190px)" }}
        >
          <DataTable
            value={this.state.MentorList.results}
            scrollable
            scrollHeight="100%"
          >
            <Column
              field="name"
              header={mentorText.name}
              body={this.nameTemplate}
            ></Column>
            <Column
              field="industry_name"
              header={mentorText.industryname}
            ></Column>
            <Column field="email" header={mentorText.emailid}></Column>
            <Column field="mobile_no" header={mentorText.phonenumber}></Column>
            <Column
              field="no_of_students"
              header={mentorText.numberofstudent}
            ></Column>
            <Column
              field="user_status"
              header={mentorText.status}
              body={this.statusTemplate}
            ></Column>
            <Column
              field="id"
              header={mentorText.Action}
              body={this.mentorActionTemplate}
            ></Column>
          </DataTable>
        </div>
        <Deletemodal
          message={this.state.modalmessage}
          value={this.state.openmodal}
          id={this.state.id}
          deletefun={this.deleteDetails}
        />
        <ErrorModal
          message={this.state.message}
          value={this.state.show}
          closeModal={this.closeErrorModal}
        />
      </div>
    );
  }
}
export default withRouter(MentorList);

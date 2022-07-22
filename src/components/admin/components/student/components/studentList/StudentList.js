import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Header from "../../../../../navbar/header/Header";
import { API } from "./utils/API";
import { studentText } from "../Const_student";
import "../../../../styles/AdminLayout.scss";
let
  url,
  id;
let passion_usertype;
let departmentid;
class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StudentList: {},
      lock: false,
      page: 1,
      usertype: "",
      college: "",
      status: "",
      searchvalue: "",
      industry: "",
      stage: "",
      industrylist: [],
      collegelist: [],
      studentResultsLength: "",
      studentCount: "",
      url_id: "",
      type: "",
      departmentid: "",
    };
    url = this.props.match.path;
    id = this.props.match.params.MentorID;
    passion_usertype = localStorage.getItem("passion_usertype");
    this.approveStudent = this.approveStudent.bind(this);
    this.nameTemplate = this.nameTemplate.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
    this.statusTemplate = this.statusTemplate.bind(this);
    this.scrollLoader = this.scrollLoader.bind(this);
    this.getStudents = this.getStudents.bind(this);
    this.studentAPI = new API();
    this.industry_name = this.industry_name.bind(this);
  }
  componentDidMount() {
    this.getStudents();
    this.scrollLoader();
    this.setState({ url_id: id, type: passion_usertype });
  }
  scrollLoader() {
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
        if (!this.state.lock && this.state.StudentList.next) {
          this.setState({ lock: true }, () => {
            if (
              this.state.studentCount / this.state.studentResultsLength >
              this.state.page
            ) {
              this.setState({ page: this.state.page + 1 }, () => {
                this.getStudents();
              });
            }
          });
        }
      }
    });
  }
  getStudents(
    pageNumber,
    searchValue,
    status,
    industry,
    college,
    stage,
    reset = false
  ) {
    if (passion_usertype == 3) {
      console.log("department")
      this.studentAPI
        .getUserId()
        .then((res) => {
          if (res.status) {
            if (res.data.length > 0) {
              departmentid = res.data[0]?.department_id;
              this.setState({ departmentid: res.data[0]?.department_id });
            }
          }
          console.log("departmentid", departmentid)
          this.studentAPI
            .getDepartmentStudents(this.state.page, departmentid)
            .then((res) => {
              if (Object.keys(this.state.StudentList).length !== 0 && !reset) {
                let list = this.state.StudentList.results;
                list.push(...res.data.results);
                res.data.results = list;
                this.setState({ StudentList: res.data });
              } else {
                if (this.state.StudentList !== res.data) {
                  this.setState({
                    StudentList: res.data,
                    studentResultsLength: res.data.results.length,
                    studentCount: res.data.count,
                  });
                }
              }
              this.setState({ lock: false });
            })
        })
    } else {
      let industryList = [{ id: "", value: "All industry" }];
      let getcollegelist = [{ code: "", name: "College List" }];
      this.studentAPI
        .getIndustryList()
        .then((res) => {
          if (res.status) {
            for (let i of res.data) {
              industryList.push({ id: i.id, value: i.name });
            }
            this.setState({ industrylist: industryList });
          }
        })
      this.studentAPI
        .getCollegeList()
        .then((res) => {
          if (res.status) {
            for (let i of res.data) {
              getcollegelist.push({ code: i.id, name: i.name });
            }
            this.setState({ collegelist: getcollegelist });
          }
        })
      if (this.state.status !== "") {
        status = this.state.status;
      }
      if (this.state.industry !== "") {
        industry = this.state.industry;
      }
      if (this.state.college !== "") {
        college = this.state.college;
      }
      if (this.state.stage !== "") {
        stage = this.state.stage;
      }
      if (pageNumber == 1) {
        this.state.page = pageNumber;
      }
      if (id == "studentapproval") {
        status = "waiting_approval";
      }
      this.studentAPI
        .getStudents(
          this.state.page,
          searchValue,
          status,
          industry,
          college,
          stage
        )
        .then((res) => {
          if (Object.keys(this.state.StudentList).length != 0 && !reset) {
            if (this.state.StudentList !== res.data) {
              let list = this.state.StudentList.results;
              list.push(...res.data.results);
              res.data.results = list;
              this.setState({ StudentList: res.data });
            }
          } else {
            if (this.state.StudentList !== res.data) {
              this.setState({
                StudentList: res.data,
                studentResultsLength: res.data.results.length,
                studentCount: res.data.count,
              });
            }
          }
          this.setState({ lock: false });
        })
    }
  }
  approveStudent(i) {
    let StudentList = this.state.StudentList;
    if (StudentList.results[i].user_status === "waiting_approval") {
      StudentList.results[i].user_status = "active";
    }
    let formData = new FormData();
    formData.append("user_status", "active");
    formData.append("user_id", this.state.StudentList.results[i].user_id);
    this.studentAPI.updateStudentStatus(formData).then(
      (res) => {
        if (res.status) {
          this.setState({ StudentList: StudentList });
        }
      },
    );
  }
  changeStatus(i) {
    let StudentList = this.state.StudentList;
    if (StudentList.results[i].user_status === "active") {
      StudentList.results[i].user_status = "inactive";
    } else if (StudentList.results[i].user_status === "inactive") {
      StudentList.results[i].user_status = "active";
    }
    // 
    let formData = new FormData();
    formData.append("user_status", StudentList.results[i].user_status);
    formData.append("user_id", StudentList.results[i].user_id);
    this.studentAPI.updateStudentStatus(formData).then(
      (res) => {
        this.setState({ StudentList: StudentList });
      },
    );
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
  industry_name(rowData) {
    return (
      <React.Fragment>
        <span className="image-text">
          {rowData.industry_name ? rowData.industry_name : "Not Assigned"}
        </span>
      </React.Fragment>
    );
  }
  stage_number(rowData) {
    return (
      <React.Fragment>
        <span className="image-text">
          {rowData.stage_number == 0 && rowData.industry_id
            ? "Completed"
            : rowData.stage_number}
        </span>
      </React.Fragment>
    );
  }
  actionTemplate(rowData) {
    return rowData.industry_id ? (
      <React.Fragment>
        <NavLink to={`/admin/students/Profile/${rowData.username}&student`}>
          <i className="fa-solid fa-chevron-right yellow-arrow cursor-pointer"></i>
        </NavLink>
      </React.Fragment>
    ) : null;
  }
  statusTemplate(rowData) {
    let i = this.state.StudentList.results.indexOf(rowData);
    if (rowData.user_status == "waiting_approval") {
      return (
        <React.Fragment>
          <button
            className="btn-blue w-75"
            onClick={() => this.approveStudent(i)}
          >
            {studentText.approved}
          </button>
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
                  this.state.StudentList.results[i].user_status == "active"
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
    this.getStudents(
      1,
      value,
      this.state.status,
      this.state.industry,
      this.state.college,
      this.state.stage,
      true
    );
  };
  getStatus = (e) => {
    this.setState({ status: e.target.value }, () => {
      this.getStudents(
        1,
        this.state.searchvalue,
        e.target.value,
        this.state.industry,
        this.state.college,
        this.state.stage,
        true
      );
    });
  };
  getIndustry = (e) => {
    // 
    if (e.target.value === "All industry") {
      this.setState({ industry: "" }, () => {
        this.getStudents(
          1,
          this.state.searchvalue,
          this.state.status,
          "",
          this.state.college,
          this.state.stage,
          true
        );
      });
    } else {
      this.setState({ industry: e.target.value }, () => {
        this.getStudents(
          1,
          this.state.searchvalue,
          this.state.status,
          e.target.value,
          this.state.college,
          this.state.stage,
          true
        );
      });
    }
  };
  getCollege = (e) => {
    if (e.target.value === "College List") {
      this.setState({ college: "" }, () => {
        this.getStudents(
          1,
          this.state.searchvalue,
          this.state.status,
          this.state.industry,
          "",
          this.state.stage,
          true
        );
      });
    } else {
      this.setState({ college: e.target.value }, () => {
        this.getStudents(
          1,
          this.state.searchvalue,
          this.state.status,
          this.state.industry,
          e.target.value,
          this.state.stage,
          true
        );
      });
    }
  };
  getStage = (e) => {
    this.setState({ stage: e.target.value }, () => {
      this.getStudents(
        1,
        this.state.searchvalue,
        this.state.status,
        this.state.industry,
        this.state.college,
        e.target.value,
        true
      );
    });
  };
  render() {
    return (
      <div className="studentList">
        <div className="studenthomepage-header d-flex flex-row">
          <Header searchValue={this.getSearchValue} />
        </div>
        <div className="d-flex flex-row align-items-center mt-4 pt-4 w-100">
          <div className="main-heading me-5 w-25">
            {studentText.studentlist}
          </div>
          {this.state.type === 1 ? (
            <div className="customFormAdmin mt-3 d-flex flex-row justify-content-between w-75">
              <div className=" form-group ">
                <select className="custom-select-2" onChange={this.getIndustry}>
                  {this.state.industrylist.map((option) => (
                    <option value={option.value}>{option.value}</option>
                  ))}
                </select>
              </div>
              <div className=" form-group ">
                <select className="custom-select-2" onChange={this.getCollege}>
                  {this.state.collegelist.map((option) => (
                    <option value={option.name}>{option.name}</option>
                  ))}
                </select>
              </div>
              <div className=" form-group ">
                <select className="custom-select-2" onChange={this.getStage}>
                  <option value=""> {studentText.stages}</option>
                  <option value="1"> {studentText.stage1}</option>
                  <option value="2"> {studentText.stage2}</option>
                  <option value="3"> {studentText.stage3}</option>
                </select>
              </div>
              <div className=" form-group ">
                <select className="custom-select-2" onChange={this.getStatus}>
                  <option value="">{studentText.status}</option>
                  <option value="active">{studentText.active}</option>
                  <option value="inactive">{studentText.inactive}</option>
                  {this.state.url_id ? (
                    <option value="waiting_approval" selected>
                      {studentText.approve}
                    </option>
                  ) : (
                    <option value="waiting_approval">
                      {studentText.approve}
                    </option>
                  )}
                </select>
              </div>
            </div>
          ) : null}
        </div>
        {/**/}
        <div className="table-List">
          <div
            className="table-wrapper-student "
            style={{ height: "calc(100vh - 220px)" }}
          >
            <DataTable
              value={this.state.StudentList.results}
              scrollable
              scrollHeight="100%"
            >
              <Column
                field="name"
                header={studentText.name}
                body={this.nameTemplate}
              ></Column>
              <Column
                field="industry_name"
                header={studentText.industry}
                body={this.industry_name}
              ></Column>
              <Column
                field="college_name"
                header={studentText.college}
              ></Column>
              <Column
                field="stage_number"
                header={studentText.progress}
                body={this.stage_number}
              ></Column>
              <Column
                field="user_status"
                header={studentText.status}
                body={this.statusTemplate}
              ></Column>
              <Column
                field="id"
                header={studentText.action}
                body={this.actionTemplate}
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(StudentList);

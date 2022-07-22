import Header from "../../../../navbar/header/Header";
import React, { Component } from "react";
import "../styles/Department_info.scss";
import { NavLink, withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { API } from "../api/Get";
import Barchart from "../../dashboard/components/masterDashBoard/graphchart/barchart/BarTwo";
import { Department_text } from "../const/Department_const_text";
let url, urlid, i, basicOptions;
// let departmentindustryname = [];
// let departmentstageone = [];
// let departmentstagetwo = [];
// let departmentstagethree = [];
// let departmentid;
// let piechartindustryname = [];
// let piechartindustryvalue = [];
let mainchartindustryname = [];
let stageone = [];
let stagetwo = [];
let stagethree = [];
// let mergingIndustryDeatils = [];
// let filteredIndustryDeatils = [];
class Department_info extends Component {
  constructor(props) {
    super(props);
    url = this.props.match.path;
    urlid = this.props.match.params.id;
    this.state = {
      studentlist: {},
      showpiechart: false,
      departmentdetails: [],
      departmentdetailsgraph: [],
      showBart: false,
      page: 1,
      lock: false,
    };
    this.studentListAPI = new API();
    // this.adddepartmentAPI = new postAPI();
    // this.mentorstatusAPI = new patchAPI();
    this.actionTemplate = this.actionTemplate.bind(this);
    this.statusTemplate = this.statusTemplate.bind(this);
    this.stages = this.stages.bind(this);
    this.StudentList = this.StudentList.bind(this);
    this.basicData3 = {
      labels: ["industry1", "industry2", "industry3", "indsdsa"],
      datasets: [
        {
          label: "Stage1",
          backgroundColor: "#C4C4C4",
          data: [65, 29, 80, 34],
        },
        {
          label: "Stage2",
          backgroundColor: "#FF7A00",
          data: [65, 89, 10, 32],
        },
        {
          label: "Stage3",
          backgroundColor: "#5A619E",
          data: [65, 59, 80, 34],
        },
      ],
    };
    basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1.0,
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        xAxes: [
          {
            barPercentage: 0.4,
          },
        ],
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };
  }
  changeStatus(i) {
    let studentlist = this.state.studentlist;
    if (studentlist[i].user_status === "active") {
      studentlist[i].user_status = "inactive";
    } else if (studentlist[i].user_status === "inactive") {
      studentlist[i].user_status = "active";
    }
    // 
    let formData = new FormData();
    formData.append("user_status", studentlist[i].user_status);
    // this.mentorstatusAPI.updateMentorStatus(
    //     studentlist[i].user_id,
    //   formData
    // )
    //   .then(
    //     res => 
    //   )
    //   .catch(
    //     err => 
    //   )
    // this.setState({ collegeadmindetails: MentorList })
  }
  actionTemplate(rowData) {
    return (
      <React.Fragment>
        <NavLink to={`/admin/department/studentprofile/${rowData.username}`}>
          <i className="fa-solid fa-chevron-right yellow-arrow cursor-pointer"></i>
        </NavLink>
      </React.Fragment>
    );
  }
  statusTemplate(rowData) {
    i = this.state.studentlist.indexOf(rowData);
    return (
      <React.Fragment>
        <div className="d-flex flex-row justify-content-center">
          <label className="customised-switch">
            <input
              type="checkbox"
              checked={
                this.state.studentlist[i].user_status == "active" ? true : false
              }
              onChange={() => this.changeStatus(i)}
            />
            <span className="customised-slider customised-round"></span>
          </label>
        </div>
      </React.Fragment>
    );
  }
  stages(rowData) {
    return (
      <React.Fragment>
        {rowData.stage_number == 0 ? "Completed" : rowData.stage_number}
      </React.Fragment>
    );
  }
  componentDidMount() {
    this.initialRender();
    this.scrollLoader();
    this.StudentList();
    // 
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
        if (!this.state.lock && this.state.studentlist.next) {
          this.setState({ lock: true }, () => {
            this.setState({ page: this.state.page + 1 }, () => {
              this.StudentList();
            });
          });
        }
      }
    });
  }
  StudentList(reset = false) {
    let list;
    this.studentListAPI.getstudentList(urlid, this.state.page).then((res) => {      
      if (Object.keys(this.state.studentlist).length != 0 && !reset) {
        list = this.state.studentlist.results;
        list.push(...res.data.results);
        res.data.results = list;
        this.setState({ studentlist: res.data });
      } else {
        this.setState({ studentlist: res.data });
      }
      this.setState({ lock: false });
    });
  }
  initialRender = () => {
    this.studentListAPI.getDepartmentdetails(urlid).then((res) => {    
      if (res.status) {
        this.setState({ departmentdetails: res.data });
      }
    });
    this.studentListAPI
      .getDepartmentdetails_graph(urlid)
      .then((res) => {       
        this.setState({ stageAnalytics: res.data });       
        let CovertstagetoArray = res.data;
        let ConvertedstageArray = Object.entries(CovertstagetoArray);
        let splicedstageArray = ConvertedstageArray;        
        splicedstageArray.map((item) => {
          let stage_1 = 0;
          let stage_2 = 0;
          let stage_3 = 0;
          let chartindustryname = item[0];
          if (item[1] !== null || undefined) {            
            let iterated = Object.entries(item[1]);
            iterated.map((data) => {             
              if (data[1] !== null || undefined) {
                stage_1 = stage_1 + data[1].stage_1;
                stage_2 = stage_2 + data[1].stage_2;
                stage_3 = stage_3 + data[1].stage_3;
                if (data[1].stage_1 === NaN) {
                  stage_1 = 0;
                } else if (data[1].stage_2 === NaN) {
                  stage_2 = 0;
                } else if (data[1].stage_3 === NaN) {
                  stage_3 = 0;
                }
              }
            });
            if (mainchartindustryname.length <= splicedstageArray.length) {
              mainchartindustryname.push({ chartindustryname });
            }
            if (stageone.length < splicedstageArray.length) {
              stageone.push({ stage_1 });
            }
            if (stagetwo.length < splicedstageArray.length) {
              stagetwo.push({ stage_2 });
            }
            if (stagethree.length < splicedstageArray.length) {
              stagethree.push({ stage_3 });
            }
          } else {
            if (mainchartindustryname.length < splicedstageArray.length) {
              mainchartindustryname.push({ chartindustryname });
            }
            if (stageone.length < splicedstageArray.length) {
              stageone.push({ stage_1 });
            }
            if (stagetwo.length < splicedstageArray.length) {
              stagetwo.push({ stage_2 });
            }
            if (stagethree.length < splicedstageArray.length) {
              stagethree.push({ stage_3 });
            }
          }
        });
        this.setState({ showBart: true });
      })    
  };
  render() {  
    return (
      <div className="mentorProfile">
        <div className="studenthomepage-header d-flex flex-row">
          <Header />
        </div>
        <div className="profileback_btn ">
          <NavLink className="btn-circle-blue" to={"/admin/department"}>
            <i className="fa fa-angle-left"></i>
          </NavLink>
        </div>
        <div className="personalRow d-flex flex-row justify-content-around mt-5 mx-auto">
          <div className="col-6">
            <div className="department_info-card row p-3 ms-4">
              <div className="col-3 pt-4">
                <div className="college-picture me-5">
                  <img
                    src={this.state.departmentdetails[0]?.department_image}
                    alt=""
                    className=" "
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image/errorprofileimg.webp";
                    }}
                  />
                </div>
              </div>
              <div className="col-9 py-3">
                <span className="">
                  {this.state.departmentdetails[0]?.college_name}
                </span>
                <div className="college-address mt-2 mb-4">
                  {this.state.departmentdetails[0]?.department_name}
                </div>
                <span className="">
                  {this.state.departmentdetails[0]?.department_user_name}
                </span>
                <div className="d-flex flex-row mt-2">
                  <i class="fa-light fa-envelope me-3 mt-1"></i>
                  <div className="small-font">
                    <span>
                      {this.state.departmentdetails[0]?.department_email_id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 ms-3">
            {this.state.showBart ? (
              <Barchart
                stageone={stageone}
                stagetwo={stagetwo}
                stagethree={stagethree}
                industryname={mainchartindustryname}
              />
            ) : (
              <h5>{Department_text.Datanotfound}</h5>
            )}
          </div>
        </div>
        <div className="d-flex flex-row align-items-center ">
          <div className="main-heading me-5">{Department_text.StudentList}</div>
        </div>
        <div
          className="table-wrapper "
          style={{ height: "calc(70vh - 230px)" }}
        >
          <DataTable
            value={this.state.studentlist.results}
            scrollable
            scrollHeight="100%"
          >
            <Column
              field="username"
              header="Student Name"
              body={this.nameTemplate}
            ></Column>
            <Column field="college_name" header="College"></Column>
            <Column field="Stage" header="Stages" body={this.stages}></Column>      
            <Column
              field="id"
              header="Action"
              body={this.actionTemplate}
            ></Column>
          </DataTable>
        </div>
      </div>
    );
  }
}
export default Department_info;

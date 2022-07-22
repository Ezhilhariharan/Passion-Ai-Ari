import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { withRouter, NavLink } from "react-router-dom";
import "./styles/MentorProfile.scss";
import "../../styles/ProfileLayout.scss";
import { API } from "./utils/Api";
import Header from "../../../../../navbar/header/Header";
import { Skeleton } from "primereact/skeleton";
import { mentorProfileText } from "./Const_mentorProfile";
let url,
  username,
  params,
  user_type,
  paramsname,
  mentorstudentUser_id,
  expertstudentUser_id;
class MentorProfile extends Component {
  constructor(props) {
    super(props);
    url = this.props.match.path;
    username = this.props.match.params.username;
    url = url.replace("/" + url.split("/").splice(-2).join("/"), "");    
    params = username.split("&");
    paramsname = params[0];
    user_type = params[1];
    this.API = new API();
    this.state = {
      showbtn: false,
      studentlist: {},
      mentordetails: "",
      page: 1,
      lock: false,
    };
    this.actionTemplate = this.actionTemplate.bind(this);
    this.StudentList = this.StudentList.bind(this);
  }
  componentDidMount() {
    if (user_type == "mentor") {
      this.setState({ showbtn: true });
      this.getMentorDetails();
    } else {
      let user_id;
      this.setState({ showbtn: false });
      this.getexpertDetails();
    }
    this.scrollLoader();
  }
  getMentorDetails = () => {
    this.API.getmentorinfo(paramsname).then((res) => {
      if (res.status) {
        this.setState({ mentordetails: res.data[0] });
        mentorstudentUser_id = res.data[0]?.uuid;
        this.StudentList();
      } else {
        this.setState({ mentordetails: "" });
      }
    });
  };
  getexpertDetails = () => {
    this.API.getexpertinfo(paramsname).then((res) => {
      // 
      if (res.status) {
        this.setState({ mentordetails: res.data[0] });
        expertstudentUser_id = res.data[0]?.uuid;
        this.StudentList();
      } else {
        this.setState({ mentordetails: "" });
      }
    });
  };
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
    if (user_type == "mentor") {
      let list;
      this.API.getmentorStudentlist(
        paramsname,
        mentorstudentUser_id,
        this.state.page
      ).then((res) => {
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
    } else {
      let list;
      this.API.getexpertStudentlist(
        paramsname,
        expertstudentUser_id,
        this.state.page
      ).then((res) => {
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
  }
  redirect = (rowData) => {
    this.props.history.push(
      `${url}/studentprofile/${rowData.student_username}&student`
    );
  };
  actionTemplate(rowData) {
    //
    return (
      <React.Fragment>
        <i
          className="fa-solid fa-chevron-right yellow-arrow cursor-pointer"
          onClick={() => this.redirect(rowData)}
        ></i>
      </React.Fragment>
    );
  }
  render() {
    return (
      <div className="mentorProfile">
        <div className="studenthomepage-header d-flex flex-row">
          <Header />
        </div>
        <div className="profileback_btn ">
          {this.state.showbtn ? (
            <NavLink className="btn-circle-blue " to={"/admin/mentors"}>
              <i className="fa fa-angle-left"></i>
            </NavLink>
          ) : (
            <NavLink className="btn-circle-blue" to={"/admin/experts"}>
              <i className="fa fa-angle-left"></i>
            </NavLink>
          )}
        </div>
        <div className="personalRow d-flex flex-row justify-content-around mt-5 pt-5">
          <div className="mentor_profiledetails d-flex flex-row">
            <div className="mentoradminprofile-img m-auto col-5">
              <img
                src={this.state.mentordetails.profile_image}
                alt=""
                className="profilein-img"
              />
            </div>
            <div className="mentoradminprofile-details m-auto col-7">
              <h1 className="">
                {this.state.mentordetails === "" ? (
                  <Skeleton width="10rem" className=""></Skeleton>
                ) : (
                  this.state.mentordetails.name
                )}
              </h1>
              <div className="mt-4 d-flex flex-row  ">
                <p className="col-6">
                  {this.state.mentordetails === "" ? (
                    <Skeleton width="4rem" className=""></Skeleton>
                  ) : (
                    this.state.mentordetails.industry_name
                  )}
                </p>
                <span className="col-6">
                  {this.state.mentordetails === "" ? (
                    <Skeleton width="4rem" className=""></Skeleton>
                  ) : (
                    this.state.mentordetails.position
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="mentor_personaldetails d-flex flex-row col-8">
            <div className="mentor_personaldetails-left  p-4 col-7 col-lg-7">
              <span className="mentor-value">
                {mentorProfileText.personaldetails}
              </span>
              <div className="row mt-3">
                <span className="col-4 mentor-feild">
                  {mentorProfileText.email}
                </span>
                <span className="col-8 mentor-value">
                  {this.state.mentordetails === "" ? (
                    <Skeleton width="4rem" className=""></Skeleton>
                  ) : (
                    this.state.mentordetails.email
                  )}
                </span>
              </div>
              <div className="row mt-3">
                <div className="col-4 mentor-feild">
                  {mentorProfileText.phonenumber}
                </div>
                <div className="col-8 mentor-value">
                  {this.state.mentordetails === "" ? (
                    <Skeleton width="4rem" className=""></Skeleton>
                  ) : (
                    this.state.mentordetails.mobile_no
                  )}
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-4 mentor-feild">
                  {mentorProfileText.passward}
                </div>
                <div className="col-8 mentor-value">
                  {mentorProfileText.Dotts}
                </div>
              </div>
            </div>
            <div className="mentor_personaldetails-right d-flex flex-row justify-content-center align-items-center col-5 ">
              <img
                src="/image/mentorandexpertlogo.png"
                alt=""
                className="img-fluid align-items-center"
              />
            </div>
          </div>
        </div>
        <div className="th-wrapper" style={{ height: "calc(100vh - 450px)" }}>
          <DataTable
            value={this.state.studentlist.results}
            // className="p-datatable-responsive-demo"
            scrollable
            scrollHeight="100%"
          >
            <Column
              field="student_name"
              header={mentorProfileText.studentname}
            ></Column>
            <Column
              field="college_name"
              header={mentorProfileText.collegename}
            ></Column>
            <Column
              field="department_name"
              header={mentorProfileText.department}
            ></Column>
            <Column
              field="industry_name"
              header={mentorProfileText.industry}
            ></Column>
            <Column
              field="latest_appointment"
              header={mentorProfileText.appointment}
            ></Column>
            <Column field="id" body={this.actionTemplate}></Column>
          </DataTable>
        </div>
      </div>
    );
  }
}
export default withRouter(MentorProfile);

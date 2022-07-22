import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { API } from "./utils/Api";
import { Skeleton } from "primereact/skeleton";
import Header from "../../../../../navbar/header/Header";
import ProfilePersonalDetails from "../../../../../application/components/profile/student_profile/Profile_Personaldetails";
import ProfileEducationalDetails from "../../../../../application/components/profile/student_profile/Profile_Educationaldetails";
import ProfileReport from "../../../../../application/components/profile/student_profile/Profile_Report";
import { studentProfileText } from "./Const_StudentProfile";
let user_id;
let url, username, params, user_type, paramsname;
let _usertype;
class StudentProfile extends Component {
  constructor(props) {
    super(props);
    url = this.props.match.path;
    username = this.props.match.params.username;
    url = url.replace("/" + url.split("/").splice(-2).join("/"), "");    
    _usertype = localStorage.getItem("passion_usertype");
    params = username.split("&");
    paramsname = params[0];
    user_type = params[1];
    this.API = new API();
    this.state = {
      profiledata: "",
      active: 1,
      expertinfo: {},
      mentorinfo: {},
      currentstage: "",
      usertype: "",
      currentstage: "",
      course_status: "",
      topiclearned: "",
      showtopiclearned: false,
      getcomments: "",
      studentgraphview: [],
      showcomments: false,
      mentorapproved: false,
    };
  }
  componentDidMount() {
    this.initialRender();
  }
  initialRender = () => {
    this.API.getstudentinfo(paramsname).then((data) => {      
      if (data.status) {
        this.setState({ profiledata: data.data[0] });
        this.setState({ currentstage: data.data[0]?.current_stage });
        this.setState({ usertype: _usertype });
        this.setState({ currentstage: data.data[0]?.current_stage });
        this.setState({ course_status: data.data[0]?.course_status });        
        user_id = data.data[0].uuid;
        if (data.data[0]?.expert_info.length > 0) {
          this.setState({ expertinfo: data.data[0]?.expert_info[0] });
        }
        if (data.data[0]?.mentor_info.length > 0) {
          this.setState({ mentorinfo: data.data[0]?.mentor_info[0] });
        }
        this.API.getstudentquestion(user_id).then((data) => {          
          if (data.status) {
            this.setState({
              getcomments: data.data,
              showcomments: true,
              mentorapproved: true,
            });
          } else {
            this.setState({ showcomments: false });
          }
        });
      } else {
        this.setState({ profiledata: "" });
      }
    });
    this.API.getstudentgraphview(paramsname).then((data) => {
      if (data.status) {
        this.setState({ studentgraphview: data.data.analitics_data });
      }
    });
    this.API.getTopiclearned(paramsname).then((data) => {
      // 
      if (data.status) {
        this.setState({ topiclearned: data.data, showtopiclearned: true });
      } else {
        this.setState({ showtopiclearned: false });
      }
    });
  };
  alertToaste = () => {   
  };
  studentQuestion = () => {};
  render() {    
    return (
      <div className="mentorProfile">
        <div className="studenthomepage-header d-flex flex-row">
          <Header />
        </div>
        <div className="profileback_btn ">
          <div
            className="btn-circle-blue mt-4 me-5"
            onClick={() => this.props.history.goBack()}
          >
            <i className="fa fa-angle-left"></i>
          </div>
        </div>
        <div className="profile-upper pt-5 ">
          <div className="profile-upper-inner d-md-flex flex-row">
            <div className="profile-upper-left ">
              <div className="profile-details-box  me-xxl-5 d-flex flex-row">
                <div className="profile-details-box-left  col-5 col-lg-4">
                  <div className="studentprofile-img mx-auto">
                    <img
                      src={
                        this.state.profiledata.profile_image
                          ? this.state.profiledata.profile_image
                          : "/image/errorprofileimg.webp"
                      }
                      alt=""
                      className="profilein-img"
                      onClick={this.showOpenFileDlg}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/image/errorprofileimg.webp";
                      }}
                    />
                  </div>
                </div>
                <div className="profile-details-box-right col-7 col-lg-8">
                  <div className="username">
                    {this.state.profiledata === "" ? (
                      <Skeleton width="10rem" className=""></Skeleton>
                    ) : (
                      this.state.profiledata.name
                    )}
                  </div>
                  <div className="collegename mt-2">
                    {" "}
                    {this.state.profiledata === "" ? (
                      <Skeleton width="10rem" className=""></Skeleton>
                    ) : (
                      this.state.profiledata.college_name
                    )}
                  </div>
                  <div className="d-flex flex-row mt-2">
                    <div className="department ">
                      {this.state.profiledata === "" ? (
                        <Skeleton width="4rem" className=""></Skeleton>
                      ) : (
                        this.state.profiledata.department_name
                      )}
                    </div>
                    <div className="department ms-3">
                      {this.state.profiledata === "" ? (
                        <Skeleton width="4rem" className=""></Skeleton>
                      ) : (
                        this.state.profiledata.industry_name
                      )}
                    </div>
                  </div>
                  <div className="department  mt-2">
                    {studentProfileText.batch}{" "}
                    {this.state.profiledata === "" ? (
                      <Skeleton width="6rem" className="p-mb-2 ms-4"></Skeleton>
                    ) : (
                      this.state.profiledata.batch
                    )}
                  </div>
                  <div className="email d-flex flex-row  mt-4">
                    <i class="fa-light fa-envelope me-3 mt-1"></i>{" "}
                    {this.state.profiledata === "" ? (
                      <Skeleton width="10rem" className=""></Skeleton>
                    ) : (
                      this.state.profiledata.email
                    )}
                  </div>
                  <div className="email d-flex flex-row  mt-3">
                    <i class="fa-regular fa-phone me-3 mt-1"></i>{" "}
                    {this.state.profiledata === "" ? (
                      <Skeleton width="10rem" className=""></Skeleton>
                    ) : (
                      this.state.profiledata.mobile_no
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-upper-right d-sm-flex flex-row justify-content-end ps-md-3">
              <div className="mentors-card me-md-2 me-lg-3 me-xl-5">
                <div className="d-flex flex-row justify-content-center ">
                  <div className="mentors-card-img ">
                    <img
                      src={
                        this.state.mentorinfo === {}
                          ? "https://picsum.photos/201"
                          : this.state.mentorinfo.profile_image
                      }
                      alt=""
                      className="card-img img-fluid"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/image/errorprofileimg.webp";
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-center pt-3">
                  {" "}
                  <span className="mentors-name">
                    {this.state.mentorinfo === {}
                      ? "name"
                      : this.state.mentorinfo.name}
                  </span>
                </div>
                <div className="d-flex flex-row justify-content-center pt-2">
                  {" "}
                  <span className="mentors-industry">
                    {this.state.mentorinfo === {}
                      ? "industry"
                      : this.state.mentorinfo.position}
                  </span>
                </div>
                <div className="d-flex flex-row justify-content-center pt-4">
                  {" "}
                  <span className="mentors-role">
                    {studentProfileText.mentor}
                  </span>
                </div>
              </div>
              <div className="mentors-card  ms-md-1 ms-lg-1 ms-xl-3">
                <div className="d-flex flex-row justify-content-center ">
                  <div className="mentors-card-img center">
                    <img
                      src={
                        this.state.expertinfo === {}
                          ? "https://picsum.photos/201"
                          : this.state.expertinfo.profile_image
                      }
                      alt=""
                      className="card-img img-fluid"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/image/errorprofileimg.webp";
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-center pt-3">
                  {" "}
                  <span className="mentors-name">
                    {this.state.expertinfo === {}
                      ? "name"
                      : this.state.expertinfo.name}
                  </span>
                </div>
                <div className="d-flex flex-row justify-content-center pt-2">
                  {" "}
                  <span className="mentors-industry">
                    {" "}
                    {this.state.expertinfo === {}
                      ? "industry"
                      : this.state.expertinfo.position}
                  </span>
                </div>
                <div className="d-flex flex-row justify-content-center pt-4">
                  {" "}
                  <span className="mentors-role">
                    {studentProfileText.expert}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-lower mt-3">
          <div className="Profile_Personaldetails">
            <div className="profile-middle-component d-flex flex-row   p-3">
              <span
                className={
                  "profile-personal-details pe-sm-5 pe-2" +
                  (this.state.active === 1 ? " ActiveTab" : "")
                }
                onClick={() => this.setState({ active: 1 })}
              >
                {studentProfileText.report}
              </span>
              <span
                className={
                  "profile-personal-details pe-sm-5 ps-sm-5 pe-2" +
                  (this.state.active === 2 ? " ActiveTab" : "")
                }
                onClick={() => this.setState({ active: 2 })}
              >
                {studentProfileText.industrycmmnt}
              </span>
              <span
                className={
                  "profile-personal-details ps-sm-5" +
                  (this.state.active === 3 ? " ActiveTab" : "")
                }
                onClick={() => this.setState({ active: 3 })}
              >
                {studentProfileText.topic}
              </span>
            </div>
            <div className="border_bottom"></div>
            {this.state.active === 1 && (
              <ProfilePersonalDetails
                graphdata={this.state.studentgraphview}
                currentstage={this.state.currentstage}
                course_status={this.state.course_status}
              />
            )}
            {this.state.active === 2 && (
              <ProfileEducationalDetails
                getcomments={this.state.getcomments}
                usertype={this.state.usertype}
                currentstage={this.state.currentstage}
                course_status={this.state.course_status}
                approved={this.state.mentorapproved}
                refreshApi={this.studentQuestion}
                alertToaste={this.alertToaste}
                showcomments={this.state.showcomments}
              />
            )}
            {this.state.active === 3 && (
              <ProfileReport
                topiclearned={this.state.topiclearned}
                currentstage={this.state.currentstage}
                course_status={this.state.course_status}
                showtopiclearned={this.state.showtopiclearned}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(StudentProfile);

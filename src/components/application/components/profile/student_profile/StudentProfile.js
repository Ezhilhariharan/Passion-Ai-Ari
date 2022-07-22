import React, { Component } from "react";
import "./styles/Profile.scss";
import Profile_Personaldetails from "./Profile_Personaldetails";
import Profile_Educationaldetails from "./Profile_Educationaldetails";
import Profile_Report from "./Profile_Report";
import Sidenavbar from "../../../../navbar/sidenavbar/Sidenavbar";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Header from "../../../../navbar/header/Header";
import { studentprofileAPI } from "./utils/Api";
import { profileAPI } from "../mentor_profile/utils/ViewProfileApi";
import { Skeleton } from "primereact/skeleton";
import { studentProfileUser_Text } from "./const/Studentprofile_const";
import { Carousel } from "react-bootstrap";
import { connect } from "react-redux";
let url, studentname, name, check, course_id, industry_id, user_id;
class StudentProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
      profiledata: "",
      expertinfo: {},
      mentorinfo: {},
      studentgraphview: [],
      grapherror: "",
      topiclearned: [],
      viewappointment: false,
      currentstage: "",
      getcomments: [],
      studentappointment: [],
      course_status: "",
      studentappointmentarray: [],
      usertype: "",
      showtopiclearned: false,
      showcomments: false,
      course_status: "",
      mentorapproved: false,
      type: "",
    };
    this.profileAPI = new studentprofileAPI();
    this.viewprofileApi = new profileAPI();
    url = this.props.match.path;
    studentname = this.props.match.params.username;
  }
  componentDidMount() {
    let usertype = localStorage.getItem("passion_usertype");
    this.setState({ type: usertype });
    if (typeof axios.defaults.headers.common["Authorization"] === "undefined") {
      axios.defaults.headers.common["Authorization"] =
        "Token " + localStorage.getItem("passion_token");
    }
    if (studentname === undefined) {
      this.setState({ viewappointment: false });
      this.initialRender();
    } else {
      this.setState({ viewappointment: true, mentorapproved: true });
      this.mentorProfileRender();
    }
  }
  mentorProfileRender = () => {
    name = studentname.slice(1);
    check = url.slice(0, 8);
    this.viewprofileApi.getstudentprofile(name).then(
      (res) => {
        if (res.status) {
          this.setState({ profiledata: res.data[0] });
          course_id = res.data[0]?.course_id;
          industry_id = res.data[0]?.industry_id;
          user_id = res.data[0]?.uuid;
          this.setState({ usertype: res.data[0]?.user_type_id });
          this.setState({
            currentstage: res.data[0]?.current_stage,
          });
          this.setState({
            course_status: res.data[0]?.course_status,
          });
        }
        this.studentQuestion();
        this.viewprofileApi.getTopiclearned(name).then(
          (res) => {
            if (res.status) {
              this.setState({
                topiclearned: res.data,
                showtopiclearned: true,
              });
            } else {
              this.setState({ showtopiclearned: false });
            }
          },
          (err) => {
            this.setState({ topiclearned: [] });
          }
        );
        if (res.data[0]?.course_status !== "completed") {
          this.viewprofileApi.getstudentappointment(name).then(
            (res) => {
              if (res.status) {
                this.setState({
                  studentappointment: res.data,
                });
                this.setState({
                  studentappointmentarray: res.data,
                });
              }
            },
            (err) => {
              this.setState({ studentappointment: [] });
            }
          );
        }
      },
      (err) => {
        this.setState({
          profiledata: "",
          usertype: "",
          currentstage: "",
          course_status: "",
        });
      }
    );
    this.viewprofileApi.getstudentgraphview(name, course_id).then(
      (res) => {        
        if (res.status) {
          if (res.data.length !== 0) {
            this.setState({
              studentgraphview: res.data.analitics_data,
            });
          }
        }
      },
      (err) => {
        this.setState({ studentgraphview: [] });
      }
    );
  };
  initialRender = () => {
    this.profileAPI.getStudentProfile().then((data) => {
      if (data.status) {
        this.setState({ profiledata: data.data[0] });
        this.setState({
          currentstage: data.data[0]?.current_stage,
        });
        this.setState({
          course_status: data.data[0]?.course_status,
          mentorapproved: data.data[0]?.is_approved,
        });
        if (data.data[0]?.expert_info.length > 0) {
          this.setState({
            expertinfo: data.data[0]?.expert_info[0],
          });
        }
        if (data.data[0]?.mentor_info.length > 0) {
          this.setState({
            mentorinfo: data.data[0]?.mentor_info[0],
          });
        }
      }
      this.profileAPI.getTopiclearned(data.data[0].username).then((data) => {
        if (data.status) {
          // console.log("getTopiclearned",data)
          this.setState({
            topiclearned: data.data,
            showtopiclearned: true,
          });
        } else {
          this.setState({ showtopiclearned: false });
        }
      });
    });
    this.profileAPI.getGraphView().then((data) => {
      if (data.status) {
        this.setState({
          studentgraphview: data.data.analitics_data,
        });
      }
    });
    this.profileAPI.getComments().then((data) => {
      if (data.status) {
        this.setState({
          getcomments: data.data,
          showcomments: true,
        });
      }
    });
  };
  alertToaste = () => {
    this.props.showtoast({
      text: "Comment Approved",
      time: new Date().getTime(),
    });
  };
  studentQuestion = () => {
    this.viewprofileApi.getstudentquestion(user_id).then(
      (res) => {
        if (res.status) {
          this.setState({
            getcomments: res.data,
            showcomments: true,
          });
        } else {
          this.setState({ showcomments: false });
        }
      },
      (err) => {
        this.setState({ getcomments: [] });
      }
    );
  };
  getMeetLink = (id) => {
    this.viewprofileApi.getAppointmentMeetLink(id).then((res) => {
      if (res.status) {
        this.openInNewTab(res.data);
      }
    });
  };
  openInNewTab = (url) => {
    // 
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };
  render() {
    // 
    //     "studentappointmentarray >>",
    //     this.state.studentappointmentarray,
    //     this.state.studentappointment,
    //     this.state.course_status
    // );
    return (
      <div className="profile">
        <Sidenavbar />
        <div className="studenthomepage-header d-flex flex-row">
          <Header />
        </div>
        <div className="profile-upper  ">
          {this.state.type == 6 ? null : (
            <div
              className="btn-circle-blue"
              onClick={() => this.props.history.goBack()}
            >
              <i className="fa fa-angle-left"></i>
            </div>
          )}
          <div className="profile-upper-inner d-md-flex flex-row">
            <div className="profile-upper-left ">
              <div className="profile-details-box me-xxl-5 d-flex flex-row">
                <div className="profile-details-box-left  col-5 col-md-4 col-lg-4">
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
                <div className="profile-details-box-right col-7 col-md-7 col-lg-8">
                  <div className="username">
                    {this.state.profiledata === "" ? (
                      <Skeleton width="10rem" className=""></Skeleton>
                    ) : (
                      this.state.profiledata.name
                    )}
                  </div>
                  <div className="collegename mt-3">
                    {" "}
                    {this.state.profiledata === "" ? (
                      <Skeleton width="10rem" className=""></Skeleton>
                    ) : (
                      this.state.profiledata.college_name
                    )}
                  </div>
                  <div className="d-flex flex-row">
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
                  <div className="department ">
                    Batch{" "}
                    {this.state.profiledata === "" ? (
                      <Skeleton
                        width="6rem"
                        className="p-mb-2 ms-4 mt-4"
                      ></Skeleton>
                    ) : (
                      this.state.profiledata.batch
                    )}
                  </div>
                  <div className="email d-flex flex-row  mt-3">
                    <i class="fa-light fa-envelope me-3 mt-1"></i>
                    {this.state.profiledata === "" ? (
                      <Skeleton width="10rem" className=""></Skeleton>
                    ) : (
                      this.state.profiledata.email
                    )}
                  </div>
                  <div className="email d-flex flex-row  mt-3">
                    <i class="fa-regular fa-phone me-3 mt-1"></i>
                    {this.state.profiledata === "" ? (
                      <Skeleton width="10rem" className=""></Skeleton>
                    ) : (
                      this.state.profiledata.mobile_no
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-upper-right d-sm-flex flex-row justify-content-end ps-md-3 gap-3">
              {this.state.viewappointment ? (
                <div className="Appointment-card ">
                  {this.state.course_status === "completed" ? (
                    <div className="no-appointment">
                      <img
                        src="/image/no-appointment.webp"
                        alt=""
                        className="img-fluid "
                      />
                      <h1 className="mt-3">
                        {studentProfileUser_Text.noAppointment}
                      </h1>
                    </div>
                  ) : (
                    <>
                      {this.state.studentappointmentarray.length === 0 ? (
                        <div className="no-appointment">
                          <img
                            src="/image/no-appointment.webp"
                            alt=""
                            className="img-fluid "
                          />
                          <h1 className="mt-3">
                            {studentProfileUser_Text.noAppointment}
                          </h1>
                        </div>
                      ) : (
                        <>
                          <Carousel controls={false}>
                            {this.state.studentappointment
                              .slice(0, 5)
                              .map((data, index) => {
                                let appoitnmentDate = Date.parse(
                                  `${data.appointment_date}T${data.start_time}`
                                );
                                let timeOut = Date.parse(
                                  `${data.appointment_date}T${data.end_time}`
                                );
                                return (
                                  <Carousel.Item>
                                    <div className="Appointment-card-body w-100 d-flex flex-row ">
                                      <div className="col-8 ">
                                        <div className="Appointment-card-profile pt-1 d-flex flex-row mt-md-2 ps-2">
                                          <div className="Appointment-card-profile-img col-6 mt-1 ms-4">
                                            <img
                                              src={data.profile_image}
                                              alt=""
                                              className="img-fluid"
                                              onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                  "/image/errorprofileimg.webp";
                                              }}
                                            />
                                          </div>
                                          <div className="Appointment-card-profile-info col-6 ps-3">
                                            <h1 className="ps-1 ">
                                              {data.username}
                                            </h1>
                                            <div className="p ps-1 pt-1">
                                              {data.college_name}
                                            </div>
                                            <div className="p ps-1 pt-2">
                                              {data.batch}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="appointment-shedule  ps-4 pt-3">
                                          <div className="ps-1 p">
                                            {
                                              studentProfileUser_Text.Appointment_scheduled
                                            }
                                          </div>
                                          <div className="d-flex flex-row ps-1 mt-3 pt-md-0">
                                            <img
                                              src="/image/appointmentdate.png"
                                              alt=""
                                              className="img-fluid mt-1"
                                            />
                                            <div className=" ms-2 p ">
                                              {data.appointment_date}
                                            </div>
                                          </div>
                                          <div className="d-flex flex-row ps-1 mt-3 pt-md-0">
                                            <img
                                              src="/image/appointmenttime.png"
                                              alt=""
                                              className=" img-fluid mt-1"
                                            />
                                            <div className=" ms-2 p ">
                                              {data.start_time}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="Appointment-card-calender col-4 d-flex flex-row justify-content-center ">
                                        <img
                                          src="/image/calender.webp"
                                          alt=""
                                          className="mt-5 img-fluid"
                                        />
                                      </div>
                                    </div>
                                    <div className="w-100 d-flex flex-row justify-content-center ">
                                      {timeOut > Date.now() ? (
                                        <button
                                          className={
                                            appoitnmentDate > Date.now()
                                              ? "studenthomepage-cards-join-hover"
                                              : "studenthomepage-cards-join"
                                          }
                                          disabled={
                                            appoitnmentDate > Date.now()
                                          }
                                          onClick={() =>
                                            this.getMeetLink(data.id)
                                          }
                                        >
                                          {studentProfileUser_Text.Join}
                                        </button>
                                      ) : (
                                        <span>
                                          {studentProfileUser_Text.Join}
                                        </span>
                                      )}
                                    </div>
                                  </Carousel.Item>
                                );
                              })}
                          </Carousel>
                        </>
                      )}
                    </>
                  )}
                </div>
              ) : (
                // student
                <>
                  <div className="mentors-card me-md-1 me-lg-3 me-xl-5 ">
                    <div className="d-flex flex-row justify-content-center ">
                      <div className="mentors-card-img ">
                        <img
                          src={
                            this.state.mentorinfo.profile_image
                              ? this.state.mentorinfo.profile_image
                              : "/image/errorprofileimg.webp"
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
                        {" "}
                        {studentProfileUser_Text.Mentor}
                      </span>
                    </div>
                  </div>
                  <div className="mentors-card ms-md-1 ms-lg-1 ms-xl-3">
                    <div className="d-flex flex-row justify-content-center ">
                      <div className="mentors-card-img center">
                        <img
                          src={
                            this.state.expertinfo.profile_image
                              ? this.state.expertinfo.profile_image
                              : "/image/errorprofileimg.webp"
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
                        {" "}
                        {studentProfileUser_Text.Industry_Expert}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="profile-lower">
          <div className="Profile_Personaldetails">
            <div className="profile-middle-component d-flex flex-row  p-3">
              <span
                className={
                  "profile-personal-details pe-sm-5 pe-2" +
                  (this.state.active === 1 ? " ActiveTab" : "")
                }
                onClick={() => this.setState({ active: 1 })}
              >
                {studentProfileUser_Text.Report}
              </span>
              <span
                className={
                  "profile-personal-details pe-sm-5 ps-sm-5 pe-2" +
                  (this.state.active === 2 ? " ActiveTab" : "")
                }
                onClick={() => this.setState({ active: 2 })}
              >
                {studentProfileUser_Text.Industry_Comments}
              </span>
              <span
                className={
                  "profile-personal-details ps-sm-5" +
                  (this.state.active === 3 ? " ActiveTab" : "")
                }
                onClick={() => this.setState({ active: 3 })}
              >
                {studentProfileUser_Text.Topic}
              </span>
            </div>
            <div className="border_bottom"></div>
            {this.state.active === 1 && (
              <Profile_Personaldetails
                graphdata={this.state.studentgraphview}
                course_status={this.state.course_status}
                currentstage={this.state.currentstage}
              />
            )}
            {this.state.active === 2 && (
              <Profile_Educationaldetails
                getcomments={this.state.getcomments}
                usertype={this.state.usertype}
                currentstage={this.state.currentstage}
                course_status={this.state.course_status}
                showcomments={this.state.showcomments}
                approved={this.state.mentorapproved}
                refreshApi={this.studentQuestion}
                alertToaste={this.alertToaste}
              />
            )}
            {this.state.active === 3 && (
              <Profile_Report
                topiclearned={this.state.topiclearned}
                course_status={this.state.course_status}
                currentstage={this.state.currentstage}
                showtopiclearned={this.state.showtopiclearned}
              />
            )}
          </div>
        </div>
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
)(withRouter(StudentProfile));

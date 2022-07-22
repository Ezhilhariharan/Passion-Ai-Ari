import React, { Component } from "react";
import "./styles/Mentor_profile.scss";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Sidenavbar from "../../../../navbar/sidenavbar/Sidenavbar";
import { profileAPI } from "./utils/ViewProfileApi";
import { Skeleton } from "primereact/skeleton";
import {  NavLink } from "react-router-dom";
import Header from "../../../../navbar/header/Header";
import { studentProfileUser_Text } from "./const/MentorProfile_const";
let url;
class Mentorprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiledata: "",
      active: 1,
      studentappointment: [],
      completedstudent: [],
    };
    this.profileAPI = new profileAPI();
    url = this.props.match.path;
  }
  componentDidMount() {
    if (typeof axios.defaults.headers.common["Authorization"] === "undefined") {
      axios.defaults.headers.common["Authorization"] =
        "Token " + localStorage.getItem("passion_token");
    }
    this.profileData();
  }
  profileData = () => {
    this.profileAPI.getMentorProfile().then((data) => {
      if (data.status) {
        this.setState({
          profiledata: data.data[0],
          studentappointment: data.data[0]?.course_ongoing_student_details,
          completedstudent: data.data[0]?.course_completed_student_details,
        });
      }
    });
  };
  render() {
    return (
      <div className="mentorprofile d-lg-flex flex-row">
        <Sidenavbar />
        <div className="studenthomepage-header d-flex flex-row">
          <Header />
        </div>
        <div className="mentorprofile-left ">
          <div className="mentorprofile-left-card ">
            <div className="mentorprofile-card d-flex flex-row ">
              <div className="profile-img col-5 mx-auto my-auto">
                <img
                  src={this.state.profiledata.profile_image}
                  alt=""
                  className="profilein-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/image/errorprofileimg.webp";
                  }}
                />
              </div>
              <div className="profile-name  col-7">
                <div>
                  <span className="">
                    {this.state.profiledata === "" ? (
                      <Skeleton
                        width="10rem"
                        className="p-mb-2 ms-4 "
                      ></Skeleton>
                    ) : (
                      this.state.profiledata.name
                    )}
                  </span>
                  <p className="mt-3">{this.state.profiledata.industry}</p>
                </div>
              </div>
            </div>
            <div className="mentorprofile-card-details d-flex flex-row justify-content-start">
              <div className=" ps-4  pt-2">
                <div className=" d-flex flex-row ">
                  <span className="mentor-profile-details ">
                    {studentProfileUser_Text.Details}
                  </span>
                </div>
                <div className="Profile_Personaldetails_fields ">
                  <div className="d-flex flex-row">
                    <span className="  field">
                      {studentProfileUser_Text.Industry}
                    </span>{" "}
                    <span className="value mt-3 ">
                      {this.state.profiledata === "" ? (
                        <Skeleton
                          width="10rem"
                          className="p-mb-2 ms-4 "
                        ></Skeleton>
                      ) : (
                        this.state.profiledata.company
                      )}
                    </span>
                  </div>
                  <div className="d-flex flex-row">
                    <span className="field ">
                      {studentProfileUser_Text.Domain}
                    </span>{" "}
                    <span className="value mt-3 ">
                      {this.state.profiledata === "" ? (
                        <Skeleton
                          width="10rem"
                          className="p-mb-2 ms-4 "
                        ></Skeleton>
                      ) : (
                        this.state.profiledata.position
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mentorprofile-card-details d-flex flex-row justify-content-start mt-4">
              <div className="ps-4 pt-2">
                <div className=" d-flex flex-row">
                  <span className="mentor-profile-details ">
                    {studentProfileUser_Text.Personal_Details}
                  </span>
                </div>
                <div className="Profile_Personaldetails_fields ">
                  <div className="d-flex flex-row">
                    <span className="field  ">Email</span>{" "}
                    <span className="value mt-3">
                      {this.state.profiledata === "" ? (
                        <Skeleton
                          width="10rem"
                          className="p-mb-2 ms-4 "
                        ></Skeleton>
                      ) : (
                        this.state.profiledata.email
                      )}
                    </span>
                  </div>
                  <div className="d-flex flex-row">
                    <span className="field  ">
                      {studentProfileUser_Text.Phone}
                    </span>{" "}
                    <span className="value mt-3">
                      {this.state.profiledata === "" ? (
                        <Skeleton
                          width="10rem"
                          className="p-mb-2 ms-4 "
                        ></Skeleton>
                      ) : (
                        this.state.profiledata.mobile_no
                      )}
                    </span>
                  </div>
                  <div className="d-flex flex-row">
                    <span className="field ">
                      {studentProfileUser_Text.Password}
                    </span>{" "}
                    <span className="value mt-3">
                      {studentProfileUser_Text.Dotts}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mentorprofile-right pt-3 ">
          <div className="mentorprofile-align mt-5 col-md-12">
            <div className="mentorprofile-right-upper mt-1  ms-4 d-flex flex-row justify-content-center">
              <div className="w-100 split-students">
                <div className="Students-tittle  pt-3 ps-3 d-flex flex-row ">
                  <h3 className="student">
                    {studentProfileUser_Text.Students}
                  </h3>
                  <h6
                    data-bs-toggle="modal"
                    data-bs-target="#studentappointment"
                    className="ms-auto me-5 "
                  >
                    {studentProfileUser_Text.View_more}
                  </h6>
                </div>
                {this.state.studentappointment.length === 0 ? (
                  <div class="spinner-border mt-5 ms-5" role="status">
                    <span class="sr-only ms-5">
                      {studentProfileUser_Text.Loading}
                    </span>
                  </div>
                ) : (
                  <div className="card-adjustment">
                    {this.state.studentappointment
                      .slice(0, 2)
                      .map((data, index) => (
                        <div
                          className="mentorstudent-appointment  mx-auto  d-sm-flex d-none"
                          onClick={() =>
                            this.props.history.push(
                              `${url}/:${data.student_username}`
                            )
                          }
                          key={index}
                        >
                          <div className="mentor-appointment d-flex flex-row ">
                            <div className="mentorstudent-profile  my-auto ">
                              <div className="mentorstudent-profiledetails d-flex flex-row justify-content-start ">
                                <div className="mentorstudent-profileimg my-auto ms-3">
                                  <img
                                    src={data.profile_image}
                                    alt=""
                                    className="img-fit img-fluid"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src =
                                        "/image/errorprofileimg.webp";
                                    }}
                                  />
                                </div>
                                <div className="mentorstudent-details  my-auto ms-2">
                                  <span className="mentorstudent-Student d-flex">
                                    {data.student_name}
                                  </span>
                                  <span className="mentorstudent-CollegeName d-flex mt-1">
                                    {data.college_name}
                                  </span>
                                  <span className="mentorstudent-Batch d-flex mt-1">
                                    {data.batch}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mentorstudent-stage my-auto ms-3">
                              <div className="mentorstudent-stagecircle">
                                <h5 className="mentorstudent-stagenumber ">
                                  {studentProfileUser_Text.Stage}{" "}
                                  {data.stage_no}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                <div
                  className="mentors-student-appointement-md mx-auto d-block d-sm-none d-sm-block  mt-3 mb-3"
                  onClick={() => this.setState({ active: 2 })}
                >
                  <div className="d-flex flex-row justify-content-center pt-3">
                    <div className="mentorstudent-profileimg center mt-3 ms-3">
                      <img
                        src={this.state.studentappointment[0]?.profile_image}
                        alt=""
                        className="profilein-img img-fluid"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/image/errorprofileimg.webp";
                        }}
                      />
                    </div>
                    <div className="mentorstudent-stage mt-3  ms-auto me-3">
                      <div className="mentorstudent-stagecircle">
                        <h5 className="mentorstudent-stagenumber ">
                          {studentProfileUser_Text.Stage}
                          {this.state.studentappointment[0]?.stage_no}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-row ps-3  pt-3">
                    {" "}
                    <span className="mentorcompleted-Student">
                      {this.state.studentappointment[0]?.student_name}
                    </span>
                  </div>
                  <div className="d-flex flex-row ps-3  pt-2">
                    {" "}
                    <span className="mentorcompleted-CollegeName">
                      {this.state.studentappointment[0]?.college_name}
                    </span>
                  </div>
                  <div className="d-flex flex-row ps-3  pt-2">
                    {" "}
                    <span className="mentorcompleted-Batch">
                      {" "}
                      {this.state.studentappointment[0]?.batch}
                    </span>
                  </div>
                  <div className="d-flex flex-row justify-content-center pt-2">
                    {" "}
                  </div>
                </div>
              </div>
            </div>
            <div className="mentorprofile-right-upper  mt-4 ms-4 d-flex flex-row justify-content-center">
              <div className="w-100">
                <div className="Students-tittle d-flex flex-row">
                  {" "}
                  <h3 className="pt-3 ps-3">
                    {studentProfileUser_Text.Completed_Students}
                  </h3>
                  <h6
                    data-bs-toggle="modal"
                    data-bs-target="#completedstudent"
                    className="ms-auto me-5 mt-3"
                  >
                    {studentProfileUser_Text.View_more}
                  </h6>{" "}
                </div>
                {this.state.completedstudent.length === 0 ? (
                  <div class="spinner-border mt-5 ms-5" role="status">
                    <span class="sr-only ms-5">
                      {studentProfileUser_Text.Loading}
                    </span>
                  </div>
                ) : (
                  <div className="card-adjustment">
                    {this.state.completedstudent
                      .slice(0, 2)
                      .map((data, index) => {
                        let completedDate = `${new Date(
                          data.completed_date
                        ).getDate()}-
                        ${new Date(data.completed_date).getMonth()}-${new Date(
                          data.completed_date
                        ).getFullYear()}`;
                        return (
                          <div
                            className="mentorstudent-appointment mx-auto   d-sm-flex d-none"
                            key={index}
                            onClick={() =>
                              this.props.history.push(
                                `${url}/:${data.student_username}`
                              )
                            }
                          >
                            <div className="mentorstudent-Completed d-flex flex-row ">
                              <div className="mentorstudentCompleted-profile  my-auto">
                                <div className="mentorstudent-profiledetails d-flex flex-row justify-content-start  my-auto">
                                  <div className="mentorstudent-profileimg my-auto ms-3">
                                    <img
                                      src={data.profile_image}
                                      alt=""
                                      className="img-fit img-fluid"
                                    />
                                  </div>
                                  <div className="mentorstudent-details my-auto ms-2">
                                    <span className="mentorcompleted-Student d-flex">
                                      {data.student_name}
                                    </span>
                                    <span className="mentorcompleted-CollegeName d-flex mt-1">
                                      {data.college_name}
                                    </span>
                                    <span className="mentorcompleted-Batch d-flex mt-1">
                                      {data.batch}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {data.is_approved && (
                                <div className="mentorstudent-stage my-auto d-flex flex-row">
                                  <span className="mentorstudent-date mt-2">
                                    {completedDate}
                                  </span>
                                </div>
                              )}
                              {!data.is_approved && (
                                <div className="review_pending">
                                  <p>Review Pending</p>
                                </div>
                              )}
                              {data.is_approved && (
                                <div className=" my-auto">
                                  <img
                                    src="image/done.png"
                                    alt=""
                                    className="img-fluid ps-1 "
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
                <div
                  className="mentors-student-completed-md mx-auto  d-block d-sm-none d-sm-block  mt-4 mb-3"
                  onClick={() => this.setState({ active: 3 })}
                >
                  <div className="d-flex flex-row justify-content-center pt-3">
                    <div className="mentorstudent-profileimg center mt-3 ms-3">
                      <img
                        src={this.state.completedstudent[0]?.profile_image}
                        alt=""
                        className="profilein-img img-fluid"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/image/errorprofileimg.webp";
                        }}
                      />
                    </div>
                    <div className="ms-auto me-5 mt-3">
                      <img
                        src="image/done.png"
                        alt=""
                        className="img-fluid ps-5 pt-2"
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row ps-3 pt-3">
                    {" "}
                    <span className="mentorcompleted-Student">
                      {this.state.completedstudent[0]?.student_name}
                    </span>
                  </div>
                  <div className="d-flex flex-row ps-3  pt-2">
                    {" "}
                    <span className="mentorcompleted-CollegeName">
                      {this.state.completedstudent[0]?.college_name}
                    </span>
                  </div>
                  <div className="d-flex flex-row ps-3 pt-2">
                    {" "}
                    <span className="mentorcompleted-Batch ">
                      {" "}
                      {this.state.completedstudent[0]?.batch}
                    </span>
                  </div>
                  <div className="d-flex flex-row justify-content-center pt-2">
                    {" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal fade"
          id="studentappointment"
          data-keyboard="false"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-centered  modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">
                  {studentProfileUser_Text.Student_Appointment_List}
                </h5>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></i>
              </div>
              <div class="modal-body">
                {this.state.studentappointment.length === 0 ? (
                  <div class="spinner-border mt-5 ms-5" role="status">
                    <span class="sr-only ms-5">
                      {studentProfileUser_Text.Loading}
                    </span>
                  </div>
                ) : (
                  <>
                    {this.state.studentappointment.map((data, index) => (
                      <NavLink
                        to={`${url}/:${data.student_username}`}
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <div
                          className="mentorstudent-appointment  mt-2  mb-4"
                          onClick={() =>
                            this.setState({
                              active: 2,
                            })
                          }
                          key={index}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <div className="mentor-appointment d-flex flex-row ">
                            <div className="mentorstudent-profile ">
                              <div className="mentorstudent-profiledetails d-flex flex-row justify-content-start ">
                                <div className="mentorstudent-profileimg mt-3 ms-3">
                                  <img
                                    src={data.profile_image}
                                    alt=""
                                    className="img-fit img-fluid"
                                  />
                                </div>
                                <div className="mentorstudent-details mt-4 ms-2">
                                  <span className="mentorstudent-Student d-flex">
                                    {data.student_name}
                                  </span>
                                  <span className="mentorstudent-CollegeName d-flex mt-1">
                                    {data.college_name}
                                  </span>
                                  <span className="mentorstudent-Batch d-flex mt-1">
                                    {data.batch}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mentorstudent-stage mt-1 ms-3 d-none d-sm-block">
                              <div className="mentorstudent-stagecircle">
                                <h5 className="mentorstudent-stagenumber ">
                                  {studentProfileUser_Text.Stage}{" "}
                                  {data.stage_no}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </NavLink>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal fade"
          id="completedstudent"
          data-keyboard="false"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered  modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">
                  {studentProfileUser_Text.Completed_Student}
                </h5>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></i>
              </div>
              <div class="modal-body">
                {this.state.completedstudent.length === 0 ? (
                  <div class="spinner-border mt-5 ms-5" role="status">
                    <span class="sr-only ms-5">
                      {studentProfileUser_Text.Loading}
                    </span>
                  </div>
                ) : (
                  <>
                    {this.state.completedstudent.map((data, index) => {
                      let completedDate = `${new Date(
                        data.completed_date
                      ).getDate()}-
                    ${new Date(data.completed_date).getMonth()}-${new Date(
                        data.completed_date
                      ).getFullYear()}`;
                      return (
                        <NavLink
                          to={`${url}/:${data.student_username}`}
                          style={{
                            textDecoration: "none",
                          }}
                        >
                          <div
                            className="mentorstudent-appointment  mt-2 mb-4 "
                            key={index}
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            <div className="mentorstudent-Completed d-flex flex-row ">
                              <div className="mentorstudentCompleted-profile ">
                                <div className="mentorstudent-profiledetails d-flex flex-row justify-content-start mt-3">
                                  <div className="mentorstudent-profileimg my-auto ms-3">
                                    <img
                                      src={data.profile_image}
                                      alt=""
                                      className="img-fit img-fluid"
                                    />
                                  </div>
                                  <div className="mentorstudent-details my-auto ms-2">
                                    <span className="mentorcompleted-Student d-flex">
                                      {data.student_name}
                                    </span>
                                    <span className="mentorcompleted-CollegeName d-flex mt-1">
                                      {data.college_name}
                                    </span>
                                    <span className="mentorcompleted-Batch d-flex mt-1">
                                      {data.batch}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {data.is_approved && (
                                <div className="mentorstudent-stage my-auto d-flex flex-row">
                                  <span className="mentorstudent-date mt-2">
                                    {completedDate}
                                  </span>
                                </div>
                              )}
                              {!data.is_approved && (
                                <div className="review_pending">
                                  <p>Review Pending</p>
                                </div>
                              )}
                              {data.is_approved && (
                                <div className="my-auto">
                                  <img
                                    src="image/done.png"
                                    alt=""
                                    className="img-fluid ps-2 pt-2"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </NavLink>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Mentorprofile);

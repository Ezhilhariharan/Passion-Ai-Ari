import { withRouter } from "react-router";
import React, { Component } from "react";
import Header from "../../../../../navbar/header/Header";
import "./styles/CollegeDashBoard.scss";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { API } from "./api/Get";
import { patchAPI } from "./api/Patch";
import { postAPI } from "./api/Post";
import { Skeleton } from "primereact/skeleton";
import Piechart from "../masterDashBoard/graphchart/piechart/Piechart";
import Barchart from "../masterDashBoard/graphchart/barchart/Bar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { connect } from "react-redux";
import { college_text } from "./const/Const_college_text";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { encode as base64_encode } from "base-64";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { withCookies } from "react-cookie";
// horizontalOptions, basicOptions, c, ctx, d,
let passion_usertype;
let departmentid;
let mainchartindustryname = [];
let stageone = [];
let stagetwo = [];
let stagethree = [];
const SigninSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid email").required("Required"),
});
const passwordSchema = Yup.object().shape({
  password: Yup.string().required("Password Required"),
});
class CollegeDashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeadmindetails: {},
      showpiechart: false,
      usertype: "",
      showBart: false,
      industryDetails: [],
      stageAnalytics: {},
      courseStatus: {},
      editEmail: false,
      editPassword: false,
      message: "",
      show: false,
      piechartindustry_name: [],
      piechartindustry_value: [],
      showHidePassword: false,
    };
    passion_usertype = localStorage.getItem("passion_usertype");
    this.collegeAPI = new API();
    this.patchAPI = new patchAPI();
    this.postAPI = new postAPI();
    this.industryDetails = this.industryDetails.bind(this);
    this.showLoading = this.showLoading.bind(this);
  }
  EmailEdit = (value) => {
    this.setState({ editEmail: true, Email: value });
  };
  componentDidMount() {
    let passion_usertype = localStorage.getItem("passion_usertype");
    if (passion_usertype == 2) {
      //college Dashboard
      this.CollegeDashBoardInitialRender();
    } else if (passion_usertype == 3) {
      //department Dashboard
      this.departmentDashBoardInitialRender();
    } else {
      return null;
    }
  }
  departmentDashBoardInitialRender = () => {
    this.setState({ usertype: passion_usertype });
    this.collegeAPI.getdepartmentDashboard().then((res) => {
      if (res.status) {
        let data = res.data;
        if (data.length) {
          departmentid = data[0]?.department_id;
          this.setState({ collegeadmindetails: data[0] }, () => {
            this.updateDepartmentid()
          });
        } else {
          this.setState({ collegeadmindetails: {} });
        }
      } else {
        this.setState({ collegeadmindetails: {} });
      }
    });
  };
  updateDepartmentid = () => {
    let piechartindustryname = [];
    let piechartindustryvalue = [];
    this.collegeAPI
      .getdepartmentcurrent_vs_completed(departmentid)
      .then((res) => {
        if (res.status) {
          this.setState({ courseStatus: res.data });
          let CoverttoArray = res.data;
          let ConvertedArray = Object.entries(CoverttoArray);
          let splicedArray = ConvertedArray;
          splicedArray.map((item) => {
            let total = 0;
            let industryname = item[0];
            if (item[1] !== null || undefined) {
              let iterated = Object.entries(item[1]);
              iterated.map((data) => {
                total = total + data[1].ongoing_count + data[1].completed_count;
              });
              piechartindustryname.push({ industryname });
              piechartindustryvalue.push({ total });
            } else {
              piechartindustryname.push({ industryname });
              piechartindustryvalue.push({ total });
            }
          });
          this.setState({
            showpiechart: true,
            piechartindustry_name: piechartindustryname,
            piechartindustry_value: piechartindustryvalue,
          });
        }
      });
    this.collegeAPI.getstage_vs_students(departmentid).then((res) => {
      if (res.status) {
        this.setState({ stageAnalytics: res.data }, () =>
          this.industryDetails()
        );
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
              mainchartindustryname.push({
                chartindustryname,
              });
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
              mainchartindustryname.push({
                chartindustryname,
              });
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
      }
    });
  }
  CollegeDashBoardInitialRender = () => {
    let piechartindustryname = [];
    let piechartindustryvalue = [];
    this.setState({ usertype: passion_usertype });
    this.collegeAPI.getDashboard().then((res) => {
      if (res.status) {
        let data = res.data;
        if (data.length) {
          this.setState({ collegeadmindetails: data[0] });
        } else {
          this.setState({ collegeadmindetails: {} });
        }
      } else {
        this.setState({ collegeadmindetails: {} });
      }
    });
    this.collegeAPI.getCompleted_vs_Ongoing().then((res) => {
      if (res.status) {
        this.setState({ courseStatus: res.data });
        let CoverttoArray = res.data;
        let ConvertedArray = Object.entries(CoverttoArray);
        let splicedArray = ConvertedArray;
        splicedArray.map((item) => {
          let total = 0;
          let industryname = item[0];
          if (item[1] !== null || undefined) {
            let iterated = Object.entries(item[1]);
            iterated.map((data) => {
              total = total + data[1].ongoing_count + data[1].completed_count;
            });
            piechartindustryname.push({ industryname });
            piechartindustryvalue.push({ total });
          } else {
            piechartindustryname.push({ industryname });
            piechartindustryvalue.push({ total });
          }
        });
        this.setState({
          showpiechart: true,
          piechartindustry_name: piechartindustryname,
          piechartindustry_value: piechartindustryvalue,
        });
      }
    });
    this.collegeAPI.getBarGraphData().then((res) => {
      if (res.status) {
        this.setState({ stageAnalytics: res.data }, () =>
          this.industryDetails()
        );
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
              mainchartindustryname.push({
                chartindustryname,
              });
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
              mainchartindustryname.push({
                chartindustryname,
              });
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
      }
    });
  };
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  industryDetails() {
    let ConvertedcourseStatusArray = [];
    let ConvertedstageAnalyticsArray = [];
    let mergingIndustryDeatils = [];
    let filteredIndustryDeatils = [];
    ConvertedcourseStatusArray = Object.entries(this.state.courseStatus);
    ConvertedstageAnalyticsArray = Object.entries(this.state.stageAnalytics);
    // console.log("ConvertedcourseStatusArray",ConvertedcourseStatusArray)
    // console.log("ConvertedstageAnalyticsArray",ConvertedstageAnalyticsArray)
    // if (ConvertedcourseStatusArray.length <= 0) {
    //   ConvertedcourseStatusArray = Object.entries(this.state.courseStatus);
    // }
    // if (ConvertedstageAnalyticsArray.length <= 0) {
    //   ConvertedstageAnalyticsArray = Object.entries(this.state.stageAnalytics);
    // }
    ConvertedcourseStatusArray.map((item) => {
      let total = 0;
      let completedstudent = 0;
      let industryname = item[0];
      if (item[1] !== null || undefined) {
        let iterated = Object.entries(item[1]);
        iterated.map((data) => {
          completedstudent = data[1].completed_count;
          total = total + data[1].ongoing_count + data[1].completed_count;
        });
        mergingIndustryDeatils.push({
          industryname,
          total,
          completedstudent,
        });
      } else {
        mergingIndustryDeatils.push({
          industryname,
          total,
          completedstudent,
        });
      }
    });
    ConvertedstageAnalyticsArray.map((item) => {
      let stage_1 = 0;
      let stage_2 = 0;
      let stage_3 = 0;
      let chartindustryname = item[0];
      if (item[1] !== null || undefined) {
        let iteratedstage = Object.entries(item[1]);
        iteratedstage.map((data) => {
          if (data[1] !== null || undefined) {
            stage_1 = stage_1 + data[1].stage_1;
            stage_2 = stage_2 + data[1].stage_2;
            stage_3 = stage_3 + data[1].stage_3;
            if (isNaN(data[1].stage_1)) {
              stage_1 = 0;
            } else if (isNaN(data[1].stage_2)) {
              stage_2 = 0;
            } else if (isNaN(data[1].stage_3)) {
              stage_3 = 0;
            }
          }
        });
        mergingIndustryDeatils.map((data) => {
          if (data.industryname == chartindustryname) {
            filteredIndustryDeatils.push({
              ...data,
              stage_1,
              stage_2,
              stage_3,
            });
          }
        });
      } else {
        mergingIndustryDeatils.map((data) => {
          if (data.industryname == chartindustryname) {
            filteredIndustryDeatils.push({
              ...data,
              stage_1,
              stage_2,
              stage_3,
            });
          }
        });
      }
    });
    if (ConvertedcourseStatusArray.length <= filteredIndustryDeatils.length) {
      this.setState({ industryDetails: filteredIndustryDeatils });
    } else {
      this.setState({ industryDetails: this.state.industryDetails });
    }
  }
  logout = () => {
    this.postAPI
      .logout()
      .then((res) => {
        if (res.status) {
          localStorage.clear();
          this.props.cookies.remove("passion_usertype");
          this.props.cookies.remove("passion_userid");
          this.props.cookies.remove("passion_token");
          delete axios.defaults.headers.common["Authorization"];
          this.props.Logout();
        }
      })
  };
  emailLogout = () => {
    localStorage.clear();
    this.props.cookies.remove("passion_usertype");
    this.props.cookies.remove("passion_userid");
    this.props.cookies.remove("passion_token");
    delete axios.defaults.headers.common["Authorization"];
    this.props.Logout();
  }

  getSearchValue = (value) => {
    this.setState({ searchValue: value });
  };
  closeErrorModal = () => {
    this.setState({ message: "", show: false });
  };
  closeChart = () => {
    // console.log("Chart")
    this.setState({ showBart: false, showpiechart: false });
  }
  render() {
    return (
      <div className="college-dashboard  ">
        <div className="studenthomepage-header d-flex flex-row">
          <Header searchValue={this.getSearchValue} closeChart={this.closeChart} />
        </div>
        <div className="w-100 collegeanddepartment d-flex flex-row justify-content-between  ">
          <div className="w-75 d-flex flex-row justify-content-between pe-5 ">
            {this.state.usertype == 3 ? (
              <div className="appointmentandwebinor-graph ">
                <div className="d-flex flex-row h-100">
                  <div className="h-50 mt-4 ">
                    <div className="college-picture mx-2  ">
                      <img
                        src={
                          this.state.collegeadmindetails.department_image
                            ? this.state.collegeadmindetails.department_image
                            : "/image/errorprofileimg.webp"
                        }
                        alt=""
                        className="img-fluid college-picture-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/image/errorprofileimg.webp";
                        }}
                      />
                    </div>
                  </div>
                  <div className="college-details mt-4 pe-3">
                    <span className="">
                      {this.state.collegeadmindetails === {} ? (
                        <Skeleton
                          width="5rem"
                          className=""
                          style={{
                            backgroundcolor: "black",
                          }}
                        ></Skeleton>
                      ) : (
                        <span>
                          {this.state.collegeadmindetails.college_name}
                        </span>
                      )}
                    </span>
                    <div className="college-address mt-1">
                      {this.state.collegeadmindetails === {} ? (
                        <Skeleton
                          width="5rem"
                          className=""
                          style={{
                            backgroundcolor: "black",
                          }}
                        ></Skeleton>
                      ) : (
                        <span>
                          {this.state.collegeadmindetails.college_address}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 admin_name">
                      {this.state.collegeadmindetails === {} ? (
                        <Skeleton
                          width="5rem"
                          className=""
                          style={{
                            backgroundcolor: "black",
                          }}
                        ></Skeleton>
                      ) : (
                        <span>
                          {this.state.collegeadmindetails.department_user_name}
                        </span>
                      )}
                    </div>
                    <div className="d-flex flex-row mt-2">
                      <i class="fa-light fa-envelope me-2 mt-1"></i>
                      <div className="small-font">
                        {this.state.collegeadmindetails === {} ? (
                          <Skeleton
                            width="5rem"
                            className=""
                            style={{
                              backgroundcolor: "black",
                            }}
                          ></Skeleton>
                        ) : (
                          <span>
                            {" "}
                            {this.state.collegeadmindetails.college_email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="appointmentandwebinor-graph ">
                <div
                  className="edit-details"
                  onClick={() =>
                    this.props.history.push(
                      `/admin/college/edit/${this.state.collegeadmindetails.id}`
                    )
                  }
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </div>
                <div className="d-flex flex-row  ">
                  <div className=" pt-4 px-2">
                    <div className="college-picture mx-auto">
                      <img
                        src={
                          this.state.collegeadmindetails.logo
                            ? this.state.collegeadmindetails.logo
                            : "/image/errorprofileimg.webp"
                        }
                        alt=""
                        className="img-fluid college-picture-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/image/errorprofileimg.webp";
                        }}
                      />
                    </div>
                  </div>
                  <div className="college-details  pt-1 my-4 pe-3">
                    <div className="mt-3">
                      {this.state.collegeadmindetails === {} ? (
                        <Skeleton
                          width="5rem"
                          className=""
                          style={{
                            backgroundcolor: "black",
                          }}
                        ></Skeleton>
                      ) : (
                        <span>{this.state.collegeadmindetails.name}</span>
                      )}
                    </div>
                    <div className="college-address mt-1">
                      {this.state.collegeadmindetails === {} ? (
                        <Skeleton
                          width="5rem"
                          className=""
                          style={{
                            backgroundcolor: "black",
                          }}
                        ></Skeleton>
                      ) : (
                        <span>{this.state.collegeadmindetails.address}</span>
                      )}
                    </div>
                    <div className="d-flex flex-row mt-4 ">
                      <i class="fa-light fa-envelope me-2 mt-1"></i>
                      <div className="small-font">
                        {this.state.collegeadmindetails === {} ? (
                          <Skeleton
                            width="5rem"
                            className=""
                            style={{
                              backgroundcolor: "black",
                            }}
                          ></Skeleton>
                        ) : (
                          <span>{this.state.collegeadmindetails.email}</span>
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-row mt-1">
                      <i class="fa-regular fa-phone me-2 mt-1"></i>
                      <div className="small-font">
                        {this.state.collegeadmindetails === {} ? (
                          <Skeleton
                            width="5rem"
                            className=""
                            style={{
                              backgroundcolor: "black",
                            }}
                          ></Skeleton>
                        ) : (
                          <span>
                            {this.state.collegeadmindetails.mobile_no}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {this.state.usertype == 3 ? (
              <div className="appointmentandwebinor-graph ">
                <div className="d-flex flex-row h-100">
                  <div className="h-50 mt-4">
                    <div className="college-picture  mx-2">
                      <img
                        src={
                          this.state.collegeadmindetails.logo
                            ? this.state.collegeadmindetails.logo
                            : "/image/errorprofileimg.webp"
                        }
                        alt=""
                        className="college-picture-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/image/errorprofileimg.webp";
                        }}
                      />
                    </div>
                  </div>
                  <div className="college-details mt-4 pe-3">
                    <span className="">
                      {this.state.collegeadmindetails === {} ? (
                        <Skeleton
                          width="5rem"
                          className=""
                          style={{
                            backgroundcolor: "black",
                          }}
                        ></Skeleton>
                      ) : (
                        <span>
                          {this.state.collegeadmindetails.college_name}
                        </span>
                      )}
                    </span>
                    <div className="college-address mt-2">
                      {this.state.collegeadmindetails === {} ? (
                        <Skeleton
                          width="5rem"
                          className=""
                          style={{
                            backgroundcolor: "black",
                          }}
                        ></Skeleton>
                      ) : (
                        <span>
                          {this.state.collegeadmindetails.department_name}
                        </span>
                      )}
                    </div>
                    <div className="d-flex flex-row mt-4">
                      <i class="fa-light fa-envelope me-2 mt-1"></i>
                      <div className="small-font">
                        {this.state.collegeadmindetails === {} ? (
                          <Skeleton
                            width="5rem"
                            className=""
                            style={{
                              backgroundcolor: "black",
                            }}
                          ></Skeleton>
                        ) : (
                          <span>
                            {this.state.collegeadmindetails.department_email_id}
                          </span>
                        )}
                        <i
                          class="fa-solid fa-pen ms-2"
                          onClick={() =>
                            this.EmailEdit(
                              this.state.collegeadmindetails.department_email_id
                            )
                          }
                        ></i>
                      </div>
                    </div>
                    <div className="d-flex flex-row mt-3">
                      <i class="fa-regular fa-unlock-keyhole me-2 mt-1"></i>
                      <div className="small-font">
                        <span className="">{college_text.Dotts}</span>
                        <i
                          class="fa-solid fa-pen ms-2"
                          onClick={() => this.setState({ editPassword: true })}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dashboard-feedback   ">
                <div className="plan-title py-3 ps-4">
                  {college_text.SubscriptionPlan}
                </div>
                <div className="row py-3 px-3">
                  <div className="col-7 plan-type">
                    {college_text.SubscriptionType}
                  </div>
                  <div className="col-5 plan-font-color">
                    {this.state.collegeadmindetails.subscription_type}
                  </div>
                </div>
                <div className="row py-3 px-3">
                  <div className="col-7 plan-type">
                    {college_text.StudentLimits}
                  </div>
                  <div className="col-5  plan-font-color">
                    {this.state.collegeadmindetails.student_limit}
                  </div>
                </div>
                <div className="row py-3 px-3">
                  <div className="col-7 plan-type">{college_text.Date}</div>
                  <div className="col-5 plan-font">{college_text.Dates}</div>
                </div>
              </div>
            )}
          </div>
          <div className="masterdashboard-downloadpart ">
            {this.state.usertype == 2 ? (
              <div className="downloaded-app d-flex flex-row p-2">
                <div className="list-img col-4">
                  <img src="/image/download-db.png" alt="" className="" />
                </div>
                <div className="col-8 ps-3 my-auto">
                  <h6>{college_text.Department}</h6>
                  <div className="download-count">
                    {this.state.collegeadmindetails.department_count}
                  </div>
                </div>
              </div>
            ) : null}
            <div
              className={
                this.state.usertype == 2
                  ? "downloaded-app d-flex flex-row  p-2"
                  : "downloaded-app d-flex flex-row  p-2"
              }
            >
              <div className="list-img col-4">
                <img src="/image/student-db.png" alt="" className="" />
              </div>
              <div className="col-6 ps-3 my-auto">
                <h6>{college_text.Student} </h6>
                <div className="download-count">
                  {this.state.collegeadmindetails.student_count}
                </div>
              </div>
              <div className="col-2 my-auto ms-3"></div>
            </div>
            {this.state.usertype == 3 ? (
              <div className="downloaded-app mt-4 d-flex flex-row p-2">
                <div className="list-img col-4">
                  <img src="/image/support_contact.png" alt="" className="" />
                </div>
                <div className="col-8 ps-3 my-auto">
                  <h6>{college_text.SupportContact}</h6>
                  <div className="">
                    <i class="fa-light fa-envelope me-2 mt-1"></i>
                    {college_text.email_id}
                  </div>
                  <div className="">
                    <i class="fa-regular fa-phone me-2 mt-1"></i>
                    {college_text.phoneno}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className=" w-100 dashboardgraph-college d-flex flex-row justify-content-between mt-2">
          <div className="w-75 pe-5">
            {this.state.showBart ? (
              <Barchart
                stageone={stageone}
                stagetwo={stagetwo}
                stagethree={stagethree}
                industryname={mainchartindustryname}
              />
            ) : (
              <div className="dashboard-bargraph ">
                <img
                  src="/image/connectionfailed.png"
                  alt=""
                  className="img-fluid"
                />
              </div>
            )}
          </div>
          <div className="dashboard-piechart my-auto ">
            <div className="d-flex flex-row col-12 py-2">
              <div className="dashboard-piechart-title col-6 ps-3">
                {" "}
                {college_text.Industry}
              </div>
              <div
                className="dashboard-piechart-viewmore col-6 d-flex flex-row justify-content-end pe-3"
                data-bs-toggle="modal"
                data-bs-target="#open-collegeindustrymodal"
              >
                {" "}
                {college_text.Viewmore}
              </div>
            </div>
            {this.state.showpiechart ? (
              <Piechart
                industryname={this.state.piechartindustry_name}
                industryvalue={this.state.piechartindustry_value}
              />
            ) : (
              <div className="appointmentandwebinor-graph ">
                <img
                  src="/image/connectionfailed.png"
                  alt=""
                  className="img-fluid mx-auto"
                />
              </div>
            )}
          </div>
        </div>
        <div
          class="modal fade"
          id="open-collegeindustrymodal"
          tabindex="-1"
          aria-labelledby="addQuestionModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h4 className="mx-auto ps-4">{college_text.Industry}</h4>
                <i
                  class="fa-regular fa-circle-xmark  "
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></i>
              </div>
              <div class="modal-body">
                <div
                  className="table-wrapper pt-3"
                  style={{ height: "calc(100vh - 190px)" }}
                >
                  <DataTable value={this.state.industryDetails} scrollable>
                    <Column
                      field="industryname"
                      header="Industry name"
                    ></Column>
                    <Column field="total" header="No.ofstudents"></Column>
                    <Column field="stage_1" header="Stage1"></Column>
                    <Column field="stage_2" header="Stage2"></Column>
                    <Column field="stage_3" header="Stage3"></Column>
                    <Column
                      field="completedstudent"
                      header="Stage Completed"
                    ></Column>
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.editPassword}
          onHide={() => this.setState({ editPassword: false })}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
            <div className="d-flex flex-row justify-content-end w-100">
              <i
                class="fa-regular fa-circle-xmark  ms-auto"
                onClick={() => this.setState({ editPassword: false })}
              ></i>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{
                password: "",
              }}
              onSubmit={(values, onSubmitProps) => {
                let formData = new FormData();
                let encoded = base64_encode(values.password);
                formData.append("password", encoded);
                this.showLoading();
                this.patchAPI
                  .editPassword(departmentid, formData)
                  .then((res) => {
                    this.showLoading();
                    if (res.status) {
                      this.logout();
                      this.setState({ editPassword: false });
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
                  });
              }}
              validationSchema={passwordSchema}
            >
              {({ values }) => (
                <Form className="customFormAdmin px-3 mt-5">
                  <div className="form-group mt-3 mb-5">
                    <label className="label">{college_text.password}</label>
                    <div className="password-input-dashboard d-flex flex-row  ">
                      <Field
                        id="password"
                        name="password"
                        type={this.state.showHidePassword ? "text" : "password"}
                        className="input"
                      />
                      {values.password !== "" && (
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
                      )}
                    </div>
                    <ErrorMessage name="password">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <Modal.Footer>
                    <div className="d-flex flex-row justify-content-center mb-4 mt-3 w-100">
                      <button type="submit" className="btn-blue ">
                        {college_text.Edit}
                      </button>
                    </div>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
        <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.editEmail}
          onHide={() => this.setState({ editEmail: false })}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
            <div className="d-flex flex-row justify-content-end w-100">
              <i
                class="fa-regular fa-circle-xmark  ms-auto"
                onClick={() => this.setState({ editEmail: false })}
              ></i>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{
                email: this.state.Email,
              }}
              onSubmit={(values, onSubmitProps) => {
                let formData = new FormData();
                formData.append("email", values.email);
                this.showLoading();
                this.patchAPI.editEmail(departmentid, formData).then((res) => {
                  this.showLoading();
                  if (res.status) {

                    this.emailLogout();
                    this.setState({ editEmail: false });
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
                });
              }}
              enableReinitialize={true}
              validationSchema={SigninSchema}
            >
              <Form className="customFormAdmin px-3 mt-5">
                <div className="form-group mt-3 mb-5">
                  <label className="label">{college_text.Email}</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="input"
                  />
                  <ErrorMessage name="email">
                    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                  </ErrorMessage>
                </div>
                <Modal.Footer>
                  <div className="d-flex flex-row justify-content-center mb-4 mt-3 w-100">
                    <button type="submit" className="btn-blue ">
                      {college_text.Edit}
                    </button>
                  </div>
                </Modal.Footer>
              </Form>
            </Formik>
          </Modal.Body>
        </Modal>
        {/* <Modal
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    show={this.state.show}
                    onHide={() => this.setState({ show: false })}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="">
                            <center className="mt-3 mb-3">
                                <h2>{this.state.message}</h2>
                            </center>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            onClick={() => this.setState({ show: false })}
                            className="btn-blue mx-auto mt-5 mb-5 w-50"
                        >
                            {college_text.Ok}
                        </button>
                    </Modal.Footer>
                </Modal> */}
        <ErrorModal
          message={this.state.message}
          value={this.state.show}
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
    isLoggedIn: state.user.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleTheme: () => {
      dispatch({ type: "TOGGLE_THEME" });
    },
    Logout: () => {
      dispatch({ type: "LOGOUT" });
    },
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
  };
};
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withRouter(CollegeDashBoard));
export default withCookies(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(CollegeDashBoard))
);

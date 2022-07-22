import { withRouter } from "react-router";
import Header from "../../../../../navbar/header/Header";
import "./styles/MasterDashBoard.scss";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { API } from "./api/Api";
import Piechart from "../masterDashBoard/graphchart/piechart/Piechart";
import React, { Component } from "react";
import { Skeleton } from "primereact/skeleton";
import WebinarandAppointment from "../masterDashBoard/graphchart/webinar&appointment/WebinarAndAppointment";
import { NavLink } from "react-router-dom";
import Barchart from "./graphchart/barchart/Bar";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { dashboardText } from "../../Const_Dashboard";
let getIndustryList = [{ value: "", label: "Select an industry" }];
let piechartindustryname = [];
let piechartindustryvalue = [];
let mainchartindustryname = [];
let stageone = [];
let stagetwo = [];
let stagethree = [];
class MasterDashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industrylist: getIndustryList,
      getuserslist: "",
      webinar: [],
      appiontment: [],
      showWebinarandAppointment: false,
      showpiechart: false,
      star_count: "",
      initialfeedback: [],
      filterfeedback: [],
      showBart: false,
      stageAnalytics: {},
      courseStatus: {},
      industryDetails: [],
      ratingOne: "",
      ratingTwo: "",
      ratingThree: "",
      ratingFour: "",
      ratingFive: "",
      ratingSix: "",
      filterstar_count: "",
      showError: false,
      errorMessage: "",
    };
    this.myRef = React.createRef();
    this.courseAPI = new API();
    this.getFeedback = this.getFeedback.bind(this);
    this.industryDetails = this.industryDetails.bind(this);
    this.industryList = this.industryList.bind(this);
    this.getCourseStatus = this.getCourseStatus.bind(this);
    this.getFeedback = this.getFeedback.bind(this);
    this.getWebinarsandAppiontments =
      this.getWebinarsandAppiontments.bind(this);
    this.getUsers_Count = this.getUsers_Count.bind(this);
    this.getStage_Analytics = this.getStage_Analytics.bind(this);
    this.getStar_Count = this.getStar_Count.bind(this);
    this.getInitialFeedback = this.getInitialFeedback.bind(this);
  }
  componentDidMount() {
    this.industryList();
    this.getWebinarsandAppiontments();
    this.getCourseStatus();
    this.getUsers_Count();
    this.getStage_Analytics();
    this.getStar_Count();
    this.getInitialFeedback();
  }
  industryList() {
    this.courseAPI.getIndustryList().then((res) => {
      if (res.status) {
        this.setState({ industrylist: res.data });
      } else {
        this.setState({ industrylist: getIndustryList });
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ errorMessage: value[0], showError: true });
          } else {
            this.setState({ errorMessage: res.message, showError: true });
          }
        } else {
          this.setState({
            errorMessage: "Something Went Wrong",
            showError: true,
          });
        }
      }
    });
  }
  getInitialFeedback() {
    this.courseAPI.getFeedback().then((res) => {
      if (res.status) {
        this.setState({ initialfeedback: res.data.results });
      } else {
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ errorMessage: value[0], showError: true });
          } else {
            this.setState({ errorMessage: res.message, showError: true });
          }
        } else {
          this.setState({
            errorMessage: "Something Went Wrong",
            showError: true,
          });
        }
      }
    });
  }
  getWebinarsandAppiontments() {
    this.courseAPI.getWebinarsandAppiontments().then((res) => {
      if (res.status) {
        let data = res.data;
        let appiontment = [
          data.completed_appiontments,
          data.future_appiontments,
        ];
        let webinar = [data.completed_webinar, data.future_webinar];
        this.setState({
          appiontment: appiontment,
          webinar: webinar,
          showWebinarandAppointment: true,
        });
      } else {
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ errorMessage: value[0], showError: true });
          } else {
            this.setState({ errorMessage: res.message, showError: true });
          }
        } else {
          this.setState({
            errorMessage: "Something Went Wrong",
            showError: true,
          });
        }
      }
    });
  }
  getUsers_Count() {
    this.courseAPI.getUsers_Count().then((res) => {
      if (res.status) {
        this.setState({ getuserslist: res.data[0] });
      } else {
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ errorMessage: value[0], showError: true });
          } else {
            this.setState({ errorMessage: res.message, showError: true });
          }
        } else {
          this.setState({
            errorMessage: "Something Went Wrong",
            showError: true,
          });
        }
      }
    });
  }
  getStage_Analytics() {
    this.courseAPI.getStage_Analytics().then((res) => {
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
      } else {
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ errorMessage: value[0], showError: true });
          } else {
            this.setState({ errorMessage: res.message, showError: true });
          }
        } else {
          this.setState({
            errorMessage: "Something Went Wrong",
            showError: true,
          });
        }
      }
    });
  }
  getStar_Count() {
    this.courseAPI.getStar_Count(1).then((res) => {
      if (res.status) {
        let CoverStar_CounttoArray = res.data;
        let ConvertedStar_CountArray = Object.entries(CoverStar_CounttoArray);
        this.setState({
          star_count: ConvertedStar_CountArray[0][1]?.course_1,
        });
      } else {
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ errorMessage: value[0], showError: true });
          } else {
            this.setState({ errorMessage: res.message, showError: true });
          }
        } else {
          this.setState({
            errorMessage: "Something Went Wrong",
            showError: true,
          });
        }
      }
    });
  }
  getFeedback(e) {
    this.courseAPI.getFeedback(e.target.value).then((res) => {
      if (res.status) {
        this.setState({ filterfeedback: res.data.results });
      } else {
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ errorMessage: value[0], showError: true });
          } else {
            this.setState({ errorMessage: res.message, showError: true });
          }
        } else {
          this.setState({
            errorMessage: "Something Went Wrong",
            showError: true,
          });
        }
      }
    });
    this.courseAPI.getStar_Count(e.target.value).then((res) => {
      if (res.status) {
        if (Object.keys(res.data).length > 0) {
          let CoverStar_CounttoArray = Object.entries(res.data);
          let ConvertedStar_CountArray = CoverStar_CounttoArray[0][1];
          this.setState({
            filterstar_count: CoverStar_CounttoArray[0][1]?.course_1,
          });
        }
      } else {
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ errorMessage: value[0], showError: true });
          } else {
            this.setState({ errorMessage: res.message, showError: true });
          }
        } else {
          this.setState({
            errorMessage: "Something Went Wrong",
            showError: true,
          });
        }
      }
    });
  }
  getCourseStatus() {
    this.courseAPI.getCourse_Status().then((res) => {
      if (res.status) {
        let CoverttoArray = res.data;
        this.setState({ courseStatus: CoverttoArray });
        let ConvertedArray = Object.entries(CoverttoArray);
        let splicedArray = ConvertedArray.splice(0, 6);
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
        this.setState({ showpiechart: true });
      } else {
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ errorMessage: value[0], showError: true });
          } else {
            this.setState({ errorMessage: res.message, showError: true });
          }
        } else {
          this.setState({
            errorMessage: "Something Went Wrong",
            showError: true,
          });
        }
      }
    });
  }
  industryDetails() {
    let filteredIndustryDeatils = [];
    let mergingIndustryDeatils = [];
    let ConvertedcourseStatusArray = Object.entries(this.state.courseStatus);
    let ConvertedstageAnalyticsArray = Object.entries(
      this.state.stageAnalytics
    );
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
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  closeChart = () => {
    // console.log("Chart")
    this.setState({ showBart: false, showWebinarandAppointment: false, showBart: false });
  }
  render() {
    return (
      <div className="dashboard ">
        <div className="studenthomepage-header d-flex flex-row">
          <Header closeChart={this.closeChart} />
        </div>
        <div className="dashboard-topcard-holder px-5">
          <div className="dashboard-topcard d-flex flex-row p-2">
            <div className="list-img col-4">
              <img src="/image/student-db.png" alt="" className="" />
            </div>
            <div className="col-8 ps-3 my-auto">
              <h6>{dashboardText.student}</h6>
              <span>
                {this.state.getuserslist === "" ? (
                  <Skeleton
                    width="3rem"
                    className="mt-4"
                    style={{ backgroundcolor: "black" }}
                  ></Skeleton>
                ) : (
                  this.state.getuserslist.student_count
                )}
              </span>
            </div>
          </div>
          <div className="dashboard-topcard d-flex flex-row p-2">
            <div className="list-img col-4">
              <img src="/image/mentor-db.png" alt="" className="" />
            </div>
            <div className="col-6 ps-3 my-auto">
              <h6>{dashboardText.mentor}</h6>
              <span>
                {this.state.getuserslist === "" ? (
                  <Skeleton
                    width="3rem"
                    className="mt-4"
                    style={{ backgroundcolor: "black" }}
                  ></Skeleton>
                ) : (
                  this.state.getuserslist.mentor_count
                )}
              </span>
            </div>
            <div className="col-2">
              <NavLink
                to={"/admin/mentors/addmentor"}
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <div className="dashboard-add-icon ">
                  <i class="fa-regular fa-plus"></i>
                </div>
              </NavLink>
            </div>
          </div>
          <div className="dashboard-topcard d-flex flex-row p-2">
            <div className="list-img col-4">
              <img src="/image/expert-db.png" alt="" className="" />
            </div>
            <div className="col-6 ps-3 my-auto">
              <h6>{dashboardText.expert}</h6>
              <span>
                {this.state.getuserslist === "" ? (
                  <Skeleton
                    width="3rem"
                    className="mt-4"
                    style={{ backgroundcolor: "black" }}
                  ></Skeleton>
                ) : (
                  this.state.getuserslist.expert_count
                )}
              </span>
            </div>
            <div className="col-2">
              <NavLink
                to={"/admin/experts/addexpert"}
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <div className="dashboard-add-icon ">
                  <i class="fa-regular fa-plus"></i>
                </div>
              </NavLink>
            </div>
          </div>
          <div className="dashboard-topcard d-flex flex-row p-2">
            <div className="list-img col-4">
              <img src="/image/college-db.png" alt="" className="" />
            </div>
            <div className="col-6 ps-3 my-auto">
              <h6>{dashboardText.college}</h6>
              <span>
                {this.state.getuserslist === "" ? (
                  <Skeleton
                    width="3rem"
                    className="mt-4"
                    style={{ backgroundcolor: "black" }}
                  ></Skeleton>
                ) : (
                  this.state.getuserslist.college_count
                )}
              </span>
            </div>
            <div className="col-2">
              <NavLink
                to={"/admin/colleges/addcollege"}
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <div className="dashboard-add-icon ">
                  <i class="fa-regular fa-plus"></i>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
        <div className=" w-100 dashboardgraph d-flex flex-row justify-content-between px-5 ">
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
                {dashboardText.industry}
              </div>
              <div className="col-6 d-flex flex-row justify-content-end pe-3">
                <div
                  className="dashboard-piechart-viewmore"
                  data-bs-toggle="modal"
                  data-bs-target="#open-industrymodal"
                >
                  View more
                </div>
              </div>
            </div>
            {this.state.showpiechart ? (
              <Piechart
                industryname={piechartindustryname}
                industryvalue={piechartindustryvalue}
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
        </div>
        <div className="w-100 dashboard-footer d-flex flex-row justify-content-between px-5 ">
          <div className="w-75 d-flex flex-row justify-content-between pe-5 ">
            {this.state.showWebinarandAppointment ? (
              <WebinarandAppointment
                webinar={this.state.webinar}
                appointment={this.state.appiontment}
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
            <div className="dashboard-feedback   ">
              <div className="webinar-card-title d-flex flex-row">
                <div className="webinar-card-title-name my-auto me-auto ms-4 pt-1">
                  {dashboardText.feedback}
                </div>
                <div
                  className="webinar-card-view my-auto ms-auto me-4"
                  data-bs-toggle="modal"
                  data-bs-target="#open-rateandreview"
                >
                  {dashboardText.viewMore}
                </div>
              </div>
              <div className="d-flex flex-row justify-content-between px-3 py-2 mt-1">
                <Progress
                  type="circle"
                  strokeWidth={7}
                  width={50}
                  percent={this.state.star_count.one_star}
                  theme={{
                    active: {
                      trailColor: "rgba(196, 196, 196, 0.25)",
                      color: "#2B2E4A",
                    },
                  }}
                />
                <Progress
                  type="circle"
                  strokeWidth={7}
                  width={50}
                  percent={this.state.star_count.two_star}
                  theme={{
                    active: {
                      trailColor: "rgba(196, 196, 196, 0.25)",
                      color: "#2B2E4A",
                    },
                  }}
                />
                <Progress
                  type="circle"
                  strokeWidth={7}
                  width={50}
                  percent={this.state.star_count.three_star}
                  theme={{
                    active: {
                      trailColor: "rgba(196, 196, 196, 0.25)",
                      color: "#2B2E4A",
                    },
                  }}
                />
                <Progress
                  type="circle"
                  strokeWidth={7}
                  width={50}
                  percent={this.state.star_count.four_star}
                  theme={{
                    active: {
                      trailColor: "rgba(196, 196, 196, 0.25)",
                      color: "#2B2E4A",
                    },
                  }}
                />
                <Progress
                  type="circle"
                  strokeWidth={7}
                  width={50}
                  percent={this.state.star_count.five_star}
                  theme={{
                    active: {
                      trailColor: "rgba(196, 196, 196, 0.25)",
                      color: "#2B2E4A",
                    },
                  }}
                />
              </div>
              {this.state.initialfeedback.length !== 0 ? (
                <>
                  {this.state.initialfeedback.slice(0, 2).map((data, index) => (
                    <div className=" d-flex flex-row  mt-2" key={index}>
                      <div className=" ms-3 me-1">
                        <div className="industry-big mt-2">{index + 1}.</div>
                      </div>
                      <div className="col-9 ms-2 ">
                        <div className="col-12  d-flex flex-row">
                          <div className="">
                            <div className="student-pic">
                              <img
                                src={data.profile_image}
                                alt=""
                                className=""
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/image/errorprofileimg.webp";
                                }}
                              />
                            </div>
                          </div>
                          <div className=" ms-2">
                            <div className="name">{data.user_name}</div>
                            <div className="industry">{data.industry_name}</div>
                          </div>
                        </div>
                        <div className="col-12 ">
                          <div className="industry-big mt-1">
                            {data.feedback}
                          </div>
                        </div>
                      </div>
                      <div className=" ">
                        <p>{data.rating}</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : null}
            </div>
          </div>
          <div className="masterdashboard-downloadpart ">
            <div className="downloaded-app d-flex flex-row p-2">
              <div className="list-img col-4">
                <img src="/image/download-db.png" alt="" className="" />
              </div>
              <div className="col-8 ps-3 my-auto">
                <h6>{dashboardText.download}</h6>
                <div className="download-count">45</div>
              </div>
            </div>
            <div className="downloaded-app  d-flex flex-row p-2">
              <div className="list-img col-4">
                <img src="/image/student-approval-db.png" alt="" className="" />
              </div>
              <div className="col-6 ps-3 my-auto">
                <h6>{dashboardText.studentapproval}</h6>
                <div className="download-count">
                  {this.state.getuserslist === "" ? (
                    <Skeleton
                      width="3rem"
                      className="mt-4"
                      style={{ backgroundcolor: "black" }}
                    ></Skeleton>
                  ) : (
                    this.state.getuserslist.inactive_student_count
                  )}
                </div>
              </div>
              <div className="col-2 my-auto ms-3 student-approval">
                <NavLink
                  to={"/admin/students/studentapproval"}
                  style={{ textDecoration: "none" }}
                >
                  <i class="fa-regular fa-angle-right "></i>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal fade"
          id="open-industrymodal"
          tabindex="-1"
          aria-labelledby="addQuestionModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-scrollable modal-xl modal-dialog-centered ">
            <div class="modal-content">
              <div class="modal-header">
                <h4 className="mx-auto ps-3">{dashboardText.industry}</h4>
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
        <div
          class="modal fade"
          id="open-rateandreview"
          tabindex="-1"
          aria-labelledby="open-rateandreview"
          aria-hidden="true"
        >
          <div class="modal-dialog  modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h4 className="ps-4 col-5">{dashboardText.rateandreview}</h4>
                <div className="col-6 d-flex flex-row justify-content-end">
                  <select
                    className="dropdown-select ms-auto"
                    onChange={this.getFeedback}
                  >
                    {this.state.industrylist.map((option) => (
                      <option value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>
                <i
                  class="fa-regular fa-circle-xmark  ms-4"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></i>
              </div>
              <div class="modal-body">
                <div className="rateandreview-modal p-2 mb-2">
                  <div className=" d-flex flex-row justify-content-center mb-4">
                    <div className="modal-rating d-flex flex-row justify-content-between  px-3 py-2 mt-1">
                      <Progress
                        type="circle"
                        strokeWidth={7}
                        width={50}
                        percent={this.state.filterstar_count.one_star}
                        theme={{
                          active: {
                            trailColor: "rgba(196, 196, 196, 0.25)",
                            color: "#2B2E4A",
                          },
                        }}
                      />
                      <Progress
                        type="circle"
                        strokeWidth={7}
                        width={50}
                        percent={this.state.filterstar_count.two_star}
                        theme={{
                          active: {
                            trailColor: "rgba(196, 196, 196, 0.25)",
                            color: "#2B2E4A",
                          },
                        }}
                      />
                      <Progress
                        type="circle"
                        strokeWidth={7}
                        width={50}
                        percent={this.state.filterstar_count.three_star}
                        theme={{
                          active: {
                            trailColor: "rgba(196, 196, 196, 0.25)",
                            color: "#2B2E4A",
                          },
                        }}
                      />
                      <Progress
                        type="circle"
                        strokeWidth={7}
                        width={50}
                        percent={this.state.filterstar_count.four_star}
                        theme={{
                          active: {
                            trailColor: "rgba(196, 196, 196, 0.25)",
                            color: "#2B2E4A",
                          },
                        }}
                      />
                      <Progress
                        type="circle"
                        strokeWidth={7}
                        width={50}
                        percent={this.state.filterstar_count.five_star}
                        theme={{
                          active: {
                            trailColor: "rgba(196, 196, 196, 0.25)",
                            color: "#2B2E4A",
                          },
                        }}
                      />
                    </div>
                  </div>
                  {this.state.initialfeedback.length !== 0 ? (
                    <>
                      {this.state.filterfeedback.map((data, index) => (
                        <div
                          className="modal-row d-flex flex-row mb-3 p-3 mx-auto"
                          key={index}
                        >
                          <div className=" industry-big mt-2">{index + 1}.</div>
                          <div className=" d-flex flex-row w-100">
                            <div className="student-pic ms-3 me-2">
                              <img
                                src={data.profile_image}
                                alt=""
                                className=""
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/image/errorprofileimg.webp";
                                }}
                              />
                            </div>
                            <div className="col-8">
                              <div className="d-flex flex-row">
                                <div className="name">{data.user_name}</div>
                                <div className="p ms-3">{data.rating}</div>
                              </div>
                              <div className="industry">
                                {data.industry_name}
                              </div>
                              <div className=" industry-big mt-1 ">
                                {data.feedback}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ErrorModal
          message={this.state.errorMessage}
          value={this.state.showError}
          closeModal={this.closeErrorModal}
        />
      </div>
    );
  }
}
export default withRouter(MasterDashBoard);

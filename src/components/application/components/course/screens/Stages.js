import React, { Component } from "react";
import Sidenavbar from "../../../../navbar/sidenavbar/Sidenavbar";
import "../styles/Stages.scss";
import StageRender from "./StageRender";
import axios from "axios";
import { courseAPI } from "../api/Api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal } from "bootstrap";
import { connect } from "react-redux";
import * as Yup from "yup";
import { withRouter } from "react-router-dom";
import { CourseText } from "../const/Const_course";
import Dropdown from "react-bootstrap/Dropdown";
import { API } from "../../../../navbar/header/api/Api.js";
import { withCookies } from "react-cookie";
import { GoogleLogout } from 'react-google-oauth'
import { GoogleAPI } from "react-google-oauth";

const createpostSchema = Yup.object().shape({
  post: Yup.string().required("Required"),
});
class Stages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
      currentstagecontent: [],
      stagetwo: "",
      stagethree: "",
      stagefour: "",
      currentcontent_id: "",
      currentstage: "",
      totalstage: "",
      course_id: "",
      localdata: "",
      stage_completed: "",
      stagefinished: true,
      showstage: false,
      stagestarted: "",
      startCount: 5,
      updateStage: 0,
      selectedbutton: "",
      activeStage: "",
      dropdown: false,
      stageButtonArray: [],
    };
    this.courseAPI = new courseAPI();
    this.logoutAPI = new API();
    this.modalRef = React.createRef();
    this.rateUsModal = React.createRef();
    this.getdata = this.getdata.bind(this);
    this.ChangeStageButton = this.ChangeStageButton.bind(this);
    this.showLoading = this.showLoading.bind(this);
    this.showRateusModal = this.showRateusModal.bind(this);
  }
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  componentDidMount() {
    if (typeof axios.defaults.headers.common["Authorization"] === "undefined") {
      axios.defaults.headers.common["Authorization"] =
        "Token " + localStorage.getItem("passion_token");
    }
    this.getdata();
  }
  getdata() {
    this.showLoading();
    this.courseAPI.getCourse().then((data) => {
      this.showLoading();
      if (data.status) {
        this.setState({
          currentstagecontent: data.data[0]?.content.filter(
            (element) => element.stage_no == data.data[0]?.current_stage
          ),
          currentcontent_id: data.data[0]?.current_content_id,
          currentstage: data.data[0]?.current_stage,
          totalstage: data.data[0]?.total_stages,
          course_id: data.data[0]?.course_id,
          stage_completed: data.data[0]?.completed,
          showstage: true,
          stagestarted: data.data[0]?.stage_started,
          activeStage: data.data[0]?.current_stage,
        });
        // let temp = [data.data[0]?.total_stages];
        for (let i = 0; i < data.data[0]?.total_stages; i++) {
          if (i + 1 === data.data[0]?.current_stage) {
            this.setState({ activeStage: i + 1 });
          }
        }
      } else {
        this.setState({ showstage: false });
      }
    });
  }
  ChangeStageButton(index) {
    this.setState({ showstage: false });
    this.setState({ activeStage: index + 1 });
    this.setState({ stagefinished: false });
    this.showLoading();
    this.courseAPI.getCourse().then((data) => {
      if (data.status) {
        this.showLoading();
        this.setState({
          currentstagecontent: data.data[0]?.content.filter(
            (element) => element.stage_no == index + 1
          ),
          currentcontent_id: data.data[0]?.current_content_id,
          currentstage: data.data[0]?.current_stage,
          totalstage: data.data[0]?.total_stages,
          course_id: data.data[0]?.course_id,
          stage_completed: data.data[0]?.completed,
          showstage: true,
          stagestarted: data.data[0]?.stage_started,
        });
      } else {
        this.setState({ showstage: false });
      }
    });
  }
  showModal = () => {
    const modalEle = this.modalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideModal = () => {
    const modalEle = this.modalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  multipleFunction = () => {
    this.hideModal();
    this.showRateusModal();
  };
  FeedBackNo = () => {
    this.hideModal();
    this.props.history.push("/setting/help&support");
  };
  showRateusModal() {
    const modalEle = this.rateUsModal.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  }
  hideRateusModal = () => {
    const modalEle = this.rateUsModal.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  changeTheme = () => {
    this.props.toggleTheme();
  };
  mainLogout = () => {
    let googleOauth = this.props.cookies.get('OG')
    if (googleOauth) {
      this.logout()
    }
    this.logoutAPI.logout().then((res) => {
      if (res.status) {
        localStorage.clear();
        this.props.cookies.remove("passion_usertype");
        this.props.cookies.remove("passion_userid");
        this.props.cookies.remove("passion_token");
        delete axios.defaults.headers.common["Authorization"];
        this.props.logoutuser();
        // window.FB.logout()
      }
    });
  };
  logout(response) {
    console.log("google logout response", response);
  }
  changeTheme = () => {
    this.props.toggleTheme();
    this.setState({ active: !this.state.active });
  };
  render() {
    return (
      <div className="stages">
        <Sidenavbar />
        <div className="studenthomepage-header d-flex flex-row">
          <div className="header-logo my-auto d-flex flex-row  col-xxl-3  col-xl-3 col-lg-2 col-md-1 col-sm-2 col-3">
            <img
              src="/image/passionlogo.png"
              alt=""
              className=" passion-logo  img-fluid d-none d-md-none d-lg-block "
            />
            <img
              src="/image/passion_logo.png"
              alt=""
              className=" passion-logo  img-fluid d-block d-md-block d-sm-block d-lg-none my-auto ms-3"
            />
          </div>
          <div className="stage-navigation col-xxl-4  col-xl-6 col-lg-6 col-md-9 col-sm-8 col-6 pt-1">
            {Array.from(Array(this.state.totalstage)).map((item, index) => (
              <button
                onClick={() => this.ChangeStageButton(index)}
                className={
                  this.state.activeStage === index + 1
                    ? "active"
                    : this.state.currentstage >= index + 1
                      ? // ? this.state.stage_completed ? 'finished' : 'nav-button':"finished"}
                      "finished"
                      : this.state.stage_completed
                        ? "finished"
                        : "nav-button"
                }
                disabled={
                  this.state.stage_completed
                    ? false
                    : this.state.currentstage < index + 1
                }
              >
                Stage {index + 1}
              </button>
            ))}
          </div>
          <div className="header-logo my-auto ms-auto d-flex flex-row col-xxl-5  col-xl-3 col-lg-4 col-md-2 col-sm-2 col-3">
            <h1 className="my-auto ms-auto d-none d-md-none d-lg-block me-4">
              {" "}
              {this.props.user.username}
            </h1>
            <Dropdown autoClose="outside">
              <Dropdown.Toggle variant="none" id="dropdown-basic">
                <div className=" profile-img-header d-flex my-auto  me-4">
                  <img
                    src={this.props.user.profile_image}
                    alt=""
                    className="profile-imgin"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image/errorprofileimg.webp";
                    }}
                  />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="logo-dropdown ">
                <Dropdown.Item
                  className="dropdown-row  my-auto "
                  onClick={() => this.props.showNotification()}
                >
                  <img
                    src="/image/notification.webp"
                    alt=""
                    className="col-1 me-2"
                  />
                  <span className="col-6">{CourseText.Notification}</span>
                  <div className="col-3"></div>
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-row  my-auto ">
                  <img src="/image/theme.webp" alt="" className="col-1 me-2" />
                  <span className="col-6">{CourseText.Darkmode}</span>
                  <div className="col-3 ">
                    <label
                      class="customised-switch"
                      onClick={() => this.changeTheme()}
                    >
                      <input type="checkbox" />
                      <span
                        className={
                          this.state.active
                            ? "customised-slider customised-slider-active customised-round"
                            : "customised-slider customised-slider-inactive customised-round"
                        }
                      ></span>
                    </label>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item
                  className="dropdown-row  my-auto "
                  onClick={() => this.mainLogout()}
                >
                  <img src="/image/logout.webp" alt="" className="col-1 me-2" />
                  <span className="col-6"> {CourseText.Logout}</span>
                  <div className="col-3"></div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        {this.state.showstage ? (
          <StageRender
            stagedata={this.state.currentstagecontent}
            currentcontentid={this.state.currentcontent_id}
            courseid={this.state.course_id}
            stagenum={this.state.currentstage}
            nextstages={this.nextstage}
            changestage={this.changestage}
            getdata={this.getdata}
            showModal={this.showModal}
            currentstage={this.state.currentstage}
            stage_completed={this.state.stage_completed}
            stagestarted={this.state.stagestarted}
            totalstage={this.state.totalstage}
            Loading={this.showLoading}
          />
        ) : (
          <center>
            <h1>{CourseText.OnProgress}</h1>
          </center>
        )}
        <div
          class="modal"
          id="feedbackquestion"
          ref={this.modalRef}
          tabIndex="-1"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content px-4">
              <div class="modal-body">
                <div className="congratulation">
                  <h3 className="mt-4"> {CourseText.FeedbackQuestion}</h3>
                  <img
                    src="image/feedbackquestionlogo.png"
                    alt=""
                    className="img-fluid mt-5"
                  />
                  <p className="mt-5 mb-3">{CourseText.Loream}</p>
                  <div className="d-flex flex-row justify-content-center mb-5 pb-3 w-100 ">
                    <button
                      className="btn-yellow mt-5 w-25"
                      onClick={this.multipleFunction}
                    >
                      {CourseText.Yes}
                    </button>
                    <button
                      className="btn-yellow mt-5 ms-5 w-25"
                      onClick={this.FeedBackNo}
                    >
                      {CourseText.No}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal fade"
          id="rateus"
          ref={this.rateUsModal}
          tabIndex="-1"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header"></div>
              <div class="modal-body">
                <div className="congratulation">
                  <h1>{CourseText.FeedbackQuestion}</h1>
                  <p className="mt-5 ">{CourseText.Loream}</p>
                  <div className="d-flex flex-row mt-4">
                    {Array.from(Array(this.state.startCount)).map(
                      (item, index) => (
                        <i
                          className={
                            "fa-duotone fa-star-sharp " +
                            (this.state.updateStage <= index
                              ? "fa-duotone fa-star-sharp "
                              : "active-star")
                          }
                          onClick={() =>
                            this.setState({
                              updateStage: index + 1,
                            })
                          }
                        ></i>
                      )
                    )}
                  </div>
                  <Formik
                    initialValues={{ post: "" }}
                    onSubmit={(values) => {
                      let formlastData = new FormData();
                      formlastData.append("course", this.state.course_id);
                      formlastData.append("feedback", values.post);
                      formlastData.append("rating", this.state.updateStage);
                      this.courseAPI
                        .feedBack(formlastData)
                        .then((res) => {
                          if (res.status) {
                            this.hideRateusModal();
                            this.props.history.push("/home/community");
                          }
                        })
                        .catch((error) => {
                        });
                    }}
                    validationSchema={createpostSchema}
                  >
                    <Form className=" mt-5">
                      <div className="d-flex flex-row  ">
                        <Field
                          id="post"
                          name="post"
                          as="textarea"
                          className="rateus-textarea "
                          placeholder="Feed Back"
                        />
                      </div>
                      <ErrorMessage name="post">
                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                      </ErrorMessage>
                      <div className="d-flex flex-row mt-5 mb-4 w-100">
                        <button
                          type="submit"
                          className="btn-yellow mx-auto w-50"
                        >
                          {CourseText.Submit}
                        </button>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal fade"
          id="helpandsupport"
          data-keyboard="false"
          data-bs-backdrop="static"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content px-4">
              <div class="modal-body">
                <div className="congratulation">
                  <h1 className="mt-4">{CourseText.HelpAndSupport}</h1>
                  <img
                    src="image/helpandsupport.png"
                    alt=""
                    className="img-fluid mt-5"
                  />
                  <p className="mt-5 mb-3 w-100">{CourseText.Loream}</p>
                  <button
                    className="btn-yellow mt-5 mb-5 w-50"
                    data-bs-dismiss="modal"
                  >
                    {CourseText.LiveChat}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-none">
          <GoogleAPI
            clientId="120284660080-eb8a6nga53829ele6458g3vs3l7k6s4e.apps.googleusercontent.com"
          // onUpdateSigninStatus={this.update}
          // onInitFailure={this.failure}
          >
            <GoogleLogout
              buttonText="Logout"
              onLogoutSuccess={this.logout}
            >
            </GoogleLogout>
          </GoogleAPI>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    notify: state.notify,
    isLoggedIn: state.user.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleTheme: () => {
      dispatch({ type: "TOGGLE_THEME" });
    },
    logoutuser: () => {
      dispatch({ type: "LOGOUT" });
    },
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
    showNotification: () => {
      dispatch({ type: "ShowNotification" });
    },
  };
};
export default withCookies(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Stages))
);

import React, { Component } from "react";
import "../styles/Mentor_home.scss";
import "../../studenthome/styles/StudentHomePage.scss";
import Sidenavbar from "../../../../../navbar/sidenavbar/Sidenavbar";
import Feed from "../../../../../common_Components/feeds/Feed";
import { mentorhome } from "../api/Api";
import axios from "axios";
import Header from "../../../../../navbar/header/Header";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Carousel } from "react-bootstrap";
import * as Yup from "yup";
import FlatList from "flatlist-react";
import { feedAPI } from "../../studenthome/api/Api";
import "react-datepicker/dist/react-datepicker.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Modal } from "bootstrap";
import CreateWebinar from "./CreateWebinar";
import MentorFeed from "./Mentor_feed";
import { mentorText } from "../const/Const_mentor";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { feedsText } from "../../../../../common_Components/feeds/const/Const_Feeds";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TextField from "@mui/material/TextField";
import TimePicker from "@mui/lab/TimePicker";
import moment from "moment";
import DatePicker from 'react-date-picker';

const createpostSchema = Yup.object().shape({
  post: Yup.string(),
});
const deleteSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
});
const editwebinarSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});
let currentItemdate = "",
  currentItemtime = "",
  currentItemshowtime = "";
// let respagenumber;
class Mentor_home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mentorhomedataone: [],
      mentorhomedatatwo: "",
      webinardetailslist: [],
      appointmentlist: [],
      active: 1,
      showdropdown: false,
      communityfeeds: [],
      communityfeeds_res: [],
      publicandprivate: true,
      url_preview: false,
      Localfeeddata: [],
      Globalfeeddata: [],
      Globalfeeddata_res: [],
      postpic: "",
      collegeData: {},
      metavalues: "",
      showmetadata: false,
      getid: "",
      editpost: "",
      selecteddate: "",
      navigation: true,
      showCreatefeed: false,
      webinarEditData: "",
      webinardata: "",
      date: "",
      showError: false,
      errorMessage: "",
      hasMoreItems: true,
      communityhasMoreItems: true,
      globalFeedPage: 1,
      globalFeedPage_res: 1,
      communityFeedPage: 1,
      communityFeedPage_res: 1,
      showMentorfeed: false,
      descriptionTouch: false,
      descriptionValue: "",
      titleValue: "",
      titleTouch: false,
      descriptionError: false,
      titleError: false,
      showmodal: false,
      switchImageButton: true,
      time: "",
      showtime: "time",
      timeError: false,
      webinarDateValidate: false,
      page: 2,
      pagination: true,
      InnerWidth: 0,
      renderFeed: true,
      allowApi_res: false,
      allowApi: false,
      uiDate:"",
    };
    this.mentorhome = new mentorhome();
    this.feedAPI = new feedAPI();
    this.showpicture = React.createRef();
    this.datePicker = React.createRef();
    this.Openpicture = this.Openpicture.bind(this);
    this.onChange = this.onChange.bind(this);
    this.feedid = this.feedid.bind(this);
    this.modalRef = React.createRef();
    this.modalEditRef = React.createRef();
    this.webinarList = React.createRef();
    this.DeletemodalRef = React.createRef();
    this.webinarView = React.createRef();
    this.showLoading = this.showLoading.bind(this);
    this.editWebinarData = this.editWebinarData.bind(this);
    this.openInNewTab = this.openInNewTab.bind(this);
    this.getMeetLink = this.getMeetLink.bind(this);
    this.rootRef = React.createRef();
    this.showmentor = React.createRef();
    this.editFeed = React.createRef();
    this.showSuccess = this.showSuccess.bind(this);
    this.fetchfeedsdata = this.fetchfeedsdata.bind(this);
  }
  onChangedate = (value) => {
    // this.setState({ selecteddate: dateStr });
    if (value) {
      let converted = moment(value).format("YYYY-MM-DD");    
      this.setState({ date: value, selecteddate: converted,uiDate:value });
    } else {
      this.setState({       
        selecteddate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
      });
    }
  };
  responsive = () => {
    if (window.innerWidth > 767) {
      // 
      this.setState({ allowApi_res: false, allowApi: true });
    } else {
      // 
      this.setState({ allowApi: false, allowApi_res: true });
    }
  };
  componentDidMount() {
    if (typeof axios.defaults.headers.common["Authorization"] === "undefined") {
      axios.defaults.headers.common["Authorization"] =
        "Token " + localStorage.getItem("passion_token");
    }
    this.mentorappointment();
    if (window.innerWidth > 767) {
      this.setState({ allowApi_res: false, allowApi: true });
    } else {
      this.setState({ allowApi: false, allowApi_res: true });
    }
    window.addEventListener("resize", this.responsive);
    if (this.state.renderFeed) {
      this.fetchfeedsdata();
    }
    this.fetchwebinardata();
  }
  mentorappointment = () => {
    this.mentorhome.getmentorappointment().then((data) => {      // 
      if (data.status) {
        this.setState({ appointmentlist: data.data });
      } else {
        this.setState({ appointmentlist: [] });
      }
    });
  };
  showSuccess() {
    this.toast.show({
      severity: "success",
      summary: "College Created Successfully",
      detail: "Message Content",
      life: 5000,
    });
  }
  fetchwebinardata = () => {
    this.mentorhome.getmentorwebinar().then((data) => {
      if (data.status) {
        this.setState({ webinardetailslist: data.data });
      } else {
        this.setState({ webinardetailslist: [] });
      }
    });
  };
  updateLike = (value, id) => {
    if (this.state.active == 1) {
      let FeedList = this.state.Globalfeeddata;
      FeedList.forEach((item, index) => {
        if (item.id === id) {
          item.user_liked = value;
          if (value == true) {
            item.likescount = item.likescount + 1;
          } else {
            if (item.likescount == 0) {
              item.likescount = item.likescount;
            } else {
              item.likescount = item.likescount - 1;
            }
          }
        }
      });
      this.setState({ Globalfeeddata: FeedList });
    } else {
      let FeedList = this.state.communityfeeds;
      FeedList.forEach((item, index) => {
        if (item.id === id) {
          item.user_liked = value;
          if (value == true) {
            item.likescount = item.likescount + 1;
          } else {
            if (item.likescount == 0) {
              item.likescount = item.likescount;
            } else {
              item.likescount = item.likescount - 1;
            }
          }
        }
      });
      this.setState({ communityfeeds: FeedList });
    }
  };
  updateComment = (value, id) => {
    if (this.state.active == 1) {
      let FeedList = this.state.Globalfeeddata;
      FeedList.forEach((item, index) => {
        if (value == "add") {
          item.commentcount = item.commentcount + 1;
        } else {
          if (item.commentcount == 0) {
            item.commentcount = item.commentcount;
          } else {
            item.commentcount = item.commentcount - 1;
          }
        }
      });
      this.setState({ Globalfeeddata: FeedList });
    } else {
      let FeedList = this.state.communityfeeds;
      FeedList.forEach((item, index) => {
        if (value == "add") {
          item.commentcount = item.commentcount + 1;
        } else {
          if (item.commentcount == 0) {
            item.commentcount = item.commentcount;
          } else {
            item.commentcount = item.commentcount - 1;
          }
        }
      });
      this.setState({ communityfeeds: FeedList });
    }
  };
  deleteFeed = (id) => {
    let List;
    if (this.state.active == 1) {
      let FeedList = this.state.Globalfeeddata;
      FeedList.forEach((item, index) => {
        if (item.id === id) {
          List = FeedList.filter((element) => element !== item);
        }
      });
      this.setState({ Globalfeeddata: List });
    } else {
      let FeedList = this.state.communityfeeds;
      FeedList.forEach((item, index) => {
        if (item.id === id) {
          List = FeedList.filter((element) => element !== item);
        }
      });
      this.setState({ communityfeeds: List });
    }
  };
  refreshFeedList = () => {
    this.mentorhome.getGlobalFeed().then((data) => {
      if (data.status) {
        this.setState({ Globalfeeddata: data.data.results });
      } else {
        this.setState({ Globalfeeddata: [] });
      }
    });
    this.mentorhome.getcommunityFeed().then((data) => {
      if (data.status) {
        this.setState({ communityfeeds: data.data.results });
      } else {
        this.setState({ communityfeeds: [] });
      }
    });
  };
  fetchfeedsdata() {
    this.mentorhome
      .paginationGlobalFeed(this.state.globalFeedPage)
      .then((data) => {
        if (data.status) {
          if (data.hasOwnProperty("data")) {
            if (data.data.hasOwnProperty("next") && this.state.hasMoreItems) {
              let globalpagenumber;
              if (data.data.next != null) {
                globalpagenumber = data.data.next.split("=")[1];
              } else {
                globalpagenumber = this.state.globalFeedPage + 1;
              }
              if (this.state.globalFeedPage < globalpagenumber) {
                this.setState((prevState) => ({
                  Globalfeeddata: [
                    ...prevState.Globalfeeddata,
                    ...data.data.results,
                  ],
                }));
                if (data.data.next != null) {
                  this.setState({
                    globalFeedPage: this.state.globalFeedPage + 1,
                  });
                } else {
                  this.setState({ hasMoreItems: false });
                }
              }
            }
          }
        } else {
          this.setState({ Globalfeeddata: [] });
        }
      });
    this.mentorhome
      .paginationcommunityFeed(this.state.communityFeedPage)
      .then((data) => {
        if (data.status) {
          // 
          if (data.hasOwnProperty("data")) {
            if (
              data.data.hasOwnProperty("next") &&
              this.state.communityhasMoreItems
            ) {
              let communitypagenumber;
              if (data.data.next != null) {
                let pagenumber = data.data.next.split("=")[1];
                communitypagenumber = pagenumber.split("&")[0];
              } else {
                communitypagenumber = this.state.communityFeedPage + 1;
              }
              if (this.state.communityFeedPage < communitypagenumber) {
                this.setState((prevState) => ({
                  communityfeeds: [
                    ...prevState.communityfeeds,
                    ...data.data.results,
                  ],
                }));
                if (data.data.next != null) {
                  this.setState({
                    communityFeedPage: this.state.communityFeedPage + 1,
                  });
                } else {
                  this.setState({ communityhasMoreItems: false });
                }
              }
            }
          }
        } else {
          this.setState({ communityfeeds: [] });
        }
      });
    this.setState({ renderFeed: false });
  }
  fileChangedHandler = (event) => {
    const file = event.target.files[0];
    this.setState({ postpic: file });
    if (file) {
      if (file.size < 2097152) {
        let reader = new FileReader();
        reader.onload = function () {
          document.getElementById("preview").src = reader.result;
        };
        this.setState({ switchImageButton: false });
        reader.readAsDataURL(file);
      } else {
        this.setState({
          errorMessage:
            "Size Limit Exceed",
          showError: true,
        });
      }
    }
    event.target.value = "";
  };
  Openpicture() {
    this.showpicture.current.click();
  }
  onChange(e) {
    let collegeData = this.state.editpost;
    collegeData[e.target.name] = e.target.value;
    this.setState({ editedData: collegeData });
    let rgx = new RegExp(
      "([a-zA-Z]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
    );
    if (rgx.test(collegeData.description)) {
      this.mentorhome
        .getParser(this.state.collegeData.description)
        .then((res) => {
          this.setState({ metavalues: res.data.data });
          this.setState({ showmetadata: true, url_preview: true });
        })
    } else {
      this.setState({ showmetadata: false });
    }
  }
  feedid(id) {
    this.showEditModal();
    // 
    if (this.state.active === 1) {
      this.state.Globalfeeddata.forEach((item, index) => {
        if (item.id === id) {
          let currentItem = Object.assign({}, item);
          this.setState({ editpost: currentItem });
          if (currentItem.file) {
            this.setState({ switchImageButton: false });
          }
        }
      });
    } else {
      this.state.communityfeeds.forEach((item, index) => {
        if (item.id === id) {
          let currentItem = Object.assign({}, item);
          this.setState({ editpost: currentItem });
          if (currentItem.file) {
            this.setState({ switchImageButton: false });
          }
        }
      });
    }
  }
  alertToaste = () => {
    this.props.showtoast({
      text: "Feed Successfully Created",
      time: new Date().getTime(),
    });
  };
  deleteToaste = () => {
    this.props.showtoast({
      text: "Feed Successfully Deleted",
      time: new Date().getTime(),
    });
  };
  alertToasteupdate = () => {
    this.props.showtoast({
      text: "Successfully Updated",
      time: new Date().getTime(),
    });
  };
  alertToastewebinar = () => {
    this.props.showtoast({
      text: "Webinar Successfully Created",
      time: new Date().getTime(),
    });
  };
  alertToasteDeleted = () => {
    this.props.showtoast({
      text: "Webinar Successfully Deleted",
      time: new Date().getTime(),
    });
  };
  editWebinarData(id) {
    this.hideWebinarViewModal();
    this.state.webinardetailslist.forEach((item, index) => {
      if (item.id === id) {
        let currentItem = Object.assign({}, item);
        currentItemdate = Object.assign({}, { date: item.date });
        currentItemtime = item.time;
        currentItemshowtime = item.time;
        let converteddate = currentItemdate.date.split("-");
        let responseDate = new Date(converteddate[0], converteddate[1] - 1, converteddate[2])  
        this.setState({
          webinarEditData: currentItem,
          selecteddate:currentItemdate.date,
          uiDate:responseDate,
          time: currentItem.time,
          showtime: currentItem.time,
        });
      }
      this.setState({ dateError: false, timeError: false });
    });
    this.showModal();
  }
  showModal = () => {
    const modalEle = this.modalEditRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideModal = () => {
    const modalEle = this.modalEditRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
    this.setState({
      webinarEditData: "",
      selecteddate: "",
      time: "",
      showtime: "",
    });
  };
  showEditModal = () => {
    const modalEle = this.editFeed.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideEditModal = () => {
    const modalEle = this.editFeed.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
    this.setState({ switchImageButton: true })
  };
  showDeleteModal = () => {
    const modalEle = this.DeletemodalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideDeleteModal = () => {
    const modalEle = this.DeletemodalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  showWebinarModal = () => {
    const modalEle = this.webinarList.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideWebinarModal = () => {
    // 
    const modalEle = this.webinarList.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  showWebinarViewModal = () => {
    const modalEle = this.webinarView.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideWebinarViewModal = () => {
    const modalEle = this.webinarView.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  closeFeed = (value) => {
    this.setState({ showCreatefeed: value });
  };
  openFeed = () => {
    this.setState({ showCreatefeed: true }, () => {
      this.modalRef.current.openmodal();
    });
  };
  closeMentorFeed = (value) => {
    this.setState({ showMentorfeed: value });
  };
  openMentorFeed = () => {
    this.setState({ showMentorfeed: true }, () => {
      this.showmentor.current.openmodal();
    });
  };
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  viewWebinardata = (id, value) => {
    if (!value) {
      this.hideWebinarModal();
    }
    this.showWebinarViewModal();
    this.state.webinardetailslist.forEach((item, index) => {
      if (item.id === id) {
        let webinarDate = Date.parse(`${item.date}T${item.time}`);
        let towDays = new Date().setDate(new Date().getDate() + 2);
        item["joinDisable"] = webinarDate > Date.now();
        item["webinarDateValidate"] = towDays > new Date(item.date);
        this.setState({ webinardata: item });
      }
    });
  };
  getAppointmentMeetLink = (id) => {
    this.mentorhome.getAppointmentMeetLink(id).then((res) => {
      if (res.status) {
        this.openInNewTab(res.data);
      }
    });
  };
  getMeetLink(id) {
    this.mentorhome.getMeetLink(id).then((res) => {
      if (res.status) {
        this.openInNewTab(res.data);
      }
    });
  }
  openInNewTab(url) {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  }
  dateSelect = (date) => {
    if (!date) {
      this.setState({ timeError: false });
    }
    if (date) {
      let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
      let am_pm = date.getHours() >= 12 ? "PM" : "AM";
      hours = hours < 10 ? "0" + hours : hours;
      let minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let Time = hours + ":" + minutes + " " + am_pm;
      this.setState({ showtime: Time, time: Time });
    }
  };
  render() {
    return (
      <div>
        <div className="mentorhome">
          <Sidenavbar />
          <div className="studenthomepage-header d-flex flex-row">
            <Header />
          </div>
          <div className="feeds-responsive-navigation">
            <span className="navigation-name">
              <p onClick={() => this.setState({ navigation: true })}>
                {mentorText.Feeds}
              </p>
            </span>
            <span className="navigation-name">
              <p onClick={() => this.setState({ navigation: false })}>
                {mentorText.Activity}
              </p>
            </span>
          </div>
          <div className="mentorhome-layout d-sm-flex d-md-none flex-row ">
            <div
              className={
                "mentor-feed " + (this.state.navigation ? "d-block" : "d-none")
              }
            >
              <div className="d-flex flex-row justify-content-center">
                <div className="studenthomeFeed-name  d-flex flex-row ">
                  <div className="toggle-feed  d-flex flex-row">
                    <button
                      className={
                        " " + (this.state.active === 1 ? "btn-toggle" : "")
                      }
                      onClick={() => this.setState({ active: 1 })}
                    >
                      {mentorText.Feed}
                    </button>
                    <button
                      className={
                        " " + (this.state.active === 2 ? "btn-toggle" : "")
                      }
                      onClick={() => this.setState({ active: 2 })}
                    >
                      {mentorText.Community}
                    </button>
                  </div>
                  <div
                    className="add-icon  ms-3 mt-1 "
                    onClick={this.openMentorFeed}
                  >
                    <i className="fa-solid fa-plus "></i>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row justify-content-center">
                {this.state.active === 2 && this.state.allowApi_res && (
                  <>
                    {this.state.communityfeeds.length !== 0 ? (
                      <div className="area me-4">
                        <FlatList
                          list={this.state.communityfeeds}
                          renderItem={(data) => (
                            <Feed
                              Localfeeddata={data}
                              updateLike={this.updateLike}
                              DeleteFeed={this.deleteFeed}
                              refreshfeed={this.refreshFeedList}
                              comments={this.state.comments}
                              FeedId={this.feedid}
                              alertToaste={this.deleteToaste}
                              loading={this.showLoading}
                              updateComment={this.updateComment}
                            />
                          )}
                          hasMoreItems={this.state.communityhasMoreItems}
                          loadMoreItems={this.fetchfeedsdata}
                        />
                      </div>
                    ) : (
                      <center>
                        <img
                          src="/image/nofeeds.png"
                          alt=""
                          className="mt-5 nofeeds"
                        />
                      </center>
                    )}
                  </>
                )}
              </div>
              <div className="d-flex flex-row justify-content-center">
                {this.state.active === 1 && this.state.allowApi_res && (
                  <>
                    {this.state.Globalfeeddata.length !== 0 ? (
                      <div className="area me-4">
                        <FlatList
                          list={this.state.Globalfeeddata}
                          renderItem={(data) => (
                            <Feed
                              Localfeeddata={data}
                              updateLike={this.updateLike}
                              comments={this.state.comments}
                              refreshfeed={this.refreshFeedList}
                              DeleteFeed={this.deleteFeed}
                              FeedId={this.feedid}
                              alertToaste={this.deleteToaste}
                              loading={this.showLoading}
                              updateComment={this.updateComment}
                            />
                          )}
                          hasMoreItems={this.state.hasMoreItems}
                          loadMoreItems={this.fetchfeedsdata}
                        />
                      </div>
                    ) : (
                      <center>
                        <img
                          src="/image/nofeeds.png"
                          alt=""
                          className="mt-5 nofeeds"
                        />
                      </center>
                    )}
                  </>
                )}
              </div>
            </div>
            <div
              className={
                "mentorhome-right " +
                (this.state.navigation ? "d-none" : "d-block")
              }
            >
              <h1 className="me-auto ms-5 mt-1">{mentorText.Appointments} </h1>
              <div className="w-100 d-flex flex-row justify-content-center">
                <div className="mentorhome-appointment  mt-3">
                  {this.state.appointmentlist.length !== 0 ? (
                    <>
                      <Carousel controls={false}>
                        {this.state.appointmentlist.map((data, index) => {
                          let appoitnmentDate = Date.parse(
                            `${data.appointment_date}T${data.start_time}`
                          );
                          let timeOut = Date.parse(
                            `${data.appointment_date}T${data.end_time}`
                          );
                          return (
                            <Carousel.Item key={index}>
                              <div className=" d-flex flex-row mt-4 p-2">
                                <div className="ms-2 ">
                                  <div className="studenthomeFeed-appointment-card-img mx-auto">
                                    <img
                                      src={data.profile_image}
                                      alt=""
                                      className="img-fluid"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                          "image/errorprofileimg.webp";
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className=" my-auto ms-3">
                                  <div className="mentorhome-appointment-studentname">
                                    {data.username}
                                  </div>
                                  <div className="mentorhome-appointment-collegename">
                                    {data.college_name}
                                  </div>
                                  <div className="mentorhome-appointment-collegename">
                                    {data.batch}
                                  </div>
                                </div>
                                <div className="my-auto ms-auto me-2">
                                  {timeOut > Date.now() ? (
                                    <button
                                      className={
                                        appoitnmentDate > Date.now()
                                          ? "studenthomepage-cards-join-hover"
                                          : "studenthomepage-cards-join"
                                      }
                                      disabled={appoitnmentDate > Date.now()}
                                      onClick={() =>
                                        this.getAppointmentMeetLink(data.id)
                                      }
                                    >
                                      {mentorText.join}
                                    </button>
                                  ) : (
                                    <span>{mentorText.timeout}</span>
                                  )}
                                </div>
                              </div>
                              <div className=" d-flex flex-row w-100">
                                <div className=" col-8 ">
                                  <div className="appointment-title  ms-4 ms-1">
                                    {mentorText.Appointmentschedule}
                                  </div>
                                  <div className=" d-flex flex-row ms-2 ms-sm-4 ms-1 mt-3">
                                    <i class="fa-regular fa-clock icon-studenthomeFeed me-2 mt-1"></i>
                                    <div className="mt-1">
                                      {data.start_time} {mentorText.to}{" "}
                                      {data.end_time}
                                    </div>
                                  </div>
                                  <div className=" d-flex flex-row ms-2  ms-sm-4 ms-1 mt-3">
                                    <i class="fa-regular fa-calendar icon-studenthomeFeed me-2 mt-1"></i>
                                    <div className="mt-1">
                                      {data.appointment_date}
                                    </div>
                                  </div>
                                </div>
                                <div className=" col-4 mt-4">
                                  <div className="mentorstudent-stage ">
                                    <div className="mentorstudent-stagecircle mx-auto">
                                      <h5 className="mentorstudent-stagenumber ">
                                        {mentorText.Stage1}
                                      </h5>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Carousel.Item>
                          );
                        })}
                      </Carousel>
                    </>
                  ) : (
                    <div className="webinor-illustration">
                      <div className="webinor-illustration-img ">
                        <img src="image/Group276.svg" alt="" className="mt-5" />
                      </div>
                      <p className="mt-4">{mentorText.NoappointmentScheduled}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-100 d-flex flex-row justify-content-center ">
                <div className="webinar-card">
                  <div className="webinar-card-title d-flex flex-row">
                    <div className="d-flex flex-row ms-4 ">
                      <div className="webinar-card-title-name my-auto me-auto">
                        {mentorText.Webinar}
                      </div>
                      <div className="webinar-card-view my-auto ms-3">
                        <div
                          className="add-icon  ms-auto"
                          onClick={this.openFeed}
                        >
                          <i class="fa-solid fa-plus "></i>
                        </div>
                      </div>
                    </div>
                    <div
                      className="webinar-card-view my-auto ms-auto me-4 "
                      onClick={this.showWebinarModal}
                    >
                      <i class="fa-solid fa-chevron-right me-3"></i>
                    </div>
                  </div>
                  {this.state.webinardetailslist.length !== 0 ? (
                    <>
                      <Carousel controls={false}>
                        {this.state.webinardetailslist.slice(0, 5).map((data) => {
                          let webinarDate = Date.parse(
                            `${data.date}T${data.time}`
                          );
                          return (
                            <Carousel.Item>
                              <div className=" d-flex flex-row mt-2">
                                <div className="ms-3">
                                  <div className="studenthomeFeed-appointment-card-img mx-auto">
                                    <img
                                      src={data.profile_image}
                                      alt=""
                                      className="img-fluid"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                          "image/errorprofileimg.webp";
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="studenthomeFeed-appointment-card-content my-auto ms-3  pt-2">
                                  <div className="studenthomeFeed-appointment-card-username">
                                    {data.username}
                                  </div>
                                  <div className="studenthomeFeed-appointment-card-userdomain mt-2">
                                    {data.position}
                                  </div>
                                </div>
                                <div className="my-auto ms-auto mt-3 me-2">
                                  <button
                                    className={
                                      webinarDate > Date.now()
                                        ? "studenthomepage-cards-join-hover"
                                        : "studenthomepage-cards-join"
                                    }
                                    disabled={webinarDate > Date.now()}
                                    onClick={() => this.getMeetLink(data.id)}
                                  >
                                    {mentorText.join}
                                  </button>
                                </div>
                              </div>
                              <div className="webinar-title  ms-4">
                                {data.title}
                              </div>
                              <div className="webinar-description mt-3  mx-4">
                                {data.description}{" "}
                              </div>
                              <div className=" d-flex flex-row ms-4 mt-3">
                                <i className="fa-regular fa-clock icon-studenthomeFeed me-2 mt-1"></i>
                                <div className="mt-1">{data.time}</div>
                              </div>
                              <div className=" d-flex flex-row ms-4 mt-3">
                                <i className="fa-regular fa-calendar icon-studenthomeFeed me-2 mt-1"></i>
                                <div className="mt-1">{data.date}</div>
                                <span
                                  className="ms-auto me-3 mt-3"
                                  onClick={() =>
                                    this.viewWebinardata(data.id, "singlemodal")
                                  }
                                >
                                  {mentorText.Viewmore}
                                </span>
                              </div>
                            </Carousel.Item>
                          );
                        })}
                      </Carousel>
                    </>
                  ) : (
                    <div className="webinor-illustration">
                      <div className="webinor-illustration-img ">
                        <img src="image/Group276.svg" alt="" className="mt-5" />
                      </div>
                      <p className="">{mentorText.NoWebinorScheduled}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mentorhome-layout d-none d-sm-none d-md-flex flex-row  ">
            <div className="mentor-feed  ms-5 ">
              <div className="studenthomeFeed-name  d-flex flex-row ">
                <div className="toggle-feed   d-flex flex-row">
                  <button
                    className={
                      " " + (this.state.active === 1 ? "btn-toggle" : "")
                    }
                    onClick={() => this.setState({ active: 1 })}
                  >
                    {mentorText.Feeds}
                  </button>
                  <button
                    className={
                      " " + (this.state.active === 2 ? "btn-toggle" : "")
                    }
                    onClick={() => this.setState({ active: 2 })}
                  >
                    {mentorText.Community}
                  </button>
                </div>
                <div
                  className="add-icon  ms-auto mt-1 me-4"
                  onClick={this.openMentorFeed}
                >
                  <i className="fa-solid fa-plus "></i>
                </div>
              </div>
              {this.state.active === 2 && this.state.allowApi && (
                <>
                  {this.state.communityfeeds.length !== 0 ? (
                    <div className="area me-4">
                      <FlatList
                        list={this.state.communityfeeds}
                        renderItem={(data) => (
                          <Feed
                            Localfeeddata={data}
                            updateLike={this.updateLike}
                            DeleteFeed={this.deleteFeed}
                            refreshfeed={this.refreshFeedList}
                            comments={this.state.comments}
                            FeedId={this.feedid}
                            alertToaste={this.deleteToaste}
                            loading={this.showLoading}
                            updateComment={this.updateComment}
                          />
                        )}
                        hasMoreItems={this.state.communityhasMoreItems}
                        loadMoreItems={this.fetchfeedsdata}
                        scrollEnabled={true}
                      />
                    </div>
                  ) : (
                    <center>
                      <img
                        src="/image/nofeeds.png"
                        alt=""
                        className="mt-5 nofeeds"
                      />
                    </center>
                  )}
                </>
              )}
              {this.state.active === 1 && this.state.allowApi && (
                <>
                  {this.state.Globalfeeddata.length !== 0 ? (
                    <div className="area me-4">
                      <FlatList
                        list={this.state.Globalfeeddata}
                        renderItem={(data) => (
                          <Feed
                            Localfeeddata={data}
                            updateLike={this.updateLike}
                            comments={this.state.comments}
                            refreshfeed={this.refreshFeedList}
                            DeleteFeed={this.deleteFeed}
                            FeedId={this.feedid}
                            alertToaste={this.deleteToaste}
                            loading={this.showLoading}
                            updateComment={this.updateComment}
                          />
                        )}
                        hasMoreItems={this.state.hasMoreItems}
                        loadMoreItems={this.fetchfeedsdata}
                        scrollEnabled={true}
                      // loadMoreItems={this.refreshFeedList}
                      // scrollEnabled={true}
                      />
                    </div>
                  ) : (
                    <center>
                      <img
                        src="/image/nofeeds.png"
                        alt=""
                        className="mt-5 nofeeds"
                      />
                    </center>
                  )}
                </>
              )}
            </div>
            <div className="mentorhome-right ">
              <h1 className="me-auto ms-1 mt-1">{mentorText.Appointments} </h1>
              <div className="mentorhome-appointment  mt-3">
                {this.state.appointmentlist.length !== 0 ? (
                  <>
                    <Carousel controls={false}>
                      {this.state.appointmentlist.map((data, index) => {
                        let appoitnmentDate = Date.parse(
                          `${data.appointment_date}T${data.start_time}`
                        );
                        let timeOut = Date.parse(
                          `${data.appointment_date}T${data.end_time}`
                        );
                        return (
                          <Carousel.Item key={index}>
                            <div className=" d-flex flex-row mt-4 p-2">
                              <div className=" ms-2 ">
                                <div className="studenthomeFeed-appointment-card-img mx-auto">
                                  <img
                                    src={data.profile_image}
                                    alt=""
                                    className="img-fluid"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "image/errorprofileimg.webp";
                                    }}
                                  />
                                </div>
                              </div>
                              <div className=" my-auto  ms-3">
                                <div className="mentorhome-appointment-studentname">
                                  {data.username}
                                </div>
                                <div className="mentorhome-appointment-collegename">
                                  {data.college_name}
                                </div>
                                <div className="mentorhome-appointment-collegename">
                                  {data.batch}
                                </div>
                              </div>
                              <div className="my-auto ms-auto me-3">
                                {timeOut > Date.now() ? (
                                  <button
                                    className={
                                      appoitnmentDate > Date.now()
                                        ? "studenthomepage-cards-join-hover"
                                        : "studenthomepage-cards-join"
                                    }
                                    disabled={appoitnmentDate > Date.now()}
                                    onClick={() =>
                                      this.getAppointmentMeetLink(data.id)
                                    }
                                  >
                                    {mentorText.join}
                                  </button>
                                ) : (
                                  <span>{mentorText.timeout}</span>
                                )}
                              </div>
                            </div>
                            <div className=" d-flex flex-row w-100">
                              <div className=" col-8 ">
                                <div className="appointment-title  ms-sm-4 ms-1">
                                  {mentorText.Appointmentschedule}
                                </div>
                                <div className=" d-flex flex-row ms-sm-4 ms-1 mt-3">
                                  <i class="fa-regular fa-clock icon-studenthomeFeed me-2 mt-1"></i>
                                  <div className="mt-1">
                                    {data.start_time} {mentorText.to}{" "}
                                    {data.end_time}
                                  </div>
                                </div>
                                <div className=" d-flex flex-row ms-sm-4 ms-1 mt-3">
                                  <i class="fa-regular fa-calendar icon-studenthomeFeed me-2 mt-1"></i>
                                  <div className="mt-1">
                                    {data.appointment_date}
                                  </div>
                                </div>
                              </div>
                              <div className=" col-4 mt-4">
                                <div className="mentorstudent-stage ">
                                  <div className="mentorstudent-stagecircle mx-auto">
                                    <h5 className="mentorstudent-stagenumber ">
                                      {mentorText.Stage1}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Carousel.Item>
                        );
                      })}
                    </Carousel>
                  </>
                ) : (
                  <div className="webinor-illustration">
                    <div className="webinor-illustration-img ">
                      <img src="image/Group276.svg" alt="" className="mt-5" />
                    </div>
                    <p className="mt-4">{mentorText.NoappointmentScheduled}</p>
                  </div>
                )}
              </div>
              <div className="webinar-card mb-2 ">
                <div className="webinar-card-title d-flex flex-row">
                  <div className="d-flex flex-row ms-4 ">
                    <div className="webinar-card-title-name my-auto me-auto">
                      {mentorText.Webinar}
                    </div>
                    <div className="webinar-card-view my-auto ms-3">
                      <div className="add-icon  ms-auto" onClick={this.openFeed}>
                        <i class="fa-solid fa-plus "></i>
                      </div>
                    </div>
                  </div>
                  <div
                    className="webinar-card-view my-auto ms-auto me-4 "
                    onClick={this.showWebinarModal}
                  >
                    <i class="fa-solid fa-chevron-right me-3"></i>
                  </div>
                </div>
                {this.state.webinardetailslist.length !== 0 ? (
                  <>
                    <Carousel controls={false}>
                      {this.state.webinardetailslist.slice(0, 5).map((data) => {
                        let webinarDate = Date.parse(`${data.date}T${data.time}`);
                        return (
                          <Carousel.Item>
                            <div className=" d-flex flex-row mt-2 px-3">
                              <div className="">
                                <div className="studenthomeFeed-appointment-card-img mx-auto">
                                  <img
                                    src={data.profile_image}
                                    alt=""
                                    className="img-fluid"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "image/errorprofileimg.webp";
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="studenthomeFeed-appointment-card-content my-auto  ps-4 pt-2">
                                <div className="studenthomeFeed-appointment-card-username">
                                  {data.username}
                                </div>
                                <div className="studenthomeFeed-appointment-card-userdomain mt-2">
                                  {data.position}
                                </div>
                              </div>
                              <div className="my-auto ms-auto  mt-4 center">
                                <button
                                  className={
                                    webinarDate > Date.now()
                                      ? "studenthomepage-cards-join-hover"
                                      : "studenthomepage-cards-join"
                                  }
                                  disabled={webinarDate > Date.now()}
                                  onClick={() => this.getMeetLink(data.id)}
                                >
                                  {mentorText.join}
                                </button>
                              </div>
                            </div>
                            <div className="webinar-title  ms-4">
                              {data.title}
                            </div>
                            <div className="webinar-description mt-3 mx-4">
                              {data.description}{" "}
                            </div>
                            <div className=" d-flex flex-row ms-4 mt-3">
                              <i className="fa-regular fa-clock icon-studenthomeFeed me-2 mt-1"></i>
                              <div className="mt-1">{data.time}</div>
                            </div>
                            <div className=" d-flex flex-row ms-4 mt-3">
                              <i className="fa-regular fa-calendar icon-studenthomeFeed me-2 mt-1"></i>
                              <div className="mt-1">{data.date}</div>
                              <span
                                className="ms-auto me-3 mt-3 mb-5"
                                onClick={() =>
                                  this.viewWebinardata(data.id, "singlemodal")
                                }
                              >
                                {mentorText.Viewmore}
                              </span>
                            </div>
                          </Carousel.Item>
                        );
                      })}
                    </Carousel>
                  </>
                ) : (
                  <div className="webinor-illustration">
                    <div className="webinor-illustration-img ">
                      <img src="image/Group276.svg" alt="" className="mt-5" />
                    </div>
                    <p className="">{mentorText.NoWebinorScheduled}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {this.state.showCreatefeed ? (
            <CreateWebinar
              closefeed={this.closeFeed}
              loading={this.showLoading}
              user={this.props.user}
              refreshWebinarData={this.fetchwebinardata}
              alertToaste={this.alertToastewebinar}
              ref={this.modalRef}
            />
          ) : null}
          {this.state.showMentorfeed ? (
            <MentorFeed
              closefeed={this.closeMentorFeed}
              loading={this.showLoading}
              user={this.props.user}
              refreshFeedData={this.refreshFeedList}
              alertToaste={this.alertToaste}
              ref={this.showmentor}
            />
          ) : null}
          <div class="modal fade" ref={this.modalEditRef} tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg">
              <div class="modal-content px-4">
                <div className="modal-header">
                  <div className="d-flex flex-row  w-100">
                    <h3 className="ms-auto ps-3">{mentorText.editModal}</h3>
                    <i
                      class="fa-regular fa-circle-xmark  ms-auto"
                      onClick={this.hideModal}
                    ></i>
                  </div>
                </div>
                <div class="modal-body">
                  <Formik
                    initialValues={{
                      description: this.state.webinarEditData.description,
                      title: this.state.webinarEditData.title,
                    }}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                      if (
                        (this.state.selecteddate.length === 0 &&
                          this.state.time.length === 0) ||
                        (this.state.selecteddate.length === 0 &&
                          this.state.time.length !== 0) ||
                        (this.state.selecteddate.length !== 0 &&
                          this.state.time.length === 0)
                      ) {
                        this.setState({ dateError: true, timeError: true });
                        //   "cooldateError",
                        //   this.state.selecteddate.length,
                        //   this.state.time.length
                        // );
                      } else {
                        this.showLoading();
                        let formData = new FormData();
                        formData.append("description", values["description"]);
                        formData.append("title", values["title"]);
                        if (this.state.selecteddate !== "") {
                          formData.append("date", this.state.selecteddate);
                        } else {
                          formData.append("date", this.state.date);
                        }
                        if (this.state.time !== "") {
                          formData.append("time", this.state.time);
                        } else {
                          formData.append("time", this.state.showtime);
                        }
                        this.feedAPI
                          .updateWebinar(this.state.webinarEditData.id, formData)
                          .then((res) => {
                            this.showLoading();
                            this.hideModal();
                            if (res.status) {
                              this.fetchwebinardata();
                              this.alertToasteupdate();
                              this.setState({
                                selecteddate: "",
                              });
                            } else {
                              if (res.message) {
                                if (typeof res.message === "object") {
                                  let value = Object.values(res.message);
                                  this.setState({
                                    errorMessage: value[0],
                                    showError: true,
                                  });
                                } else {
                                  this.setState({
                                    errorMessage: res.message,
                                    showError: true,
                                  });
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
                    }}
                    validationSchema={editwebinarSchema}
                  >
                    <Form className=" mt-3">
                      <label className="webinarlabel " htmlFor="number">
                        {mentorText.title}
                      </label>
                      <Field
                        name="title"
                        type="text"
                        className="input-createwebinar"
                        maxlength="35"
                      />{" "}
                      <ErrorMessage name="title">
                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                      </ErrorMessage>
                      <label className="webinarlabel mt-3 mb-3" htmlFor="number">
                        {mentorText.description}
                      </label>
                      <Field
                        name="description"
                        as="textarea"
                        className="textarea-createwebinar"
                        maxlength="150"
                      />
                      <ErrorMessage name="description">
                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                      </ErrorMessage>
                      <div className="d-flex flex-row  ">
                        <div>
                          <div className="webinarlabel mt-3 mb-3">
                            {mentorText.date}
                          </div>
                          {/* <div className="cusDatepicker d-flex flex-row ">
                            <Flatpickr
                            value={this.state.selecteddate}
                            options={{
                              minDate: new Date(
                                new Date().getTime() + 3 * 24 * 60 * 60 * 1000
                              ),
                            }}
                            onChange={this.onChangedate}
                          />                            
                            <i className="fa-light fa-calendar  "></i>
                          </div> */}
                          <div className="cusDatepicker  ">
                              <DatePicker onChange={this.onChangedate} value={this.state.uiDate} minDate={new Date(
                                new Date().getTime() + 3 * 24 * 60 * 60 * 1000)} />
                            </div>
                          {this.state.dateError ? (
                            <>
                              {this.state.selecteddate.length === 0 ? (
                                <div
                                  style={{
                                    color: "red",
                                  }}
                                >
                                  {mentorText.required}
                                </div>
                              ) : null}
                            </>
                          ) : null}
                        </div>
                        <div className="ms-3 ">
                          <div className="webinarlabel mt-3 mb-3 ">
                            {mentorText.time}
                          </div>
                          <div className="d-flex flex-row cusTime-picker">
                            <div className="span">{this.state.showtime}</div>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <TimePicker
                                value={this.state.time}
                                onChange={(time) => this.dateSelect(time)}
                                renderInput={(params) => (
                                  <TextField
                                    disableEnforceFocus
                                    {...params}
                                    ref={this.rootRef}
                                  />
                                )}
                                onBlur={() =>
                                  this.setState({
                                    timeError: true,
                                  })
                                }
                              />
                            </LocalizationProvider>
                          </div>
                          {this.state.timeError ? (
                            <>
                              {this.state.time === "" ? (
                                <div
                                  style={{
                                    color: "red",
                                  }}
                                >
                                  {mentorText.required}
                                </div>
                              ) : null}
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div className=" update-post d-flex flex-row mt-5 mb-4 w-100">
                        <button type="submit" className="btn-submit w-50 ">
                          {mentorText.update}
                        </button>{" "}
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
          <div
            class="modal fade"
            id="createwebinar"
            ref={this.DeletemodalRef}
            tabindex="-1"
          >
            <div class="modal-dialog modal-dialog-centered modal-md">
              <div class="modal-content px-4">
                <div className="modal-header">
                  <div className="d-flex flex-row  w-100">
                    <i
                      class="fa-regular fa-circle-xmark  ms-auto"
                      onClick={this.hideDeleteModal}
                    ></i>
                  </div>
                </div>
                <div class="modal-body">
                  <Formik
                    initialValues={{ title: "" }}
                    onSubmit={(values, onSubmitProps) => {
                      this.showLoading();
                      let formData = new FormData();
                      formData.append("reason", values.title);
                      this.feedAPI
                        .deleteWebinar(this.state.webinardata.id, formData)
                        .then((res) => {
                          onSubmitProps.resetForm();
                          this.showLoading();
                          if (res.status) {
                            this.hideDeleteModal();
                            this.fetchwebinardata();
                            this.alertToasteDeleted();
                          } else {
                            if (res.message) {
                              if (typeof res.message === "object") {
                                let value = Object.values(res.message);
                                this.setState({
                                  errorMessage: value[0],
                                  showError: true,
                                });
                              } else {
                                this.setState({
                                  errorMessage: res.message,
                                  showError: true,
                                });
                              }
                            } else {
                              this.setState({
                                errorMessage: "Something Went Wrong",
                                showError: true,
                              });
                            }
                          }
                        });
                    }}
                    validationSchema={deleteSchema}
                  >
                    <Form className="appointment-cancel">
                      <h5 className=" center" htmlFor="title">
                        {mentorText.WhydoyouwanttoDeletetheWebinar}{" "}
                      </h5>
                      <Field
                        name="title"
                        as="textarea"
                        className="cancel-response mt-3"
                      />
                      <ErrorMessage name="title">
                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                      </ErrorMessage>
                      <div className=" update-post d-flex flex-row mt-4">
                        <button type="submit" className="btn-blue">
                          {mentorText.Confirm}
                        </button>{" "}
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-post">
            <div
              className="modal fade"
              id="editpost"
              ref={this.editFeed}
              tabindex="-1"
            >
              <div className=" modal-dialog modal-dialog-centered	">
                <div className="modal-content">
                  <div className="modal-header">
                    <div className="d-flex flex-row justify-content-end w-100">
                      <i
                        class="fa-regular fa-circle-xmark  ms-auto"
                        onClick={this.hideEditModal}
                      ></i>
                    </div>
                  </div>
                  <div className="modal-body">
                    <div className="d-flex flex-row ms-1">
                      <div className=" profile-img-header d-flex ">
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
                      <h5 className="my-auto ms-3">{this.props.user.username}</h5>
                    </div>
                    <Formik
                      initialValues={{
                        description: "",
                        title: "",
                      }}
                      onSubmit={(values, onSubmitProps) => {
                        if (
                          this.state.editpost.title === "" &&
                          this.state.editpost.description === ""
                        ) {
                          this.setState({
                            titleError: true,
                            descriptionError: true,
                          });
                        } else if (this.state.editpost.description === "") {
                          this.setState({
                            descriptionError: true,
                          });
                        } else if (this.state.editpost.title === "") {
                          this.setState({
                            titleError: true,
                          });
                        }
                        if (
                          this.state.editpost.description !== "" &&
                          this.state.editpost.title !== ""
                        ) {
                          this.showLoading();
                          let formData = new FormData();
                          if (this.state.switchImageButton) {
                            formData.append("file", "");
                          } else {
                            formData.append("file", this.state.postpic);
                          }
                          formData.append("file_type", "image");
                          formData.append(
                            "description",
                            this.state.editpost.description
                          );
                          formData.append("title", this.state.editpost.title);
                          formData.append("url_preview", this.state.url_preview);
                          if (this.state.switchImageButton) {
                            formData.append("delete_image", "True");
                          }
                          this.mentorhome
                            .editMentorFeed(this.state.editpost.id, formData)
                            .then((res) => {
                              this.showLoading();
                              if (res.status) {
                                this.hideEditModal();
                                this.refreshFeedList();
                                this.alertToasteupdate();
                                this.setState({
                                  editsShow: false,
                                  descriptionError: false,
                                  titleError: false,
                                  switchImageButton: true
                                });
                                onSubmitProps.resetForm();
                              } else {
                                if (res.message) {
                                  if (typeof res.message === "object") {
                                    let value = Object.values(res.message);
                                    this.setState({
                                      errorMessage: value[0],
                                      showError: true,
                                    });
                                  } else {
                                    this.setState({
                                      errorMessage: res.message,
                                      showError: true,
                                    });
                                  }
                                } else {
                                  this.setState({
                                    showError: true,
                                    errorMessage: "Feeds Not Update",
                                  });
                                }
                              }
                            });
                        }
                      }}
                      validationSchema={createpostSchema}
                    >
                      <Form className=" mt-3">
                        <div className="d-flex flex-row mt-3 px-2">
                          <div
                            className="label-modal col-3 my-auto"
                            htmlFor="number"
                          >
                            {mentorText.Title}
                          </div>
                          <div className="col-9 col-sm-9">
                            <Field
                              name="title"
                              type="text"
                              className="comment-title col-12 "
                              maxlength="35"
                              value={this.state.editpost.title}
                              onChange={(e) => this.onChange(e)}
                              onBlur={() =>
                                this.setState({
                                  titleError: true,
                                })
                              }
                            />
                            {this.state.titleError ? (
                              <>
                                {this.state.editpost.title.length === 0 ? (
                                  <div
                                    style={{
                                      color: "red",
                                    }}
                                  >
                                    {feedsText.required}
                                  </div>
                                ) : null}
                              </>
                            ) : null}
                          </div>
                        </div>
                        <div className="d-flex flex-row mt-3 px-2">
                          <div
                            className="label-modal col-3 my-auto"
                            htmlFor="number"
                          >
                            {mentorText.Descritption}
                          </div>
                          <div className="col-9 col-sm-9">
                            <Field
                              name="description"
                              as="textarea"
                              className="comment-description col-12"
                              maxlength="150"
                              value={this.state.editpost.description}
                              onChange={(e) => this.onChange(e)}
                              onBlur={() =>
                                this.setState({
                                  descriptionError: true,
                                })
                              }
                            />
                            {this.state.descriptionError ? (
                              <>
                                {this.state.editpost.description.length === 0 ? (
                                  <div
                                    style={{
                                      color: "red",
                                    }}
                                  >
                                    {feedsText.required}
                                  </div>
                                ) : null}
                              </>
                            ) : null}
                          </div>
                        </div>
                        {this.state.showmetadata ? (
                          <div className="metadata d-flex flex-row mx-auto mb-3 mt-4">
                            <img
                              className="metadata-img"
                              src={this.state.metavalues.image}
                            />
                            <div className="metadata-description">
                              <h7 className="ms-2 mt-3">
                                {this.state.metavalues.title}
                              </h7>
                              <p className="ms-2 mt-1">
                                {this.state.metavalues.description}
                              </p>
                            </div>
                          </div>
                        ) : null}
                        <input
                          type="file"
                          className=" hide-inputfile mt-2"
                          onChange={this.fileChangedHandler}
                          ref={this.showpicture}
                          accept=".png, .jpg, .jpeg"
                          style={{ display: "none" }}
                        ></input>
                        <div className="addimage col-12 d-flex flex-row justify-content-end">
                          <div className="d-flex flex-row me-3 mt-2">
                            {this.state.switchImageButton ? null : (
                              <i
                                class="fa-regular fa-trash-can  my-auto ms-auto me-3"
                                onClick={() =>
                                  this.setState({
                                    switchImageButton: true,
                                  })
                                }
                              ></i>
                            )}
                            {this.state.switchImageButton ? (
                              <div className="upload-post-active ">
                                <img
                                  className=""
                                  src="/image/addgallery.png"
                                  onClick={this.Openpicture}
                                  alt=""
                                />
                              </div>
                            ) : (
                              <div className="upload-post ">
                                <img
                                  className=""
                                  id="preview"
                                  alt=""
                                  src={
                                    this.state.editpost.file
                                      ? this.state.editpost.file
                                      : "/image/gallery.png"
                                  }
                                  onClick={this.Openpicture}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className=" update-post d-flex flex-row ">
                          <button type="submit" className="btn-submit  ">
                            {feedsText.update}
                          </button>{" "}
                        </div>
                      </Form>
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade " id="webinarslist" ref={this.webinarList}>
            <div class="modal-dialog modal-dialog-centered 	modal-xl webinar-list modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 className="ms-auto ps-3">{mentorText.Webinar}</h4>
                  <i
                    class="fa-regular fa-circle-xmark  ms-auto"
                    onClick={this.hideWebinarModal}
                  ></i>
                </div>
                <div class="modal-body">
                  <div className="row mx-auto ">
                    {this.state.webinardetailslist.length !== 0 ? (
                      <>
                        {this.state.webinardetailslist.map((data, index) => {
                          let webinarDate = Date.parse(
                            `${data.date}T${data.time}`
                          );
                          let appointmentdate = data.date.split("-");
                          return (
                            <div
                              className="mx-auto col-lg-4 col-md-6 col-sm-12 mt-3"
                              key={index}
                            >
                              <div
                                className="studenthomepage-fotter-cards pt-2 mx-auto"
                                onClick={() => this.viewWebinardata(data.id)}
                              >
                                <div className="studenthomepage-card-Title  mx-2">
                                  {data.title}
                                </div>
                                <div className="studenthomepage-card-description mx-2">
                                  {data.description}
                                </div>
                                <div className="studenthomepage-card-date mt-1">
                                  <img
                                    src="image/appointmentdate.png"
                                    alt=""
                                    className=" img-fluid webinardate me-1  mb-1"
                                  />
                                  {`${appointmentdate[2]} -${appointmentdate[1]}-${appointmentdate[0]}`}
                                  <span className="studenthomepage-card-date ms-2">
                                    <img
                                      src="image/appointmenttime.png"
                                      alt=""
                                      className=" img-fluid webinardate  mb-1"
                                    />{" "}
                                    {data.time}
                                  </span>
                                </div>
                                <div className=" d-flex flex-row justify-content-center mt-2">
                                  <div className="studenthomepage-cards-img">
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
                                </div>
                                <div className="studenthomepage-card-name mt-2">
                                  {data.username}
                                </div>
                                <div className="studenthomepage-card-domain mt-1">
                                  {data.position_mentor === null
                                    ? data.position_expert
                                    : data.position_mentor}
                                </div>
                                <button
                                  className={
                                    webinarDate > Date.now()
                                      ? "studenthomepage-cards-join-hover mt-1"
                                      : "studenthomepage-cards-join mt-1"
                                  }
                                  disabled={webinarDate > Date.now()}
                                  onClick={() => this.getMeetLink(data.id)}
                                >
                                  {mentorText.join}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="webinor-illustration">
                        <div className="webinor-illustration-img ">
                          <img
                            src="/image/Group276.svg"
                            alt=""
                            className="mt-5"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/image/errorprofileimg.webp";
                            }}
                          />
                        </div>
                        <p className="">{mentorText.NoWebinorScheduled}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade webinarview"
            id="webinarview"
            ref={this.webinarView}
          >
            <div class="modal-dialog modal-dialog-centered 	webinarview">
              <div class="modal-content px-3">
                <div class="modal-header">
                  <h4 className=" ms-auto pt-2 ">{mentorText.WebinarDetails}</h4>
                  {this.state.webinardata.webinarDateValidate ? null : (
                    <div className="edit-small">
                      <i
                        className="fa-solid fa-pen-to-square ms-3 cursor-pointer mt-1"
                        onClick={() =>
                          this.editWebinarData(this.state.webinardata.id)
                        }
                      ></i>
                    </div>
                  )}
                  <i
                    class="fa-regular fa-circle-xmark  ms-auto"
                    onClick={this.hideWebinarViewModal}
                  ></i>
                </div>
                <div class="modal-body">
                  <div className="webinarview-title mt-2">
                    <span>{this.state.webinardata.title}</span>
                  </div>
                  <div className="webinarview-description mt-2">
                    <span>{this.state.webinardata.description}</span>
                  </div>
                  <div className="webinarview-dateandtime mt-3 ">
                    <h4>{mentorText.DateandTime}</h4>
                    <div className="d-flex flex-row">
                      <div className=" d-flex flex-row  mt-3">
                        <i class="fa-regular fa-calendar icon-studenthomeFeed me-3 mt-1"></i>
                        <p>{this.state.webinardata.date}</p>
                      </div>
                      <div className=" d-flex flex-row ms-3 mt-3">
                        <i class="fa-regular fa-clock icon-studenthomeFeed me-3 mt-1"></i>
                        <p>{this.state.webinardata.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="webinarview-presenter  mt-2">
                    <h4>{mentorText.Presenter}</h4>
                    <div className="d-flex flex-row  mt-4">
                      <div className=" profile-img-header d-flex ">
                        <img
                          src={this.state.webinardata.profile_image}
                          alt=""
                          className="profile-imgin"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/image/errorprofileimg.webp";
                          }}
                        />
                      </div>
                      <h5 className="my-auto ms-4">
                        {this.state.webinardata.username}
                      </h5>
                    </div>
                  </div>
                  <div className="d-flex flex-row justify-content-center">
                    <button
                      className={
                        this.state.webinardata.joinDisable
                          ? "studenthomepage-cards-join-hover "
                          : "studenthomepage-cards-join "
                      }
                      disabled={this.state.webinardata.joinDisable}
                      onClick={() => this.getMeetLink(this.state.webinardata.id)}
                    >
                      {mentorText.join}
                    </button>
                    {this.state.webinardata.webinarDateValidate ? null : (
                      <i
                        class="fa-regular fa-trash-can  ms-4 cursor-pointer yellow  pt-2"
                        data-bs-dismiss="modal"
                        onClick={this.showDeleteModal}
                      ></i>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ErrorModal
            message={this.state.errorMessage}
            value={this.state.showError}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
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
)(withRouter(Mentor_home));

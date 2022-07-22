import React, { Component } from "react";
import Sidenavbar from "../../../../../navbar/sidenavbar/Sidenavbar";
import Feed from "../../../../../common_Components/feeds/Feed";
import "../../studenthome/styles/StudentHomePage.scss";
import "../../mentor_home/styles/Mentor_home.scss";
import axios from "axios";
import { feedAPI } from "../api/Api";
import { appointmentAPI } from "../../../appointment/api/Get";
import Header from "../../../../../navbar/header/Header";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NavLink, withRouter } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Carousel } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import CreateModal from "./Create_Feed";
import { feedsText } from "components/admin/components/feeds/Const_feedsadmin";
import { homeText } from "../Const_studenthome";
import FlatList from "flatlist-react";
const createpostSchema = Yup.object().shape({
    reason: Yup.string().required("Required"),
});
const appointmentDeleteSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
});
let ID;
class StudentHomFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 3,
            Localfeeddata: [],
            Globalfeeddata: [],
            navigation: true,
            completedpercentage: "",
            postpic: "",
            collegeData: {},
            metavalues: "",
            showmetadata: false,
            getid: "",
            editpost: "",
            comments: "",
            Iswebinar: false,
            mentordetails: "",
            expertdetails: "",
            webinardetailslist: [],
            communityfeeds: [],
            publicandprivate: true,
            url_preview: false,
            showdropdown: false,
            studentAnalysis: {},
            blockedPanel: true,
            webinardata: {},
            appointment_id: "",
            createMentor_btn: false,
            joinMentor_btn: false,
            mentorre_schedule: false,
            joindisableMentor: true,
            createExpert_btn: false,
            joinExpert_btn: false,
            expertre_schedule: false,
            joindisableExpert: true,
            show: false,
            showReschedule: false,
            ownername: "",
            showCreatefeed: false,
            message: "",
            feedsName: "Global",
            editsShow: false,
            descriptionError: false,
            titleError: false,
            editedData: "",
            switchImageButton: true,
            showWebinarList: false,
            showWebinarView: false,
            showDeleteAppointment: false,
            globalFeedPage: 1,
            hasMoreItems: true,
            LocalhasMoreItems: true,
            LocalFeedPage: 1,
            communityFeedPage: 1,
            communityhasMoreItems: true,
            allowApi_res: false,
            allowApi: false,
            renderFeed: true,
        };
        this.feedAPI = new feedAPI();
        this.appointmentAPI = new appointmentAPI();
        this.showpicture = React.createRef();
        this.Openpicture = this.Openpicture.bind(this);
        this.feedid = this.feedid.bind(this);
        this.buttonUpdate = this.buttonUpdate.bind(this);
        this.showLoading = this.showLoading.bind(this);
        this.modalRef = React.createRef();
        this.openInNewTab = this.openInNewTab.bind(this);
        this.getMeetLink = this.getMeetLink.bind(this);
        ID = this.props.match.params.id;
    }
    responsive = () => {
        if (window.innerWidth > 767) {
            this.setState({ allowApi_res: false, allowApi: true });
        } else {
            this.setState({ allowApi: false, allowApi_res: true });
        }
    };
    componentDidMount() {
        if (ID && ID == "community") {
            this.setState({ active: 1 });
        }
        if (typeof axios.defaults.headers.common["Authorization"] === "undefined") {
            axios.defaults.headers.common["Authorization"] =
                "Token " + localStorage.getItem("passion_token");
        }
        window.addEventListener("resize", this.responsive);
        if (window.innerWidth > 767) {
            this.setState({ allowApi_res: false, allowApi: true });
        } else {
            this.setState({ allowApi: false, allowApi_res: true });
        }
        if (this.state.renderFeed) {
            this.fetchfeedsdata();
        }
        this.getAppointment();
        this.getWebinar();
        this.getAnalysis();
    }
    getWebinar = () => {
        this.feedAPI.getWebinar().then((data) => {
            if (data.status) {
                this.setState({ webinardetailslist: data.data });
            } else {
                this.setState({ webinardetailslist: [] });
            }
        });
    };
    getAnalysis = () => {
        this.feedAPI.getAnalysis().then((data) => {
            if (data.status) {
                this.setState({ studentAnalysis: data.data[0] });
            } else {
                this.setState({ studentAnalysis: {} });
            }
        });
    };
    // fileChangedHandler = (event) => {
    //     const file = event.target.files[0];
    //     this.setState({ postpic: file });
    //     if (file) {
    //         let reader = new FileReader();
    //         reader.onload = function () {
    //             document.getElementById("preview").src = reader.result;
    //         };
    //         this.setState({ switchImageButton: false });
    //         reader.readAsDataURL(file);
    //     }
    //     event.target.value = "";
    // };
    getAppointment = () => {
        this.appointmentAPI.getAppointment().then((data) => {
            if (data.status) {
                this.setState(
                    {
                        mentordetails: data.data.mentor_appointment[0],
                        expertdetails: data.data.expert_appointment[0],
                    },
                    () => {
                        this.buttonUpdate(
                            data.data.mentor_appointment[0].start_time,
                            data.data.expert_appointment[0].start_time,
                            data.data.mentor_appointment[0].appointment_date,
                            data.data.expert_appointment[0].appointment_date,
                            data.data.mentor_appointment[0].end_time,
                            data.data.expert_appointment[0].end_time
                        );
                    }
                );
            }
        });
    };
    refreshFeedList = () => {
        this.feedAPI.getGlobalFeed(1).then((data) => {
            if (data.status) {
                this.setState({ Globalfeeddata: data.data.results });
            } else {
                this.setState({ Globalfeeddata: [] });
            }
        });
        this.feedAPI
            .getLocalFeed(1)
            .then((data) => {
                if (data.status) {
                    this.setState({ Localfeeddata: data.data.results });
                } else {
                    this.setState({ Localfeeddata: [] });
                }
            })
        this.feedAPI.getcommunityFeed(1).then((data) => {
            if (data.status) {
                this.setState({ communityfeeds: data.data.results });
            } else {
                this.setState({ communityfeeds: [] });
            }
        });
    };
    deleteFeed = (id) => {
        let List;
        if (this.state.active == 3) {
            let FeedList = this.state.Globalfeeddata;
            FeedList.forEach((item, index) => {
                if (item.id === id) {
                    List = FeedList.filter((element) => element !== item);
                }
            });
            this.setState({ Globalfeeddata: List });
        } else if (this.state.active == 1) {
            let FeedList = this.state.communityfeeds;
            FeedList.forEach((item, index) => {
                if (item.id === id) {
                    List = FeedList.filter((element) => element !== item);
                }
            });
            this.setState({ communityfeeds: List });
        } else {
            let FeedList = this.state.Localfeeddata;
            FeedList.forEach((item, index) => {
                if (item.id === id) {
                    List = FeedList.filter((element) => element !== item);
                }
            });
            this.setState({ Localfeeddata: List });
        }
    };
    fetchfeedsdata = () => {
        this.feedAPI.getGlobalFeed(this.state.globalFeedPage).then((data) => {
            if (data.status) {
                if (data.hasOwnProperty("data")) {
                    if (data.data.hasOwnProperty("next") && this.state.hasMoreItems) {
                        // 
                        let globalpagenumber;
                        if (data.data.next != null) {
                            let pagenumber = data.data.next.split("=")[1];
                            globalpagenumber = pagenumber.split("&")[0];
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
        this.feedAPI.getLocalFeed(this.state.LocalFeedPage).then((data) => {
            // 
            if (data.status) {
                if (data.hasOwnProperty("data")) {
                    if (
                        data.data.hasOwnProperty("next") &&
                        this.state.LocalhasMoreItems
                    ) {
                        let localpagenumber;
                        if (data.data.next != null) {
                            let pagenumber = data.data.next.split("=")[1];
                            localpagenumber = pagenumber.split("&")[0];
                        } else {
                            localpagenumber = this.state.LocalFeedPage + 1;
                        }
                        if (this.state.LocalFeedPage < localpagenumber) {
                            this.setState((prevState) => ({
                                Localfeeddata: [
                                    ...prevState.Localfeeddata,
                                    ...data.data.results,
                                ],
                            }));
                            if (data.data.next != null) {
                                this.setState({ LocalFeedPage: this.state.LocalFeedPage + 1 });
                            } else {
                                this.setState({ LocalhasMoreItems: false });
                            }
                        }
                    }
                }
            } else {
                this.setState({ Localfeeddata: [] });
            }
        });
        this.feedAPI.getcommunityFeed(this.state.communityFeedPage).then((data) => {
            if (data.status) {
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
                        // 
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
    };
    Openpicture() {
        this.showpicture.current.click();
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
    updateLike = (value, id) => {
        if (this.state.active == 1) {
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
        } else if (this.state.active === 2) {
            let FeedList = this.state.Localfeeddata;
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
            this.setState({ Localfeeddata: FeedList });
        } else {
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
        }
    };
    updateComment = (value, id) => {
        if (this.state.active == 1) {
            let FeedList = this.state.communityfeeds;
            FeedList.forEach((item, index) => {
                if (item.id === id) {     
                    if(value == "add"){
                      item.commentcount = item.commentcount + 1;
                    }else{
                      if (item.commentcount == 0) {
                        item.commentcount = item.commentcount ;
                      } else {             
                        item.commentcount = item.commentcount - 1;             
                      }            
                    }                  
                  }
            });
            this.setState({ communityfeeds: FeedList });
        } else if (this.state.active === 2) {
            let FeedList = this.state.Localfeeddata;
            FeedList.forEach((item, index) => {
                if (item.id === id) {     
                    if(value == "add"){
                      item.commentcount = item.commentcount + 1;
                    }else{
                      if (item.commentcount == 0) {
                        item.commentcount = item.commentcount ;
                      } else {             
                        item.commentcount = item.commentcount - 1;             
                      }            
                    }                  
                  }
            });
            this.setState({ Localfeeddata: FeedList });
        } else {
            let FeedList = this.state.Globalfeeddata;
            FeedList.forEach((item, index) => {
                if (item.id === id) {     
                    if(value == "add"){
                      item.commentcount = item.commentcount + 1;
                    }else{
                      if (item.commentcount == 0) {
                        item.commentcount = item.commentcount ;
                      } else {             
                        item.commentcount = item.commentcount - 1;             
                      }            
                    }                  
                  }
            });
            this.setState({ Globalfeeddata: FeedList });
        }
    };
    onChange(e) {
        let collegeData = this.state.editpost;
        collegeData[e.target.name] = e.target.value;
        this.setState({ editedData: collegeData });
        let rgx = new RegExp(
            "([a-zA-Z]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
        );
        if (rgx.test(collegeData.description)) {
            this.feedAPI
                .getParser(this.state.collegeData.description)
                .then((res) => {
                    if (res.status) {
                        this.setState({ metavalues: res.data });
                        this.setState({
                            showmetadata: true,
                            url_preview: true,
                        });
                    }
                })
        } else {
            this.setState({ showmetadata: false });
        }
    }
    feedid(id) {
        this.setState({ publicandprivate: true });
        if (this.state.active === 2) {
            this.state.Localfeeddata.forEach((item, index) => {
                if (item.id === id) {
                    let currentItem = Object.assign({}, item);
                    this.setState({ editpost: currentItem });
                    if (item.visibility === "SGF") {
                        this.setState({ publicandprivate: false });
                    }
                    console.log("file",currentItem.file)
                    if (currentItem.file) {
                        this.setState({ switchImageButton: false });
                        console.log("file",currentItem.file)
                    }
                }
            });
        } else {
            // this.state.Globalfeeddata.forEach((item, index) => {
            //     if (item.id === id) {
            //         let currentItem = Object.assign({}, item);
            //         this.setState({ editpost: currentItem });
            //         if (currentItem.file) {
            //             this.setState({ switchImageButton: false });
            //         }
            //     }
            // });
        }
        this.setState({ editsShow: true });
    }
    feedsscroll = (value) => {
    };
    viewWebinardata = (id) => {
        this.setState({ showWebinarList: false, showWebinarView: true });
        this.state.webinardetailslist.forEach((item, index) => {
            if (item.id === id) {
                let webinarDate = Date.parse(`${item.date}T${item.time}`);
                item["joinDisable"] = webinarDate > Date.now();
                this.setState({ webinardata: item });
            }
        });
    };
    appointmentReschedule = (id, owner) => {
        this.setState({
            appointment_id: id,
            showReschedule: true,
            ownername: owner,
        });
    };
    buttonUpdate(
        mentor,
        expert,
        mentorappointmentdate,
        expertappointmentdate,
        mentorappointmentend_Time,
        expertappointmentend_Time
    ) {
        let date = new Date();
        let dt = new Date();
        // let currentdate = dt.getDate().toString().padStart(2, "0");
        // let currentmonth = (dt.getMonth() + 1).toString().padStart(2, "0");
        // let currentYear = dt.getFullYear();
        // let currentdata = `${currentYear}-${currentmonth}-${currentdate}`;
        let currentTime = new Date().toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        let splitcurrenttime = currentTime.split(":");    //mentor    
        if (mentor === null) {
            this.setState({ createMentor_btn: true }); //
        } else {
            let mentor_appointmentdate = mentorappointmentdate.split("-");
            let mentortime = mentor;
            let mentorsplit = mentortime.split(":");
            let time = Date.parse(
                `${mentorappointmentdate}T${mentorappointmentend_Time}`
            );
            const menotConvertedtime = new Date(
                mentor_appointmentdate[0],
                mentor_appointmentdate[1] - 1,
                mentor_appointmentdate[2],
                mentorsplit[0],
                mentorsplit[1],
                mentorsplit[2],
                0
            );
            let signmentorTest = menotConvertedtime.getTime() - date.getTime();
            let mentorReShedule = Math.sign(signmentorTest);
            if (time < Date.now()) {
                this.setState({ mentorre_schedule: true }); //mentorsplit[0] === splitcurrenttime[0]
            } else if (
                mentorsplit[0] === splitcurrenttime[0] &&
                menotConvertedtime == new Date()
            ) {
                this.setState({ joindisableMentor: false }); //
                this.setState({ joinMentor_btn: true });
            } else {
                this.setState({ joinMentor_btn: true }); //
            }
        }
        //expert
        if (expert === null) {
            this.setState({ createExpert_btn: true }); //
        } else {
            let expert_appointmentdate = expertappointmentdate.split("-");
            let experttime = expert;
            let Appointmenttime = Date.parse(
                `${expertappointmentdate}T${expertappointmentend_Time}`
            );
            let expertsplit = experttime.split(":");
            const expertConvertedtime = new Date(
                expert_appointmentdate[0],
                expert_appointmentdate[1] - 1,
                expert_appointmentdate[2],
                expertsplit[0],
                expertsplit[1],
                expertsplit[2],
                0
            );
            let signexpertTest = expertConvertedtime.getTime() - date.getTime();
            // let expertReShedule = Math.sign(signexpertTest);
            if (Appointmenttime < Date.now()) {
                this.setState({ expertre_schedule: true }); //
            } else if (
                expertsplit[0] === splitcurrenttime[0] &&
                expertConvertedtime == new Date()
            ) {
                this.setState({ joindisableExpert: false }); //
                this.setState({ joinExpert_btn: true }); //
            } else {
                this.setState({ joinExpert_btn: true }); //
            }
        }
    }
    changeTheme = () => {
        if (this.state.active === 2) {
            this.setState({ active: 3, feedsName: "Global" });
        } else {
            this.setState({ active: 2, feedsName: "Local" });
        }
    };
    closeFeed = (value) => {
        this.setState({ showCreatefeed: value });
    };
    openFeed = () => {
        this.setState({ showCreatefeed: true }, () => {
            this.modalRef.current.openmodal();
        });
    };
    showLoading() {
        this.props.loading({ loadingState: new Date().getTime() });
    }
    getMeetLink(id) {
        this.feedAPI.getMeetLink(id).then((res) => {
            if (res.status) {
                this.openInNewTab(res.data);
            }
        });
    }
    openInNewTab(url) {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    }
    getAppointmentMeetLink = (id) => {
        this.feedAPI.getAppointmentMeetLink(id).then((res) => {
            // 
            if (res.status) {
                this.openInNewTab(res.data);
            }
        });
    };
    MyAwesomeScrollToTopButton = () => {
    };
    render() {
        return (
            <div >
                <div className="studenthomepage">
                    <Sidenavbar />
                    <div className="studenthomepage-header d-flex flex-row">
                        <Header />
                    </div>
                    <div className="feeds-responsive-navigation ">
                        <span className="navigation-name">
                            <p onClick={() => this.setState({ navigation: true })}>
                                {homeText.Feeds}
                            </p>
                        </span>
                        <span className="navigation-name">
                            <p onClick={() => this.setState({ navigation: false })}>
                                {homeText.Activity}
                            </p>
                        </span>
                    </div>
                    <div className="studenthomeFeed-middle d-sm-flex d-md-none flex-row">
                        <div
                            className={
                                "studenthomeFeed-left " +
                                (this.state.navigation ? "d-block" : "d-none")
                            }
                        >
                            <div className="studenthomeFeed-name d-flex flex-row">
                                <div className="toggle-feed d-flex flex-row  me-3">
                                    <button
                                        className={
                                            " " +
                                            (this.state.active === 3 || this.state.active === 2
                                                ? "btn-toggle"
                                                : "")
                                        }
                                        onClick={() =>
                                            this.state.feedsName === "Local"
                                                ? this.setState({ active: 2 })
                                                : this.setState({ active: 3 })
                                        }
                                    >
                                        {this.state.feedsName}
                                    </button>
                                    <button
                                        className={
                                            " " + (this.state.active === 1 ? "btn-toggle" : "")
                                        }
                                        onClick={() =>
                                            this.setState({
                                                active: 1,
                                                showdropdown: false,
                                            })
                                        }
                                    >
                                        {homeText.communtiy}
                                    </button>
                                </div>
                                {this.state.active === 3 || this.state.active === 2 ? (
                                    <>
                                        {
                                            // <i class="fa-solid fa-ellipsis-vertical mx-auto flag-icon"
                                            //   onClick={() => this.setState({ showdropdown: !this.state.showdropdown })}></i>
                                            <label class="customised-switch  my-auto mx-auto">
                                                <input
                                                    type="checkbox"
                                                    onChange={() => this.changeTheme()}
                                                />
                                                <span class="customised-slider customised-round"></span>
                                            </label>
                                        }
                                    </>
                                ) : null}
                                <div
                                    className="add-icon  ms-auto  me-4"
                                    onClick={() => this.openFeed()}
                                >
                                    <i className="fa-solid fa-plus "></i>
                                </div>
                            </div>
                            {this.state.showdropdown ? (
                                <div className="filterfeed-res">
                                    <div
                                        className="w-100 h-50 mt-2"
                                        onClick={() =>
                                            this.setState({
                                                active: 2,
                                                showdropdown: false,
                                            })
                                        }
                                    >
                                        {homeText.Local}
                                    </div>
                                    <div
                                        className="w-100 h-50 "
                                        onClick={() =>
                                            this.setState({
                                                active: 3,
                                                showdropdown: false,
                                            })
                                        }
                                    >
                                        {homeText.Global}
                                    </div>
                                </div>
                            ) : null}
                            {this.state.active === 1 &&
                                this.state.allowApi_res &&
                                (this.state.active === 1 &&
                                    this.state.studentAnalysis.stage_no === 3 ? (
                                    <>
                                        {this.state.communityfeeds.length !== 0 ? (
                                            <div className="area mt-3 ">
                                                <FlatList
                                                    list={this.state.communityfeeds}
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
                                ) : (
                                    <img
                                        src="/image/feedslock.png"
                                        alt=""
                                        className="mt-5 nofeeds"
                                    />
                                ))}
                            {this.state.active === 2 && this.state.allowApi_res && (
                                <>
                                    {this.state.Localfeeddata.length !== 0 ? (
                                        <div className="area  mt-3">
                                            <FlatList
                                                list={this.state.Localfeeddata}
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
                                                hasMoreItems={this.state.LocalhasMoreItems}
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
                            {this.state.active === 3 && this.state.allowApi_res && (
                                <>
                                    {this.state.Globalfeeddata.length !== 0 ? (
                                        <div className="area  mt-3">
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
                        <div
                            className={
                                "studenthomeFeed-left " +
                                (this.state.navigation ? "d-none" : "d-block")
                            }
                        >
                            <div className="studenthomeFeed-right-webinar ">
                                <p className="ps-1 ps-md-1 ps-lg-5 pb-2 appoinment">
                                    {homeText.Appointment}
                                </p>
                                <div className="studenthomeFeed-appointment-card-mobile d-flex flex-row  ms-xs-3 p-2">
                                    <div className="d-flex flex-row w-100 my-auto">
                                        <div className="my-auto col-2">
                                            <div className="studenthomeFeed-appointment-card-img ms-auto">
                                                <img
                                                    src={this.state.mentordetails.profile_image}
                                                    alt=""
                                                    className="img-fluid"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/image/errorprofileimg.webp";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="studenthomeFeed-appointment-card-content my-auto col-6 ps-3 ">
                                            <div className="studenthomeFeed-appointment-card-username mt-1">
                                                {!this.state.mentordetails.username ? (
                                                    <Skeleton
                                                        width="5rem"
                                                        className="mt-1 ms-1"
                                                        style={{
                                                            backgroundcolor: "black",
                                                        }}
                                                    ></Skeleton>
                                                ) : (
                                                    this.state.mentordetails.username
                                                )}
                                            </div>
                                            <div className="studenthomeFeed-appointment-card-userdomain mt-1">
                                                {!this.state.mentordetails.position ? (
                                                    <Skeleton
                                                        width="5rem"
                                                        className="mt-1 ms-1"
                                                        style={{
                                                            backgroundcolor: "black",
                                                        }}
                                                    ></Skeleton>
                                                ) : (
                                                    this.state.mentordetails.position
                                                )}
                                            </div>
                                            <div className=" d-lg-flex flex-row ">
                                                <div className="appointment-font d-flex flex-row mt-2 mb-1">
                                                    <i className="fa-regular fa-clock icon-appoitnment me-1 mt-1"></i>
                                                    {!this.state.mentordetails.start_time ? (
                                                        <Skeleton
                                                            width="5rem"
                                                            className="mt-1 ms-1"
                                                            style={{
                                                                backgroundcolor: "black",
                                                            }}
                                                        ></Skeleton>
                                                    ) : (
                                                        this.state.mentordetails.start_time
                                                    )}
                                                    {/* <div className="me-2 pt-1">{this.state.mentordetails.start_time}</div> */}
                                                </div>
                                                <div className="appointment-font ">
                                                    <i class="fa-regular fa-calendar icon-appoitnment me-1 mt-1"></i>
                                                    {!this.state.mentordetails === "" ? (
                                                        <Skeleton
                                                            width="5rem"
                                                            className="mt-1 ms-1"
                                                            style={{
                                                                backgroundcolor: "black",
                                                            }}
                                                        ></Skeleton>
                                                    ) : (
                                                        this.state.mentordetails.appointment_date
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-4">
                                            <div className="card-domain d-flex flex-row justify-content-end me-3 mt-3">
                                                <div className="domain-circle mt-1 me-2"></div>
                                                <span>{homeText.Mentor}</span>
                                            </div>
                                            {/* <div className="my-auto mt-3"> */}
                                            <div className="d-flex flex-row justify-content-center  mt-3">
                                                {this.state.createMentor_btn && (
                                                    <NavLink to={"/appointment/mentor"}>
                                                        <button className="studenthomepage-cards-join ">
                                                            {homeText.Create}
                                                        </button>
                                                    </NavLink>
                                                )}
                                            </div>
                                            {this.state.joinMentor_btn && (
                                                <div className="d-flex flex-row w-100 mt-3">
                                                    <button
                                                        className={
                                                            this.state.joindisableMentor
                                                                ? "studenthomepage-cards-join-hover w-75"
                                                                : "studenthomepage-cards-join w-75"
                                                        }
                                                        disabled={this.state.joindisableMentor}
                                                        onClick={() =>
                                                            this.getAppointmentMeetLink(
                                                                this.state.mentordetails.id
                                                            )
                                                        }
                                                    >
                                                        {homeText.join}
                                                    </button>
                                                    <i
                                                        class="fa-regular fa-trash delete-icon mt-1 ms-2"
                                                        onClick={() =>
                                                            this.setState({
                                                                appointment_id: this.state.mentordetails.id,
                                                                showDeleteAppointment: true,
                                                            })
                                                        }
                                                    ></i>
                                                </div>
                                            )}
                                            {this.state.mentorre_schedule && (
                                                <div className=" d-flex flex-row justify-content-center w-100 mt-3">
                                                    <button
                                                        className="studenthomepage-cards-join w-100"
                                                        onClick={() =>
                                                            this.appointmentReschedule(
                                                                this.state.mentordetails.id
                                                            )
                                                        }
                                                    >
                                                        {homeText.Reschedule}
                                                    </button>
                                                </div>
                                            )}
                                            {/* </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="studenthomeFeed-appointment-card-mobile mt-4 d-flex flex-row p-2">
                                    <div className="d-flex flex-row w-100 my-auto">
                                        <div className="my-auto col-2">
                                            <div className="studenthomeFeed-appointment-card-img ms-auto ">
                                                <img
                                                    src={this.state.expertdetails.profile_image}
                                                    alt=""
                                                    className="img-fluid"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/image/errorprofileimg.webp";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="studenthomeFeed-appointment-card-content my-auto col-6 ps-3 ">
                                            <div className="studenthomeFeed-appointment-card-username mt-1">
                                                {" "}
                                                {!this.state.expertdetails.username ? (
                                                    <Skeleton
                                                        width="10rem"
                                                        className="mt-1 ms-1"
                                                        style={{
                                                            backgroundcolor: "black",
                                                        }}
                                                    ></Skeleton>
                                                ) : (
                                                    this.state.expertdetails.username
                                                )}
                                            </div>
                                            <div className="studenthomeFeed-appointment-card-userdomain mt-1">
                                                {" "}
                                                {!this.state.expertdetails.position ? (
                                                    <Skeleton
                                                        width="10rem"
                                                        className="mt-1 ms-1"
                                                        style={{
                                                            backgroundcolor: "black",
                                                        }}
                                                    ></Skeleton>
                                                ) : (
                                                    this.state.expertdetails.position
                                                )}
                                            </div>
                                            <div className=" d-lg-flex flex-row ">
                                                <div className="appointment-font d-flex flex-row mt-2">
                                                    <i className="fa-regular fa-clock icon-appoitnment me-1 mt-1"></i>
                                                    {!this.state.expertdetails.start_time ? (
                                                        <Skeleton
                                                            width="5rem"
                                                            className=" mt-1 ms-1"
                                                            style={{
                                                                backgroundcolor: "black",
                                                            }}
                                                        ></Skeleton>
                                                    ) : (
                                                        this.state.expertdetails.start_time
                                                    )}
                                                </div>
                                                <div className="appointment-font d-flex flex-row mt-1">
                                                    <i class="fa-regular fa-calendar icon-appoitnment me-1 mt-1"></i>
                                                    {!this.state.expertdetails.appointment_date ? (
                                                        <Skeleton
                                                            width="5rem"
                                                            className="mt-1 ms-1"
                                                            style={{
                                                                backgroundcolor: "black",
                                                            }}
                                                        ></Skeleton>
                                                    ) : (
                                                        this.state.expertdetails.appointment_date
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-4">
                                            <div className="card-domain d-flex flex-row justify-content-end me-3 mt-3">
                                                <div className="domain-circle mt-1 me-2"></div>
                                                <span>{homeText.IndustryExpert}</span>
                                            </div>
                                            <div className="d-flex flex-row justify-content-center  mt-3">
                                                {this.state.createExpert_btn && (
                                                    <NavLink to={"/appointment/expert"}>
                                                        <button className="studenthomepage-cards-join">
                                                            {homeText.Create}
                                                        </button>
                                                    </NavLink>
                                                )}
                                            </div>
                                            {this.state.joinExpert_btn && (
                                                <div className="d-flex flex-row w-100 mt-3">
                                                    <button
                                                        className={
                                                            this.state.joindisableExpert
                                                                ? "studenthomepage-cards-join-hover "
                                                                : "studenthomepage-cards-join "
                                                        }
                                                        disabled={this.state.joindisableExpert}
                                                        onClick={() =>
                                                            this.getAppointmentMeetLink(
                                                                this.state.mentordetails.id
                                                            )
                                                        }
                                                    >
                                                        {homeText.join}
                                                    </button>
                                                    <i
                                                        class="fa-regular fa-trash delete-icon mt-1 ms-2"
                                                        onClick={() =>
                                                            this.setState({
                                                                appointment_id: this.state.expertdetails.id,
                                                                showDeleteAppointment: true,
                                                            })
                                                        }
                                                    ></i>
                                                </div>
                                            )}
                                            {this.state.expertre_schedule && (
                                                <div className=" d-flex flex-row justify-content-center w-100 mt-3">
                                                    <button
                                                        className="studenthomepage-cards-join  w-100"
                                                        onClick={() =>
                                                            this.appointmentReschedule(
                                                                this.state.expertdetails.id
                                                            )
                                                        }
                                                    >
                                                        {homeText.Reschedule}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="webinar-card mt-5 mx-auto">
                                <div className="webinar-card-title d-flex flex-row">
                                    <div className="webinar-card-title-name my-auto me-auto ms-4">
                                        {homeText.Webinar}
                                    </div>
                                    <div
                                        className="webinar-card-view my-auto ms-auto me-4"
                                        onClick={() => this.setState({ showWebinarList: true })}
                                    >
                                        <i class="fa-solid fa-chevron-right me-4"></i>
                                    </div>
                                </div>
                                {this.state.webinardetailslist.length !== 0 ? (
                                    <>
                                        <Carousel controls={false}>
                                            {this.state.webinardetailslist
                                                .slice(0, 5)
                                                .map((data, index) => {
                                                    let webinarDate = Date.parse(
                                                        `${data.date}T${data.time}`
                                                    );
                                                    return (
                                                        <Carousel.Item>
                                                            <div key={index}>
                                                                <div className=" d-flex flex-row mt-4">
                                                                    <div className="col-2 my-auto">
                                                                        <div className="studenthomeFeed-appointment-card-img ms-auto my-auto">
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
                                                                    <div className="studenthomeFeed-appointment-card-content my-auto  col-7 ps-3 pt-2">
                                                                        <p className="studenthomeFeed-appointment-card-username">
                                                                            {data.username}
                                                                        </p>
                                                                        <p className="studenthomeFeed-appointment-card-userdomain">
                                                                            {data.position_mentor === null
                                                                                ? data.position_expert
                                                                                : data.position_mentor}
                                                                        </p>
                                                                    </div>
                                                                    <div className="my-auto col-3">
                                                                        <div className=" mt-4">
                                                                            <button
                                                                                className={
                                                                                    webinarDate > Date.now()
                                                                                        ? "studenthomepage-cards-join-hover"
                                                                                        : "studenthomepage-cards-join"
                                                                                }
                                                                                disabled={webinarDate > Date.now()}
                                                                                onClick={() => this.getMeetLink(data.id)}
                                                                            >
                                                                                {homeText.join}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="webinar-title mt-4 ms-4">
                                                                    {data.title}
                                                                </div>
                                                                <p className="webinar-description mt-3  mx-4">
                                                                    {data.description}{" "}
                                                                </p>
                                                                <div className=" d-flex flex-row ms-4 mt-3">
                                                                    <i className="fa-regular fa-clock icon-studenthomeFeed me-3 mt-1"></i>
                                                                    <p>{data.time}</p>
                                                                </div>
                                                                <div className=" d-flex flex-row ms-4 mt-1">
                                                                    <i className="fa-regular fa-calendar icon-studenthomeFeed me-3 mt-1"></i>
                                                                    <p>{data.date}</p>
                                                                    <span
                                                                        className="ms-auto me-3 mt-2"
                                                                        onClick={() => this.viewWebinardata(data.id)}
                                                                    >
                                                                        {homeText.Viewmore}
                                                                    </span>
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
                                            <img src="/image/Group276.svg" alt="" className="mt-5" />
                                        </div>
                                        <p className="">{homeText.NoWebinorScheduled}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="studenthomeFeed-middle d-none d-sm-none d-md-flex flex-row">
                        <div className="studenthomeFeed-left ms-md-2 ms-lg-4">
                            <div className="studenthomeFeed-name  d-flex flex-row">
                                <div className="toggle-feed   d-flex flex-row">
                                    <button
                                        className={
                                            " " +
                                            (this.state.active === 3 || this.state.active === 2
                                                ? "btn-toggle"
                                                : "")
                                        }
                                        onClick={() =>
                                            this.state.feedsName === "Local"
                                                ? this.setState({ active: 2 })
                                                : this.setState({ active: 3 })
                                        }
                                    >
                                        {this.state.feedsName}
                                    </button>
                                    <button
                                        className={
                                            " " + (this.state.active === 1 ? "btn-toggle" : "")
                                        }
                                        onClick={() =>
                                            this.setState({
                                                active: 1,
                                                showdropdown: false,
                                            })
                                        }
                                    >
                                        {homeText.communtiy}
                                    </button>
                                </div>
                                {this.state.active === 3 || this.state.active === 2 ? (
                                    <>
                                        {
                                            <label className="customised-switch mx-auto mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={this.state.active == 2 ? true : false}
                                                    onChange={() => this.changeTheme()}
                                                />
                                                <span class="customised-slider customised-round"></span>
                                            </label>
                                        }
                                    </>
                                ) : null}
                                <div
                                    className="add-icon  ms-auto  me-4"
                                    onClick={() => this.openFeed()}
                                >
                                    <i className="fa-solid fa-plus "></i>
                                </div>
                            </div>
                            {this.state.showdropdown ? (
                                <div className="filterfeed">
                                    <div
                                        className="w-100 h-50 mt-2"
                                        onClick={() =>
                                            this.setState({
                                                active: 2,
                                                showdropdown: false,
                                            })
                                        }
                                    >
                                        {this.state.feedsName}
                                    </div>
                                    <div
                                        className="w-100 h-50 "
                                        onClick={() =>
                                            this.setState({
                                                active: 3,
                                                showdropdown: false,
                                            })
                                        }
                                    >
                                        {this.state.feedsName}
                                    </div>
                                </div>
                            ) : null}
                            {this.state.active === 1 &&
                                this.state.allowApi &&
                                (this.state.active === 1 &&
                                    this.state.studentAnalysis.stage_no === 3 ? (
                                    <>
                                        {this.state.communityfeeds.length !== 0 ? (
                                            <div className="area mt-3 ">
                                                <FlatList
                                                    list={this.state.communityfeeds}
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
                                ) : (
                                    <img
                                        src="/image/feedslock.png"
                                        alt=""
                                        className="mt-5 nofeeds"
                                    />
                                ))}
                            {this.state.active === 2 && this.state.allowApi && (
                                <>
                                    {this.state.Localfeeddata.length !== 0 ? (
                                        <div className="area  mt-3">
                                            <FlatList
                                                list={this.state.Localfeeddata}
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
                                                hasMoreItems={this.state.LocalhasMoreItems}
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
                            {this.state.active === 3 && this.state.allowApi && (
                                <>
                                    {this.state.Globalfeeddata.length !== 0 ? (
                                        <div className="area  mt-2">
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
                                                        // srollToTop
                                                        // srollToTopButton={this.MyAwesomeScrollToTopButton}
                                                    />
                                                )}
                                                hasMoreItems={this.state.hasMoreItems}
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
                        </div>
                        <div className="studenthomeFeed-right ps-3 ">
                            <div className="studenthomeFeed-right-webinar ms-1">
                                <h5 className="ps-1 ps-md-1 ps-lg-3 pb-2 mt-2">
                                    {homeText.Appointment}
                                </h5>
                                <div className="studenthomeFeed-appointment-card d-flex flex-row  ms-xs-3 p-2">
                                    <div className="d-flex flex-row w-100 my-auto">
                                        <div className="my-auto col-2">
                                            <div className="studenthomeFeed-appointment-card-img ms-auto">
                                                <img
                                                    src={this.state.mentordetails.profile_image}
                                                    alt=""
                                                    className="img-fluid"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/image/errorprofileimg.webp";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="studenthomeFeed-appointment-card-content my-auto col-6 ps-3 ">
                                            <div className="studenthomeFeed-appointment-card-username ">
                                                {!this.state.mentordetails.username ? (
                                                    <Skeleton
                                                        width="5rem"
                                                        className="mt-1 ms-1"
                                                        style={{
                                                            backgroundcolor: "black",
                                                        }}
                                                    ></Skeleton>
                                                ) : (
                                                    this.state.mentordetails.username
                                                )}
                                            </div>
                                            <div className="studenthomeFeed-appointment-card-userdomain mt-2">
                                                {!this.state.mentordetails.position ? (
                                                    <Skeleton
                                                        width="5rem"
                                                        className="mt-1 ms-1"
                                                        style={{
                                                            backgroundcolor: "black",
                                                        }}
                                                    ></Skeleton>
                                                ) : (
                                                    this.state.mentordetails.position
                                                )}
                                            </div>
                                            <div className=" d-lg-flex flex-row ">
                                                <div className="appointment-font d-flex flex-row mt-2 me-1">
                                                    <i className="fa-regular fa-clock icon-appoitnment me-1 mt-1"></i>
                                                    {!this.state.mentordetails.start_time ? (
                                                        <Skeleton
                                                            width="4rem"
                                                            className="mt-1 ms-1"
                                                            style={{
                                                                backgroundcolor: "black",
                                                            }}
                                                        ></Skeleton>
                                                    ) : (
                                                        this.state.mentordetails.start_time
                                                    )}
                                                </div>
                                                <div className="appointment-font d-flex flex-row  mt-2">
                                                    <i class="fa-regular fa-calendar icon-appoitnment me-1 mt-1"></i>
                                                    {!this.state.mentordetails.appointment_date ? (
                                                        <Skeleton
                                                            width="4rem"
                                                            className="mt-1 ms-1"
                                                            style={{
                                                                backgroundcolor: "black",
                                                            }}
                                                        ></Skeleton>
                                                    ) : (
                                                        this.state.mentordetails.appointment_date
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-4  ">
                                            <div className="card-domain d-flex flex-row justify-content-end me-3 mt-3">
                                                <div className="domain-circle mt-1 me-2"></div>
                                                <span>{homeText.Mentor}</span>
                                            </div>
                                            <div className="d-flex flex-row  w-100 mt-3">
                                                {this.state.createMentor_btn && (
                                                    <NavLink to={"/appointment/mentor"} className="links">
                                                        <button className="studenthomepage-cards-join ">
                                                            {homeText.Create}
                                                        </button>
                                                    </NavLink>
                                                )}
                                            </div>
                                            {this.state.joinMentor_btn && (
                                                <div className="d-flex flex-row w-100 ">
                                                    <button
                                                        className={
                                                            this.state.joindisableMentor
                                                                ? "studenthomepage-cards-join-hover "
                                                                : "studenthomepage-cards-join "
                                                        }
                                                        disabled={this.state.joindisableMentor}
                                                        onClick={() =>
                                                            this.getAppointmentMeetLink(
                                                                this.state.mentordetails.id
                                                            )
                                                        }
                                                    >
                                                        {homeText.join}
                                                    </button>
                                                    <i
                                                        class="fa-regular fa-trash delete-icon mt-1 ms-2"
                                                        onClick={() =>
                                                            this.setState({
                                                                appointment_id: this.state.mentordetails.id,
                                                                ownername: "mentor",
                                                                showDeleteAppointment: true,
                                                            })
                                                        }
                                                    ></i>
                                                </div>
                                            )}
                                            <div className="d-flex flex-row  ">
                                                {this.state.mentorre_schedule && (
                                                    <button
                                                        className="btn-yellow  "
                                                        onClick={() =>
                                                            this.appointmentReschedule(
                                                                this.state.mentordetails.id
                                                            )
                                                        }
                                                    >
                                                        {homeText.Reschedule}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="studenthomeFeed-appointment-card mt-3  p-2">
                                    <div className="d-flex flex-row my-auto w-100">
                                        <div className="my-auto col-2">
                                            <div className="studenthomeFeed-appointment-card-img ms-auto ">
                                                <img
                                                    src={this.state.expertdetails.profile_image}
                                                    alt=""
                                                    className="img-fluid"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/image/errorprofileimg.webp";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="studenthomeFeed-appointment-card-content my-auto col-6 ps-3 pt-1">
                                            <div className="studenthomeFeed-appointment-card-username ">
                                                {" "}
                                                {!this.state.expertdetails.username ? (
                                                    <Skeleton
                                                        width="5rem"
                                                        className="ms-1 mt-1"
                                                        style={{
                                                            backgroundcolor: "black",
                                                        }}
                                                    ></Skeleton>
                                                ) : (
                                                    this.state.expertdetails.username
                                                )}
                                            </div>
                                            <div className="studenthomeFeed-appointment-card-userdomain mt-2">
                                                {" "}
                                                {!this.state.expertdetails.position ? (
                                                    <Skeleton
                                                        width="5rem"
                                                        className="ms-1 mt-1"
                                                        style={{
                                                            backgroundcolor: "black",
                                                        }}
                                                    ></Skeleton>
                                                ) : (
                                                    this.state.expertdetails.position
                                                )}
                                            </div>
                                            <div className=" d-lg-flex flex-row ">
                                                <div className="appointment-font d-flex flex-row mt-2  me-1">
                                                    <i className="fa-regular fa-clock icon-appoitnment me-1 mt-1"></i>
                                                    {!this.state.expertdetails.start_time ? (
                                                        <Skeleton
                                                            width="4rem"
                                                            className="ms-1 mt-1"
                                                            style={{
                                                                backgroundcolor: "black",
                                                            }}
                                                        ></Skeleton>
                                                    ) : (
                                                        this.state.expertdetails.start_time
                                                    )}
                                                </div>
                                                <div className="appointment-font d-flex flex-row  mt-2">
                                                    <i class="fa-regular fa-calendar icon-appoitnment me-1 mt-1"></i>
                                                    {!this.state.expertdetails.appointment_date ? (
                                                        <Skeleton
                                                            width="4rem"
                                                            className="ms-1 mt-1"
                                                            style={{
                                                                backgroundcolor: "black",
                                                            }}
                                                        ></Skeleton>
                                                    ) : (
                                                        this.state.expertdetails.appointment_date
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-4">
                                            <div className="card-domain d-flex flex-row justify-content-end me-3 mt-3">
                                                <div className="domain-circle mt-1 me-2"></div>
                                                <span>{homeText.IndustryExpert}</span>
                                            </div>
                                            <div className="d-flex flex-row  mt-3">
                                                {this.state.createExpert_btn && (
                                                    <NavLink to={"/appointment/expert"} className="links">
                                                        <button className="studenthomepage-cards-join ">
                                                            {homeText.Create}
                                                        </button>
                                                    </NavLink>
                                                )}
                                            </div>
                                            {this.state.joinExpert_btn && (
                                                <div className="d-flex flex-row w-100 mt-3">
                                                    <button
                                                        className={
                                                            this.state.joindisableExpert
                                                                ? "studenthomepage-cards-join-hover "
                                                                : "studenthomepage-cards-join "
                                                        }
                                                        disabled={this.state.joindisableExpert}
                                                        onClick={() =>
                                                            this.getAppointmentMeetLink(
                                                                this.state.mentordetails.id
                                                            )
                                                        }
                                                    >
                                                        {homeText.join}
                                                    </button>
                                                    <i
                                                        class="fa-regular fa-trash delete-icon mt-1 ms-2"
                                                        onClick={() =>
                                                            this.setState({
                                                                appointment_id: this.state.expertdetails.id,
                                                                ownername: "expert",
                                                                showDeleteAppointment: true,
                                                            })
                                                        }
                                                    ></i>
                                                </div>
                                            )}
                                            {this.state.expertre_schedule && (
                                                <div className=" d-flex flex-row  mt-3">
                                                    <button
                                                        className="btn-yellow"
                                                        onClick={() =>
                                                            this.appointmentReschedule(
                                                                this.state.expertdetails.id
                                                            )
                                                        }
                                                    >
                                                        {homeText.Reschedule}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-row ms-1 ms-md-2 ms-lg-1">
                                <div className="hl-appointment p-2 ">
                                    <div className="w-100 ">
                                        <div className="studenthomeFeed-appointment-card-img  mx-auto">
                                            <img
                                                src={this.state.mentordetails.profile_image}
                                                alt=""
                                                className="img-fluid"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/image/errorprofileimg.webp";
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-100 mt-1 mx-auto">
                                        <div className="studenthomeFeed-appointment-card-username center">
                                            {" "}
                                            {!this.state.mentordetails.username ? (
                                                <Skeleton
                                                    width="5rem"
                                                    className="ms-1 mt-1"
                                                    style={{
                                                        backgroundcolor: "black",
                                                    }}
                                                ></Skeleton>
                                            ) : (
                                                this.state.mentordetails.username
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-100 ">
                                        <div className="studenthomeFeed-appointment-card-userdomain center mt-1">
                                            {" "}
                                            {!this.state.mentordetails.position ? (
                                                <Skeleton
                                                    width="5rem"
                                                    className="ms-1 mt-1"
                                                    style={{
                                                        backgroundcolor: "black",
                                                    }}
                                                ></Skeleton>
                                            ) : (
                                                this.state.mentordetails.position
                                            )}
                                        </div>
                                    </div>
                                    <div className=" d-flex flex-row col-12 mt-1">
                                        <div className="appointment-font d-flex flex-row  mx-auto ">
                                            <i className="fa-regular fa-clock icon-appoitnment me-1 mt-1"></i>
                                            {!this.state.mentordetails.start_time ? (
                                                <Skeleton
                                                    width="5rem"
                                                    className="ms-1 mt-1"
                                                    style={{
                                                        backgroundcolor: "black",
                                                    }}
                                                ></Skeleton>
                                            ) : (
                                                this.state.mentordetails.start_time
                                            )}
                                        </div>
                                    </div>
                                    <div className=" d-flex flex-row col-12 mt-1">
                                        <div className="appointment-font d-flex flex-row mx-auto">
                                            <i class="fa-regular fa-calendar icon-appoitnment me-1 mt-1"></i>
                                            {!this.state.mentordetails.appointment_date ? (
                                                <Skeleton
                                                    width="5rem"
                                                    className="ms-1 mt-1"
                                                    style={{
                                                        backgroundcolor: "black",
                                                    }}
                                                ></Skeleton>
                                            ) : (
                                                this.state.mentordetails.appointment_date
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-100 mt-2 px-1 mx-auto">
                                        <div className="d-flex flex-row justify-content-center">
                                            {this.state.createMentor_btn && (
                                                <NavLink to={"/appointment/mentor"} className="links">
                                                    <button className="btn-h1 mx-auto">
                                                        {homeText.Create}
                                                    </button>
                                                </NavLink>
                                            )}
                                        </div>
                                        {this.state.joinMentor_btn && (
                                            <div className="d-flex flex-row justify-content-center w-100">
                                                <button
                                                    className={
                                                        this.state.joindisableMentor
                                                            ? "btn-h1-hover"
                                                            : "btn-h1"
                                                    }
                                                    disabled={this.state.joindisableMentor}
                                                    onClick={() =>
                                                        this.getAppointmentMeetLink(
                                                            this.state.mentordetails.id
                                                        )
                                                    }
                                                >
                                                    {homeText.join}
                                                </button>
                                                <i
                                                    class="fa-regular fa-trash delete-icon mt-1 ms-2"
                                                    // data-bs-toggle="modal"
                                                    // data-bs-target="#appointmentcancel"
                                                    onClick={() =>
                                                        this.setState({
                                                            appointment_id: this.state.mentordetails.id,
                                                            ownername: "mentor",
                                                            showDeleteAppointment: true,
                                                        })
                                                    }
                                                ></i>
                                            </div>
                                        )}
                                        {this.state.mentorre_schedule && (
                                            <button
                                                className="studenthomepage-cards-join w-100 "
                                                onClick={() =>
                                                    this.appointmentReschedule(this.state.mentordetails.id)
                                                }
                                            >
                                                {homeText.Reschedule}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="hl-appointment ms-2 p-2">
                                    <div className="w-100 ">
                                        <div className="studenthomeFeed-appointment-card-img  mx-auto">
                                            <img
                                                src={this.state.expertdetails.profile_image}
                                                alt=""
                                                className="img-fluid"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/image/errorprofileimg.webp";
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-100 mt-1">
                                        <div className="studenthomeFeed-appointment-card-username center">
                                            {" "}
                                            {this.state.expertdetails === "" ? (
                                                <Skeleton
                                                    width="5rem"
                                                    className="p-mb-2 ms-4 mt-4"
                                                    style={{
                                                        backgroundcolor: "black",
                                                    }}
                                                ></Skeleton>
                                            ) : (
                                                this.state.expertdetails.username
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-100 ">
                                        <div className="studenthomeFeed-appointment-card-userdomain center mt-1">
                                            {" "}
                                            {this.state.expertdetails === "" ? (
                                                <Skeleton
                                                    width="5rem"
                                                    className="p-mb-2 ms-4 mt-4"
                                                    style={{
                                                        backgroundcolor: "black",
                                                    }}
                                                ></Skeleton>
                                            ) : (
                                                this.state.expertdetails.position
                                            )}
                                        </div>
                                    </div>
                                    <div className=" d-flex flex-row col-12 mt-1">
                                        <div className="appointment-font d-flex flex-row  mx-auto ">
                                            <i className="fa-regular fa-clock icon-appoitnment me-1 mt-1"></i>
                                            {!this.state.expertdetails.start_time ? (
                                                <Skeleton
                                                    width="5rem"
                                                    className="ms-1 mt-1"
                                                    style={{
                                                        backgroundcolor: "black",
                                                    }}
                                                ></Skeleton>
                                            ) : (
                                                this.state.expertdetails.start_time
                                            )}
                                        </div>
                                    </div>
                                    <div className=" d-flex flex-row col-12 mt-1">
                                        <div className="appointment-font d-flex flex-row   mx-auto">
                                            <i class="fa-regular fa-calendar icon-appoitnment me-1 mt-1"></i>
                                            {!this.state.expertdetails.appointment_date ? (
                                                <Skeleton
                                                    width="5rem"
                                                    className="ms-1 mt-1"
                                                    style={{
                                                        backgroundcolor: "black",
                                                    }}
                                                ></Skeleton>
                                            ) : (
                                                this.state.expertdetails.appointment_date
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-100 px-1 mt-1">
                                        <div className="d-flex flex-row justify-content-center">
                                            {this.state.createExpert_btn && (
                                                <NavLink to={"/appointment/expert"} className="links">
                                                    <button className="btn-h1 mt-1   mx-auto">
                                                        {homeText.Create}
                                                    </button>
                                                </NavLink>
                                            )}
                                        </div>
                                        {this.state.joinExpert_btn && (
                                            <div className="d-flex flex-row justify-content-center mt-2 w-100">
                                                <button
                                                    className={
                                                        this.state.joindisableExpert
                                                            ? "btn-h1-hover"
                                                            : "btn-h1"
                                                    }
                                                    disabled={this.state.joindisableExpert}
                                                    onClick={() =>
                                                        this.getAppointmentMeetLink(
                                                            this.state.mentordetails.id
                                                        )
                                                    }
                                                >
                                                    {homeText.join}
                                                </button>
                                                <i
                                                    class="fa-regular fa-trash delete-icon mt-1 ms-2"
                                                    onClick={() =>
                                                        this.setState({
                                                            appointment_id: this.state.expertdetails.id,
                                                            ownername: "expert",
                                                            showDeleteAppointment: true,
                                                        })
                                                    }
                                                ></i>
                                            </div>
                                        )}
                                        {this.state.expertre_schedule && (
                                            <button
                                                className="studenthomepage-cards-join w-100"
                                                onClick={() =>
                                                    this.appointmentReschedule(this.state.expertdetails.id)
                                                }
                                            >
                                                {homeText.Reschedule}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="webinar-card   mx-sm-auto mx-lg-1">
                                <div className="webinar-card-title d-flex flex-row">
                                    <div className="webinar-card-title-name my-auto me-auto ms-4">
                                        {homeText.Webinar}
                                    </div>
                                    <div
                                        className="webinar-card-view my-auto ms-auto me-4"
                                        onClick={() => this.setState({ showWebinarList: true })}
                                    >
                                        <i class="fa-solid fa-chevron-right me-4"></i>
                                    </div>
                                </div>
                                {this.state.webinardetailslist.length !== 0 ? (
                                    <>
                                        <Carousel controls={false}>
                                            {this.state.webinardetailslist
                                                .slice(0, 5)
                                                .map((data, index) => {
                                                    let webinarDate = Date.parse(
                                                        `${data.date}T${data.time}`
                                                    );
                                                    // 
                                                    //     webinarDate > Date.now(),
                                                    //     data.date
                                                    // );
                                                    return (
                                                        <Carousel.Item>
                                                            <div key={index}>
                                                                <div className=" d-flex flex-row mt-2 px-3">
                                                                    <div className=" ">
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
                                                                    <div className="studenthomeFeed-appointment-card-content my-auto  ps-4 pt-2">
                                                                        <p className="studenthomeFeed-appointment-card-username">
                                                                            {data.username}
                                                                        </p>
                                                                        <p className="studenthomeFeed-appointment-card-userdomain">
                                                                            {data.position_mentor === null
                                                                                ? data.position_expert
                                                                                : data.position_mentor}
                                                                        </p>
                                                                    </div>
                                                                    <div className="my-auto ms-auto  pe-2">
                                                                        <div className=" mt-4 center">
                                                                            <button
                                                                                className={
                                                                                    webinarDate > Date.now()
                                                                                        ? "studenthomepage-cards-join-hover"
                                                                                        : "studenthomepage-cards-join"
                                                                                }
                                                                                disabled={webinarDate > Date.now()}
                                                                                onClick={() => this.getMeetLink(data.id)}
                                                                            >
                                                                                {homeText.join}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="webinar-title mt-4 ms-4">
                                                                    {data.title}
                                                                </div>
                                                                <div className="webinar-description mt-3  mx-4">
                                                                    {data.description}{" "}
                                                                </div>
                                                                <div className=" d-flex flex-row ms-4 mt-3">
                                                                    <i className="fa-regular fa-clock icon-studenthomeFeed me-3 mt-1"></i>
                                                                    <p>{data.time}</p>
                                                                </div>
                                                                <div className=" d-flex flex-row ms-4 mt-1">
                                                                    <i className="fa-regular fa-calendar icon-studenthomeFeed me-3 mt-1"></i>
                                                                    <p>{data.date}</p>
                                                                    <span
                                                                        className="ms-auto me-3 mt-2"
                                                                        onClick={() => this.viewWebinardata(data.id)}
                                                                    >
                                                                        {homeText.Viewmore}
                                                                    </span>
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
                                            <img src="/image/Group276.svg" alt="" className="mt-5" />
                                        </div>
                                        <p className="">{homeText.NoWebinorScheduled}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {this.state.showCreatefeed ? (
                        <CreateModal
                            closefeed={this.closeFeed}
                            loading={this.showLoading}
                            user={this.props.user}
                            theme={this.props.theme}
                            updateFeed={this.refreshFeedList}
                            alertToaste={this.alertToaste}
                            ref={this.modalRef}
                        />
                    ) : null}
                    <Modal
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        show={this.state.editsShow}
                        onHide={() => this.setState({ editsShow: false })}
                        className={
                            this.props.theme.is_dark ? "themeblack_modal" : "themewhite_modal"
                        }
                    >
                        <Modal.Header>
                            <i
                                class="fa-regular fa-circle-xmark  ms-auto"
                                onClick={() =>
                                    this.setState({
                                        editsShow: false,
                                        descriptionError: false,
                                        titleError: false,
                                        switchImageButton:true
                                    })
                                }
                            ></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="d-flex flex-row ms-2">
                                <div className=" create-feed-profile d-flex  ms-2">
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
                                <h5 className="my-auto ms-3 modal-username">
                                    {this.props.user.username}
                                </h5>
                            </div>
                            <Formik
                                initialValues={{ description: "", title: "" }}
                                enableReinitialize={true}
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
                                        this.setState({ descriptionError: true });
                                    } else if (this.state.editpost.title === "") {
                                        this.setState({ titleError: true });
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
                                        formData.append(
                                            "visibility",
                                            this.state.publicandprivate ? "local" : "global"
                                        );
                                        formData.append("url_preview", this.state.url_preview);
                                        if (this.state.switchImageButton) {
                                            formData.append("delete_image", "True");
                                        }
                                        this.feedAPI
                                            .editFeed(this.state.editpost.id, formData)
                                            .then((res) => {
                                                this.showLoading();
                                                if (res.status) {
                                                    this.alertToasteupdate();
                                                    this.refreshFeedList();
                                                    this.setState({
                                                        editsShow: false,
                                                        descriptionError: false,
                                                        titleError: false,
                                                        switchImageButton:true
                                                    });                                                    
                                                    onSubmitProps.resetForm();
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
                                    }
                                }}
                            // validationSchema={createpostSchema}
                            >
                                <Form className=" mt-3">
                                    <div className="d-flex flex-row mt-3 px-2">
                                        <div className="label-modal my-auto col-3" htmlFor="number">
                                            {feedsText.title}{" "}
                                        </div>
                                        <div className=" col-9">
                                            <Field
                                                name="title"
                                                type="text"
                                                className="comment-title col-12"
                                                maxlength="35"
                                                value={this.state.editpost.title}
                                                onChange={(e) => this.onChange(e)}
                                            />
                                            {this.state.titleError ? (
                                                <>
                                                    {this.state.editpost.title.length === 0 ? (
                                                        <div style={{ color: "red" }}>
                                                            {feedsText.required}
                                                        </div>
                                                    ) : null}
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="d-flex flex-row mt-3 px-2">
                                        <div className="label-modal col-3 my-auto" htmlFor="number">
                                            {feedsText.description}
                                        </div>
                                        <div className=" col-9">
                                            <Field
                                                name="description"
                                                as="textarea"
                                                className="comment-description col-12"
                                                maxlength="150"
                                                value={this.state.editpost.description}
                                                onChange={(e) => this.onChange(e)}
                                            />
                                            {this.state.descriptionError ? (
                                                <>
                                                    {this.state.editpost.description.length === 0 ? (
                                                        <div style={{ color: "red" }}>
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
                                        accept=".png, .jpg, .jpeg"
                                        ref={this.showpicture}
                                        style={{ display: "none" }}
                                    ></input>
                                    <div className="w-100  d-flex flex-row">
                                        <div className="col-8 d-flex flex-row justify-content-end mt-3">
                                            <div className="d-flex flex-row privateandpublic ms-md-5">
                                                <div
                                                    className={
                                                        this.state.publicandprivate
                                                            ? "active w-50 center ms-md-5"
                                                            : " w-50 center ms-md-5"
                                                    }
                                                    onClick={() =>
                                                        this.setState({
                                                            publicandprivate: true,
                                                        })
                                                    }
                                                >
                                                    <i class="fa-regular fa-circle-dot me-2"></i>
                                                    {feedsText.local}
                                                </div>
                                                <div
                                                    className={
                                                        this.state.publicandprivate
                                                            ? " w-50 center"
                                                            : "active w-50 center"
                                                    }
                                                    onClick={() =>
                                                        this.setState({
                                                            publicandprivate: false,
                                                        })
                                                    }
                                                >
                                                    <i class="fa-regular fa-circle-dot me-2"></i>{" "}
                                                    {feedsText.global}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="addimage-admin col-4 d-flex flex-row justify-content-end">
                                            <div className="d-flex flex-row">
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
                                    </div>
                                    <Modal.Footer>
                                        <div className=" update-post d-flex flex-row mt-4 mb-4">
                                            <button
                                                type="Submit"
                                                className="btn-blue"
                                            >
                                                {feedsText.post}
                                            </button>{" "}
                                        </div>
                                    </Modal.Footer>
                                </Form>
                            </Formik>
                        </Modal.Body>
                    </Modal>
                    <div
                        class="modal fade"
                        id="webinartitle"
                        data-keyboard="false"
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                    >
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="congratulation">
                                        <h1>{homeText.FeedbackQuestion}</h1>
                                        <img
                                            src="image/feedbackquestionlogo.png"
                                            alt=""
                                            className="img-fluid mt-5"
                                        />
                                        <p className="mt-5 mb-3">{homeText.Loremipsum}</p>
                                        <div className="d-flex flex-row mb-5">
                                            <button
                                                className="btn-blue mt-5"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                {homeText.Yes}
                                            </button>
                                            <button className="btn-blue mt-5 ms-4">
                                                {homeText.No}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal
                        size="xl"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        show={this.state.showWebinarList}
                        onHide={() => this.setState({ showWebinarList: false })}
                        className={
                            this.props.theme.is_dark ? "themeblack_modal" : "themewhite_modal"
                        }
                    >
                        <Modal.Header>
                            <h4 className="ms-auto ps-3">{homeText.Webinar}</h4>
                            <i
                                class="fa-regular fa-circle-xmark  ms-auto"
                                onClick={() => this.setState({ showWebinarList: false })}
                            ></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row mx-auto ">
                                {this.state.webinardetailslist.length !== 0 ? (
                                    <>
                                        {this.state.webinardetailslist.map((data, index) => {
                                            let webinarDate = Date.parse(`${data.date}T${data.time}`);
                                            let appointmentdate = data.date.split("-");
                                            //  
                                            return (
                                                <div
                                                    className="mx-auto col-lg-4 col-md-6 col-sm-12 mt-3"
                                                    key={index}
                                                >
                                                    <div
                                                        className="studenthomepage-fotter-cards mx-auto pt-2"
                                                        onClick={() => this.viewWebinardata(data.id)}
                                                    >
                                                        <div className="studenthomepage-card-Title ">
                                                            {data.title}
                                                        </div>
                                                        <div className="studenthomepage-card-description ">
                                                            {data.description}
                                                        </div>
                                                        <div className="studenthomepage-card-date ">
                                                            <img
                                                                src="image/appointmentdate.png"
                                                                alt=""
                                                                className=" img-fluid webinardate me-1  mb-1"
                                                            />
                                                            {`${appointmentdate[2]} -${appointmentdate[1]}-${appointmentdate[0]}`}
                                                            <span className="studenthomepage-card-date-time ms-1">
                                                                <img
                                                                    src="image/appointmenttime.png"
                                                                    alt=""
                                                                    className=" img-fluid webinardate  mb-1"
                                                                />{" "}
                                                                {data.time}
                                                            </span>
                                                        </div>
                                                        <div className=" d-flex flex-row justify-content-center ">
                                                            <div className="studenthomepage-cards-img">
                                                                <img
                                                                    src={this.state.expertdetails.profile_image}
                                                                    alt=""
                                                                    className="img-fluid"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = "/image/errorprofileimg.webp";
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
                                                            {homeText.join}
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
                                        <p className="">{homeText.NoWebinorScheduled}</p>
                                    </div>
                                )}
                            </div>
                        </Modal.Body>
                        <Modal.Footer></Modal.Footer>
                    </Modal>
                    <Modal
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        show={this.state.showWebinarView}
                        onHide={() => this.setState({ showWebinarView: false })}
                        className={
                            this.props.theme.is_dark ? "themeblack_modal" : "themewhite_modal"
                        }
                    >
                        <Modal.Header>
                            <h4 className=" ms-auto pt-2 ">{homeText.WebinarDetails}</h4>
                            <i
                                class="fa-regular fa-circle-xmark  ms-auto"
                                onClick={() => this.setState({ showWebinarView: false })}
                            ></i>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="webinarview-title mt-2">
                                <span>{this.state.webinardata.title}</span>
                            </div>
                            <div className="webinarview-description mt-2">
                                <span>{this.state.webinardata.description}</span>
                            </div>
                            <div className="webinarview-dateandtime mt-3 ">
                                <h4>{homeText.DateandTime}</h4>
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
                                <h4>{homeText.Presenter}</h4>
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
                            <Modal.Footer>
                                <div className="d-flex flex-row justify-content-center w-100">
                                    <button
                                        className={
                                            this.state.webinardata.joinDisable
                                                ? "studenthomepage-cards-join-hover "
                                                : "studenthomepage-cards-join "
                                        }
                                        disabled={this.state.webinardata.joinDisable}
                                        onClick={() => this.getMeetLink(this.state.webinardata.id)}
                                    >
                                        {homeText.join}
                                    </button>
                                </div>
                            </Modal.Footer>
                        </Modal.Body>
                    </Modal>
                    <Modal
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        show={this.state.showDeleteAppointment}
                        onHide={() => this.setState({ showDeleteAppointment: false })}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="">
                                <Formik
                                    initialValues={{ title: "" }}
                                    onSubmit={(values, onSubmitProps) => {
                                        let formData = new FormData();
                                        formData.append("reason", values.title);
                                        formData.append("reschedule", "false");
                                        formData.append("appointment_id", this.state.appointment_id);
                                        this.feedAPI.AppointmentReschedule(formData).then((res) => {
                                            this.setState({
                                                showDeleteAppointment: false,
                                            });
                                            if (res.status) {
                                                this.props.history.push(
                                                    `/appointment/${this.state.ownername}`
                                                );
                                                this.getAppointment();
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
                                        onSubmitProps.resetForm();
                                    }}
                                    validationSchema={appointmentDeleteSchema}
                                >
                                    <Form className="appointment-cancel">
                                        <h4 className=" center" htmlFor="number">
                                            {homeText.Doyouwant}
                                        </h4>
                                        <Field
                                            name="title"
                                            as="textarea"
                                            className="cancel-response mt-3"
                                        />
                                        <ErrorMessage name="title">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                        <div>
                                            <Modal.Footer className="d-flex flex-row justify-content-center w-100">
                                                <button type="submit" className="btn-blue  mx-auto">
                                                    {homeText.Confirm}
                                                </button>{" "}
                                            </Modal.Footer>
                                        </div>
                                    </Form>
                                </Formik>
                            </div>
                        </Modal.Body>
                    </Modal>
                    <Modal
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        show={this.state.showReschedule}
                        onHide={() => this.setState({ showReschedule: false })}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="">
                                <Formik
                                    initialValues={{ reason: "" }}
                                    onSubmit={(values) => {
                                        let formData = new FormData();
                                        formData.append("reason", values.reason);
                                        formData.append("reschedule", "true");
                                        formData.append("appointment_id", this.state.appointment_id);
                                        this.feedAPI.AppointmentDelete(formData).then((res) => {
                                            this.getAppointment();
                                            this.setState({
                                                showReschedule: false,
                                            });
                                            if (res.status) {
                                                this.props.history.push(
                                                    `/appointment/${this.state.ownername}`
                                                );
                                                this.setState({
                                                    showReschedule: false,
                                                });
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
                                    validationSchema={createpostSchema}
                                >
                                    <Form className="appointment-cancel">
                                        <h5 className=" center" htmlFor="number">
                                            {homeText.DoyouwanttoReSchedule}
                                        </h5>
                                        <Field
                                            name="reason"
                                            as="textarea"
                                            className="cancel-response mt-3"
                                        />
                                        <ErrorMessage name="reason">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                        <Modal.Footer className="d-flex flex-row justify-content-center w-100">
                                            <button type="submit" className="btn-blue  mx-auto">
                                                {homeText.Confirm}
                                            </button>{" "}
                                        </Modal.Footer>
                                    </Form>
                                </Formik>
                            </div>
                        </Modal.Body>
                        <Modal.Footer></Modal.Footer>
                    </Modal>
                    <Modal
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
                                <center>
                                    <img
                                        src="image/errormessage.png"
                                        alt=""
                                        className="errormessage-img img-fluid "
                                    />
                                </center>
                                <center className="mt-3 mb-3">
                                    <h2>{this.state.message}</h2>
                                </center>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                onClick={() => this.setState({ show: false })}
                                className="btn-blue mx-auto mt-5 mb-5"
                            >
                                {homeText.ok}
                            </button>
                        </Modal.Footer>
                    </Modal>
                </div >
            </div >
        )
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
)(withRouter(StudentHomFeed));

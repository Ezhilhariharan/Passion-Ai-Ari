import React, { Component } from "react";
import "../styles/Appointment.scss";
import Sidenavbar from "../../../../navbar/sidenavbar/Sidenavbar";
import Header from "../../../../navbar/header/Header";
import Calender from "./Calender/Calender";
import RangeCalender from "./Calender/RangeCalender";
import "../../home/studenthome/styles/StudentHomePage.scss";
import { appointmentAPI } from "../api/Get";
import { appointmentpostAPI } from "../api/Post";
import axios from "axios";
import { Skeleton } from "primereact/skeleton";
import jwt_decode from "jwt-decode";
import ScrollArea from "react-scrollbar";
import { Toast } from "primereact/toast";
import { withRouter, NavLink } from "react-router-dom";
import Deletemodal from "../../../../common_Components/popup/Deletemodal";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppoinmentText } from "../const/const_Appoinment";
import * as Yup from "yup";
const resheduleSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
});
let username, mentorDetails_id, expertDetails_id;
class Appointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mentordetails: "",
            expertdetails: "",
            showmentor: false,
            mentor_id: "",
            showexpert: false,
            showcalender: false,
            showslots: false,
            selectedslots: [],
            selecteddata: "",
            selecteddate: "",
            selectedtime: "",
            appointmentdate: "",
            slotsid: "",
            buttondisable: true,
            passionuserid: "",
            usertype: false,
            appoitnmentlist: [],
            active: 1,
            showfromdate: "",
            showfromdate2: "",
            showtodate: "",
            todate2: "",
            showmodal: false,
            message: "",
            mentorslots: [],
            todaydate: new Date(),
            show: false,
            activeid: "",
            selectioncard: false,
            mentordetails_starttime: "",
            expertdetails_starttime: "",
            errormodal: false,
            errorMessage: "",
            todate: "",
            showReschedule: false,
            appointment_id: "",
            block: true,
            mentorJoinBTN: false,
            expertJoinBTN: false,
        };
        username = this.props.match.params.id;
        this.appointmentAPI = new appointmentAPI();
        this.appointmentpostAPI = new appointmentpostAPI();
        this.selectedappointmentdate = this.selectedappointmentdate.bind(this);
        this.selectedmentor = this.selectedmentor.bind(this);
        this.selectedexpert = this.selectedexpert.bind(this);
        this.bookappointment = this.bookappointment.bind(this);
        this.fromdate = this.fromdate.bind(this);
        this.todate = this.todate.bind(this);
        this.showSticky = this.showSticky.bind(this);
    }
    componentDidMount() {
        if (typeof axios.defaults.headers.common["Authorization"] === "undefined") {
            axios.defaults.headers.common["Authorization"] =
                "Token " + localStorage.getItem("passion_token");
        }
        let userid = localStorage.getItem("passion_token");
        let usertype = localStorage.getItem("passion_usertype");
        if (usertype == 6) {
            this.setState({ usertype: true });
            let decoded = jwt_decode(userid);
            this.setState({ passionuserid: decoded.user_id });
            this.getAppointmentDetails();
        } else {
            this.setState({
                usertype: false,
                selectioncard: true,
                showcalender: true,
            });
            this.getAppointmentList();
            //    
            let date = `${this.state.todaydate.getFullYear()}-${this.state.todaydate.getMonth() + 1
                }-${this.state.todaydate.getDate()}`;
            let currentTime = new Date().toLocaleTimeString("it-IT");
        }
        if (username == "mentor") {
            this.setState({
                showmentor: true,
                showcalender: true,
                selectioncard: true,
            });
        } else if (username == "expert") {
            this.setState({
                showexpert: true,
                showcalender: true,
                selectioncard: true,
            });
        }
        this.gettingcancelbutton();
    }
    getAppointmentList = () => {
        this.appointmentAPI.getAppointmentMentorandExpert().then((data) => {
            if (data.status) {
                let appointments = [];
                data.data.map((item) => {
                    let splitdate = item.appointment_date.split("-");
                    let appointmentdate = new Date(
                        splitdate[0],
                        splitdate[1] - 1,
                        splitdate[2]
                    );
                    let validationdate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
                    if (validationdate >= appointmentdate) {
                        appointments.push({
                            ...item,
                            is_cancel: false,
                        });
                    } else {
                        appointments.push({
                            ...item,
                            is_cancel: true,
                        });
                    }
                });
                this.setState({
                    appoitnmentlist: appointments,
                    showcalender: true,
                });
            }
        });
    };
    infoToaste = () => {
        this.props.showtoast({
            text: "Select your date from Today",
            time: new Date().getTime(),
        });
    };
    getAppointmentDetails = () => {
        this.appointmentAPI.getAppointment().then((data) => {
            if (data.status) {
                this.setState({
                    mentordetails: data.data.mentor_appointment[0],
                    expertdetails: data.data.expert_appointment[0],
                    mentordetails_starttime: data.data.mentor_appointment[0]?.start_time,
                    expertdetails_starttime: data.data.expert_appointment[0]?.start_time,
                });
                mentorDetails_id = data.data.mentor_appointment[0]?.user_id;
                expertDetails_id = data.data.expert_appointment[0]?.user_id;
                if (username == "mentor") {
                    this.setState({
                        selecteddata: data.data.mentor_appointment[0],
                        mentor_id: mentorDetails_id,
                    });
                } else if (username == "expert") {
                    this.setState({
                        selecteddata: data.data.expert_appointment[0],
                        mentor_id: expertDetails_id,
                    });
                }
            } else {
            }
        });
    };
    selectedmentor(id) {
        if (this.state.mentordetails_starttime === null) {
            this.setState({
                mentor_id: id,
                showmentor: !this.state.showmentor,
                showexpert: false,
                showcalender: true,
                selecteddata: this.state.mentordetails,
                selectedslots: [],
                showslots: false,
                selecteddate: "",
                selectedtime: "",
            });
            if (this.state.showmentor === true) {
                this.setState({ selectioncard: false });
            } else {
                this.setState({ selectioncard: true });
            }
        } else {
            this.setState({
                show: true,
                message: "You have already created a appointment",
            });
        }
    }
    selectedexpert(id) {
        if (this.state.expertdetails_starttime === null) {
            this.setState({
                mentor_id: id,
                showexpert: !this.state.showexpert,
                showmentor: false,
                showcalender: true,
                selecteddata: this.state.expertdetails,
                selectedslots: [],
                showslots: false,
                selecteddate: "",
                selectedtime: "",
            });
            if (this.state.showexpert === true) {
                this.setState({ selectioncard: false });
            } else {
                this.setState({ selectioncard: true });
            }
        } else {
            this.setState({
                show: true,
                message: "You have already created a appointment",
            });
        }
    }
    ClearData = () => {
        this.setState({ selectedslots: [], selecteddate: "" });
    };
    selectedappointmentdate(date, showdate) {
        this.setState({ activeid: "", slotsid: "" });
        let months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        let now = new Date(date);
        this.setState({ appointmentdate: date });
        this.setState({
            selecteddate: showdate,
            showfromdate2: showdate,
            selectedtime: "",
        });
        if (this.state.usertype === true) {
            let ConvertedDate = `${this.state.todaydate.getFullYear()}-${this.state.todaydate.getMonth() + 1
                }-${this.state.todaydate.getDate()}`;
            let currentTime = new Date().toLocaleTimeString("it-IT");
            this.appointmentAPI
                .selectAppointmentdate(this.state.mentor_id, date)
                .then((data) => {
                    let slots = [];
                    if (data.status) {
                        if (date == ConvertedDate) {
                            data.data.map((item) => {
                                if (currentTime < item.start_time) {
                                    if (
                                        item.is_appointment_booked == false &&
                                        item.is_webinar_booked == false &&
                                        item.is_available == true
                                    ) {
                                        slots.push({
                                            ...item,
                                            show_select: true,
                                        });
                                    } else {
                                        slots.push({
                                            ...item,
                                            show_select: false,
                                        });
                                    }
                                }
                            });
                        } else {
                            data.data.map((item) => {
                                if (
                                    item.is_appointment_booked == false &&
                                    item.is_webinar_booked == false &&
                                    item.is_available == true
                                ) {
                                    slots.push({
                                        ...item,
                                        show_select: true,
                                    });
                                } else {
                                    slots.push({
                                        ...item,
                                        show_select: false,
                                    });
                                }
                            });
                        }
                        this.setState({
                            selectedslots: slots.filter(
                                (element) => element.show_select == true
                            ),
                        });
                        this.setState({ showslots: true });
                    } else {
                        this.setState({ selectedslots: [] });
                        this.setState({ showslots: false });
                    }
                });
        } else {
            let ConvertedDate = `${this.state.todaydate.getFullYear()}-${this.state.todaydate.getMonth() + 1
                }-${this.state.todaydate.getDate()}`;
            let currentTime = new Date().toLocaleTimeString("it-IT");
            this.appointmentAPI
                .getAppointmentslots(this.state.mentor_id, date)
                .then((res) => {
                    let slots = [];
                    if (res.status) {
                        if (date == ConvertedDate) {
                            res.data.map((item) => {
                                if (currentTime < item.start_time) {
                                    if (item.is_available) {
                                        slots.push({
                                            ...item,
                                            is_select: true,
                                        });
                                    } else {
                                        slots.push({
                                            ...item,
                                            is_select: false,
                                        });
                                    }
                                }
                            });
                        } else {
                            res.data.map((item) => {
                                if (item.is_available) {
                                    slots.push({
                                        ...item,
                                        is_select: true,
                                    });
                                } else {
                                    slots.push({
                                        ...item,
                                        is_select: false,
                                    });
                                }
                            });
                        }
                        this.setState({ mentorslots: slots });
                    } else {
                        this.setState({ mentorslots: [] });
                    }
                });
        }
    }
    gettingcancelbutton = () => {
        this.state.appoitnmentlist.map((data) => {
        });
    };
    bookappointment(data) {
        if (this.state.slotsid) {
            this.showLoading();
            this.appointmentpostAPI
                .bookAppointment(
                    this.state.mentor_id,
                    this.state.appointmentdate,
                    this.state.slotsid,
                    this.state.passionuserid
                )
                .then((res) => {
                    this.showLoading();
                    if (res.status) {
                        this.alertToaste(); //sucess
                        this.setState({
                            showmentor: false,
                            showexpert: false,
                            showcalender: false,
                            showslots: false,
                            selectioncard: false,
                            mentorslots: [],
                        });
                        this.setState({ todaydate: new Date() });
                        this.getAppointmentDetails();
                    } else {
                        //         errormodal: false,
                        // errorMessage: "",
                        if (res.message) {
                            if (typeof res.message === "object") {
                                let value = Object.values(res.message);
                                this.setState({ errorMessage: value[0], errormodal: true });
                            } else {
                                this.setState({ errorMessage: res.message, errormodal: true });
                            }
                        } else {
                            this.setState({
                                errorMessage: "Something Went Wrong",
                                errormodal: true,
                            });
                        }
                    }
                });
        } else {
            this.setState({
                errorMessage: "Select your slots",
                errormodal: true,
            });
        }

    }
    bookSlots = () => {
        if (this.state.active === 1) {
            let removedSlots = [];
            let addedSlots = [];
            this.state.mentorslots.forEach((item, index) => {
                if (!item.is_available && item.is_select) {
                    addedSlots.push(item.slot_id);
                } else if (item.is_available && !item.is_select) {
                    removedSlots.push(item.slot_id);
                }
            });
            if (addedSlots.length > 0 || removedSlots.length > 0) {
                this.showLoading();
                this.appointmentpostAPI
                    .updateSlotsAvailability(
                        this.state.appointmentdate,
                        addedSlots,
                        removedSlots
                    )
                    .then((res) => {
                        this.showLoading();
                        if (res.status) {
                            this.alertToaste();
                            this.getAppointmentList();
                            this.setState({
                                mentorslots: [],
                                showfromdate2: "",
                                mentorslots: [],
                            });
                            this.setState({ showslots: false });
                        } else {
                            if (res.message) {
                                if (typeof res.message === "object") {
                                    let value = Object.values(res.message);
                                    this.setState({ errorMessage: value[0], errormodal: true });
                                } else {
                                    this.setState({
                                        errorMessage: res.message,
                                        errormodal: true,
                                    });
                                }
                            } else {
                                this.setState({
                                    errorMessage: "Something Went Wrong",
                                    errormodal: true,
                                });
                            }
                        }
                    });
            } else {
                this.setState({
                    errormodal: true,
                    errorMessage: "Please add or modify slots for this date",
                });
            }
        } else if (this.state.active === 2) {
            let addedSlots = [];
            this.state.mentorslots.forEach((item, index) => {
                if (!item.is_available && item.is_select) {
                    addedSlots.push(item.slot_id);
                }
            });
            if (addedSlots.length > 0) {
                this.showLoading();
                this.appointmentpostAPI
                    .updateRangeSlotsAvailability(
                        addedSlots,
                        this.state.showfromdate,
                        this.state.todate2
                    )
                    .then((res) => {
                        this.showLoading();
                        if (res.status) {
                            this.alertToaste();
                            this.getAppointmentList();
                            this.setState({
                                active: 1,
                                todaydate: new Date(),
                                showfromdate2: "",
                                mentorslots: [],
                            });
                        } else {
                            if (res.message) {
                                if (typeof res.message === "object") {
                                    let value = Object.values(res.message);
                                    this.setState({ errorMessage: value[0], errormodal: true });
                                } else {
                                    this.setState({
                                        errorMessage: res.message,
                                        errormodal: true,
                                    });
                                }
                            } else {
                                this.setState({
                                    errorMessage: "Something Went Wrong",
                                    errormodal: true,
                                });
                            }
                        }
                    });
            } else {
                this.setState({
                    errormodal: true,
                    errorMessage: "Please add  slots for this date Range",
                });
            }
        }
    };
    fromdate(data, resdate) {
        // let months = [
        //     "January",
        //     "February",
        //     "March",
        //     "April",
        //     "May",
        //     "June",
        //     "July",
        //     "August",
        //     "September",
        //     "October",
        //     "November",
        //     "December",
        // ];
        // let now = new Date(resdate);
        this.setState({ showfromdate: resdate, showfromdate2: resdate });
    }
    todate(data, resdate) {
        // let months = [
        //     "January",
        //     "February",
        //     "March",
        //     "April",
        //     "May",
        //     "June",
        //     "July",
        //     "August",
        //     "September",
        //     "October",
        //     "November",
        //     "December",
        // ];
        // let now = new Date(resdate);
        this.setState({ showtodate: data, todate2: resdate, todate: resdate });
        this.showLoading();
        this.appointmentAPI
            .getRangeSlots(this.state.showfromdate, resdate)
            .then((res) => {
                this.showLoading();
                if (res.status) {
                    if (res.data.length > 0) {
                        this.setState({ mentorslots: res.data });
                    }
                } else {
                    this.setState({ showfromdate: "", showtodate: "" });
                    if (res.message) {
                        if (typeof res.message === "object") {
                            let value = Object.values(res.message);
                            this.setState({ errorMessage: value[0], errormodal: true });
                        } else {
                            this.setState({ errorMessage: res.message, errormodal: true });
                        }
                    } else {
                        this.setState({
                            errorMessage: "Something Went Wrong",
                            errormodal: true,
                        });
                    }
                }
            })
            .catch((err) => {
                this.setState({ show: true, message: err.response.Message });
            });
    }
    showSticky() {
        this.setState({
            active: 2,
            showcalender: true,
            showfromdate: "",
            selectedtime: "",
            showfromdate2: "",
            mentorslots: [],
        });
        this.toast.show({
            severity: "info",
            summary: "Select Calender Range Info",
            detail: "Select start Date and End Date for range Selection",
            sticky: true,
        });
    }
    showLoading() {
        this.props.loading({ loadingState: new Date().getTime() });
    }
    deleteappointmentmodal = (id) => {
        this.setState({ showReschedule: true, appointment_id: id });
    };
    deleteappointment = (value, id, answer) => {
        this.setState({ showmodal: value });
    };
    selectedSlots = (id) => {
        let selectedSlots = this.state.mentorslots[id].start_time;
        this.setState({ selectedtime: selectedSlots });
        let slots = this.state.mentorslots;
        slots.map((data, index) => {
            if (id === index) {
                if (data.is_select) {
                    data["is_select"] = false;
                } else {
                    data["is_select"] = true;
                }
            }
        });
        this.setState({ mentorslots: slots });
    };
    alertToaste = () => {
        this.props.showtoast({
            text: "Successfully Created",
            time: new Date().getTime(),
        });
    };
    getMeetLink = (id) => {
        this.appointmentAPI.getAppointmentMeetLink(id).then((res) => {
            if (res.status) {
                this.openInNewTab(res.data);
            }
        });
    };
    openInNewTab = (url) => {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };
    render() {
        return (
            <div className="Appointment ">
                <Toast ref={(el) => (this.toast = el)} position="top-center" />
                <Sidenavbar />
                <div className="studenthomepage-header d-flex flex-row">
                    <Header />
                </div>
                <div className="Appointment-body d-lg-flex flex-row">
                    {this.state.usertype ? (
                        <div className="Appointment-left mb-2">
                            <div className="studenthomeFeed-right-appointment  ">
                                {/* chnage kalaia */}
                                <div className="d-flex flex-row justify-content-center w-100">
                                    <div className="appointments">{AppoinmentText.Appointment}</div>
                                </div>
                                <div
                                    className="studenthomeFeed-appointment-card d-flex flex-row  mt-2 ms-xs-3"
                                    onClick={() =>
                                        this.selectedmentor(
                                            this.state.mentordetails.user_id,
                                            "mentor"
                                        )
                                    }
                                >
                                    <div className="d-flex flex-row h-100 w-100">
                                        <div className="my-auto col-3">
                                            <div className="studenthomeFeed-appointment-card-img mx-auto">
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
                                                {this.state.mentordetails.start_time ? (
                                                    <div className="appointment-font d-flex flex-row mt-2 mb-1">
                                                        <i className="fa-regular fa-clock icon-appoitnment me-1 mt-1"></i>
                                                        {this.state.mentordetails.start_time}
                                                    </div>
                                                ) : null}
                                                {this.state.mentordetails.appointment_date ? (
                                                    <div className="appointment-font mt-2 mb-1 ms-2">
                                                        <i class="fa-regular fa-calendar icon-appoitnment me-1 mt-1"></i>
                                                        {this.state.mentordetails.appointment_date}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className=" col-3">
                                            <div className="card-domain d-flex flex-row justify-content-end me-3 mt-3">
                                                <div className="domain-circle mt-1 me-1"></div>
                                                <span>{AppoinmentText.Mentor}</span>
                                            </div>
                                            <div className="my-auto mt-3 me-1">
                                                {this.state.showmentor ? (
                                                    <img
                                                        src="/image/done.png"
                                                        alt=""
                                                        className="done-img ms-1 ms-sm-5  mt-1 img-fluid"
                                                    />
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="studenthomeFeed-appointment-card mt-4 d-flex flex-row "
                                    onClick={() =>
                                        this.selectedexpert(
                                            this.state.expertdetails.user_id,
                                            "expert"
                                        )
                                    }
                                >
                                    <div className="d-flex flex-row h-100 w-100">
                                        <div className="my-auto col-3">
                                            <div className="studenthomeFeed-appointment-card-img mx-auto ">
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
                                                {this.state.expertdetails.start_time ? (
                                                    <div className="appointment-font d-flex flex-row mt-2">
                                                        <i className="fa-regular fa-clock icon-appoitnment me-1 mt-1"></i>
                                                        {this.state.expertdetails.start_time}
                                                    </div>
                                                ) : null}
                                                {this.state.expertdetails.appointment_date ? (
                                                    <div className="appointment-font d-flex flex-row mt-2 ms-2">
                                                        <i class="fa-regular fa-calendar icon-appoitnment me-1 mt-1"></i>
                                                        {this.state.expertdetails.appointment_date}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className=" col-3">
                                            <div className="card-domain d-flex flex-row justify-content-end me-3 mt-3">
                                                <div className="domain-circle mt-1 me-1"></div>
                                                <span>{AppoinmentText.IndustryExpert}</span>
                                            </div>
                                            <div className="my-auto mt-3 me-1">
                                                {this.state.showexpert ? (
                                                    <img
                                                        src="/image/done.png"
                                                        alt=""
                                                        className="done-img ms-1 ms-sm-5  mt-1 img-fluid"
                                                    />
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="Appointment-left-img ">
                                <img
                                    src="/image/create-appointment.webp"
                                    alt=""
                                    className=" img-fluid"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="Appointment-left-mentor ">
                            <div className="studenthomeFeed-right-webinar ">
                                <div className="  pb-2  mt-3   appointment">
                                    {this.state.appoitnmentlist.length !== 0
                                        ? AppoinmentText.Appointment
                                        : null}
                                </div>
                                {this.state.appoitnmentlist.length !== 0 ? (
                                    <ScrollArea
                                        speed={0.5}
                                        className="student-scroll"
                                        // contentClassName="content"
                                        horizontal={false}
                                        verticalScrollbarStyle={{
                                            background: "transparent",
                                            width: "0px",
                                        }}
                                        smoothScrolling={true}
                                    >
                                        {this.state.appoitnmentlist.map((data, index) => {
                                            let appoitnmentDate = Date.parse(
                                                `${data.appointment_date}T${data.start_time}`
                                            );
                                            let timeOut = Date.parse(
                                                `${data.appointment_date}T${data.end_time}`
                                            );
                                            return (
                                                <div
                                                    className="studenthomeFeed-appointment-card d-flex flex-row  ms-xs-3 mb-4"
                                                    key={index}
                                                // onClick={() => this.selectedmentor(this.state.mentordetails.mentor_id)}
                                                >
                                                    <div className="d-flex flex-row h-100 w-100">
                                                        <div className="my-auto col-3">
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
                                                        <div className="studenthomeFeed-appointment-card-content my-auto col-5">
                                                            <div className="studenthomeFeed-appointment-card-username ">
                                                                {data.username}
                                                            </div>
                                                            <div className="studenthomeFeed-appointment-card-userdomain mt-2 ">
                                                                {data.college_name}
                                                            </div>
                                                            <div className="studenthomeFeed-appointment-card-userdomain mt-2">
                                                                <img
                                                                    src="image/appointmenttime.png"
                                                                    alt=""
                                                                    className=" img-fluid me-2"
                                                                />
                                                                {data.start_time}
                                                            </div>
                                                            <div className="studenthomeFeed-appointment-card-userdomain mt-2">
                                                                <img
                                                                    src="image/appointmentdate.png"
                                                                    alt=""
                                                                    className=" img-fluid  me-2 "
                                                                />{" "}
                                                                {data.appointment_date}
                                                            </div>
                                                        </div>
                                                        <div className="appointment-card-end col-4 my-auto">
                                                            <div className="d-flex flex-row">
                                                                {timeOut > Date.now() ? (
                                                                    <button
                                                                        className={
                                                                            appoitnmentDate > Date.now()
                                                                                ? "studenthomepage-cards-join-hover"
                                                                                : "studenthomepage-cards-join"
                                                                        }
                                                                        disabled={appoitnmentDate > Date.now()}
                                                                        onClick={() => this.getMeetLink(data.id)}
                                                                    >
                                                                        {AppoinmentText.join}
                                                                    </button>
                                                                ) : (
                                                                    <span>{AppoinmentText.timeout}</span>
                                                                )}
                                                                {data.is_cancel ? (
                                                                    <i
                                                                        class="fa-regular fa-trash delete-icon mt-1 ms-3"
                                                                        onClick={() =>
                                                                            this.deleteappointmentmodal(data.id)
                                                                        }
                                                                    ></i>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </ScrollArea>
                                ) : (
                                    <div className="noappointment_list">
                                        <img
                                            src="/image/noappointment_list.png"
                                            alt=""
                                            className=" img-fluid"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="Appointment-right">
                        <div className="Appointment-selection-card ">
                            {this.state.selectioncard ? (
                                <>
                                    <div className="d-flex flex-row justify-content-center">
                                        {this.state.showcalender ? (
                                            this.state.active === 1 ? (
                                                <Calender
                                                    showcalender={this.state.showcalender}
                                                    selectdate={this.selectedappointmentdate}
                                                    toast={this.infoToaste}
                                                    cleardata={this.ClearData}
                                                />
                                            ) : (
                                                <RangeCalender
                                                    showcalender={this.state.showcalender}
                                                    fromdate={this.fromdate}
                                                    todate={this.todate}
                                                    toast={this.infoToaste}
                                                />
                                            )
                                        ) : (
                                            <div className="hide-calender">
                                                <img
                                                    src="/image/create-appointment.webp"
                                                    alt=""
                                                    className="mt-5 img-fluid"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {this.state.usertype ? null : (
                                        <div className="selecting-date d-flex flex-row">
                                            <button
                                                className={
                                                    "" +
                                                    (this.state.active === 1 ? " ActiveTab-date" : "")
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        active: 1,
                                                        showfromdate2: "",
                                                        mentorslots: [],
                                                    })
                                                }
                                            >
                                                <i class="fa-regular fa-circle-dot me-2"></i>
                                                {AppoinmentText.SingleDate}
                                            </button>
                                            <button
                                                className={
                                                    "" +
                                                    (this.state.active === 2 ? " ActiveTab-date" : "")
                                                }
                                                onClick={this.showSticky}
                                                label="Sticky"
                                            >
                                                <i class="fa-regular fa-circle-dot me-2"></i>
                                                {AppoinmentText.RangeDate}
                                            </button>
                                        </div>
                                    )}
                                    <div className="availabale_slots  ps-2 ps-sm-4  pe-sm-4 mb-1 ">
                                        <div className="d-flex flex-row">
                                            <h3>{AppoinmentText.AvailbaleSlots}</h3>
                                        </div>
                                        <div className=" d-flex flex-row   pt-1 w-100 mb-2 ">
                                            {this.state.usertype ? (
                                                <>
                                                    {this.state.showslots ? (
                                                        <>
                                                            {this.state.selectedslots.length === 0 ? (
                                                                <h5>
                                                                    <b>{AppoinmentText.Sorry}</b>,
                                                                    {AppoinmentText.PleaseSelectDate}
                                                                </h5>
                                                            ) : (
                                                                <div className="scrolls">
                                                                    {this.state.selectedslots.map(
                                                                        (data, index) => (
                                                                            // data.show_select &&
                                                                            <button
                                                                                className={
                                                                                    "" +
                                                                                    (index === this.state.activeid
                                                                                        ? "slots-active mx-2"
                                                                                        : "slots mx-2")
                                                                                }
                                                                                key={index}
                                                                                onClick={() =>
                                                                                    this.setState({
                                                                                        selectedtime: data.start_time,
                                                                                        slotsid: data.slot_id,
                                                                                        buttondisable: false,
                                                                                        activeid: index,
                                                                                    })
                                                                                }
                                                                            >
                                                                                {data.start_time}
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}{" "}
                                                        </>
                                                    ) : (
                                                        <div className="d-flex flex-row justify-content-center w-100">
                                                            <center>
                                                                <h4>Select your Date</h4>
                                                            </center>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="d-flex flex-row  w-100">
                                                    {this.state.mentorslots.length === 0 ? (
                                                        <div className="d-flex flex-row justify-content-center w-100">
                                                            <center>
                                                                <h4>Select your Date</h4>
                                                            </center>
                                                        </div>
                                                    ) : (
                                                        <div className="scrolls">
                                                            {this.state.mentorslots.map((data, index) => (
                                                                <button
                                                                    className={
                                                                        data.is_webinar_booked === true ||
                                                                            data.is_appointment_booked === true
                                                                            ? "slots-disable"
                                                                            : data.is_select
                                                                                ? "slots-active  mx-2"
                                                                                : "slots mx-2"
                                                                    }
                                                                    onClick={() => this.selectedSlots(index)}
                                                                    disabled={
                                                                        data.is_webinar_booked ||
                                                                            data.is_appointment_booked === true
                                                                            ? true
                                                                            : false
                                                                    }
                                                                >
                                                                    {data.start_time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="book-appointment ps-1 ps-sm-4 pe-4">
                                        <div className="appointment-profile d-flex flex-row gap-2">
                                            <div className="col-2">
                                                <div className="mx-auto book-appointment-profile-img">
                                                    <img
                                                        src={this.state.selecteddata.profile_image}
                                                        alt=""
                                                        className="img-fluid"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/image/errorprofileimg.webp";
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <h4 className=" mt-1">
                                                    {this.state.usertype ? (
                                                        this.state.selecteddata === "" ? (
                                                            <Skeleton
                                                                width="8rem"
                                                                className="p-mb-2 "
                                                                style={{
                                                                    backgroundcolor: "black",
                                                                }}
                                                            ></Skeleton>
                                                        ) : (
                                                            this.state.selecteddata.username
                                                        )
                                                    ) : (
                                                        this.props.username.username
                                                    )}
                                                </h4>
                                                {this.state.usertype ? (
                                                    <p className=" mt-1">
                                                        {this.state.selecteddata === "" ? (
                                                            <Skeleton
                                                                width="7rem"
                                                                className="p-mb-2 "
                                                                style={{
                                                                    backgroundcolor: "black",
                                                                }}
                                                            ></Skeleton>
                                                        ) : (
                                                            this.state.selecteddata.position
                                                        )}
                                                    </p>
                                                ) : null}
                                                {this.state.usertype ? (
                                                    <div className=" d-flex flex-row w-100 mt-2">
                                                        <div className=" d-flex flex-row ">
                                                            <img
                                                                src="/image/appointmentdate.png"
                                                                alt=""
                                                                className=" img-fluid appointmentdate me-2"
                                                            />
                                                            <p>
                                                                {" "}
                                                                {this.state.selecteddate === "" ? (
                                                                    <Skeleton
                                                                        width="5rem"
                                                                        className="p-mb-2 "
                                                                        style={{
                                                                            backgroundcolor: "black",
                                                                        }}
                                                                    ></Skeleton>
                                                                ) : (
                                                                    this.state.selecteddate
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className=" d-flex flex-row ms-3">
                                                            <img
                                                                src="/image/appointmenttime.png"
                                                                alt=""
                                                                className=" img-fluid appointmentdate me-2"
                                                            />
                                                            <p>
                                                                {this.state.selectedtime === "" ? (
                                                                    <Skeleton
                                                                        width="5rem"
                                                                        className="p-mb-2 "
                                                                        style={{
                                                                            backgroundcolor: "black",
                                                                        }}
                                                                    ></Skeleton>
                                                                ) : (
                                                                    this.state.selectedtime
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className=" w-100">
                                                        <div className=" d-flex flex-row mt-3">
                                                            <img
                                                                src="/image/appointmentdate.png"
                                                                alt=""
                                                                className=" img-fluid appointmentdate me-2"
                                                            />
                                                            <p>
                                                                {" "}
                                                                {this.state.showfromdate2 === "" ? (
                                                                    <Skeleton
                                                                        width="5rem"
                                                                        className="p-mb-2 "
                                                                        style={{
                                                                            backgroundcolor: "black",
                                                                        }}
                                                                    ></Skeleton>
                                                                ) : (
                                                                    this.state.showfromdate2
                                                                )}
                                                            </p>
                                                            {this.state.active === 2 ? (
                                                                <p className="ms-2 d-flex flex-row">
                                                                    {" "}
                                                                    to{" "}
                                                                    {this.state.showfromdate === "" ? (
                                                                        <Skeleton
                                                                            width="5rem"
                                                                            className="p-mb-2 ms-2"
                                                                            style={{
                                                                                backgroundcolor: "black",
                                                                            }}
                                                                        ></Skeleton>
                                                                    ) : (
                                                                        this.state.showtodate
                                                                    )}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className=" d-flex flex-row justify-content-center mt-2">
                                            {this.state.usertype ? (
                                                <button
                                                    className="btn-yellow w-50 "
                                                    disabled={this.state.buttondisable}
                                                    onClick={() => this.bookappointment()}
                                                >
                                                    {AppoinmentText.BookNow}
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn-yellow"
                                                    onClick={() => this.bookSlots()}
                                                >
                                                    {AppoinmentText.Confirm}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <div className="selection_card d-flex flex-row justify-content-center">
                                        <img
                                            src="/image/selection_card.png"
                                            alt=""
                                            className=" mx-auto img-fluid"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Modal
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    show={this.state.show}
                    onHide={() => this.setState({ show: false })}
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="">
                            <center>
                                {" "}
                                <img
                                    src="/image/errormessage.png"
                                    alt=""
                                    className="delete_img img-fluid  mx-5 ps-3  "
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/image/errorprofileimg.webp";
                                    }}
                                />
                            </center>
                            <center className="mt-3 mb-2">
                                <h5>
                                    <b>{this.state.message}</b>
                                </h5>
                            </center>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            onClick={() => this.setState({ show: false })}
                            className="btn-blue mx-auto mt-3 mb-3"
                        >
                            {AppoinmentText.ok}
                        </button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    show={this.state.showReschedule}
                    onHide={() => this.setState({ showReschedule: false })}
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
                        <i
                            class="fa-regular fa-circle-xmark  ms-auto"
                            onClick={() => this.setState({ showReschedule: false })}
                        ></i>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="">
                            <Formik
                                initialValues={{ title: "" }}
                                onSubmit={(values) => {
                                    let formData = new FormData();
                                    formData.append("reason", values.title);
                                    formData.append("reschedule", "false");
                                    formData.append("appointment_id", this.state.appointment_id);
                                    this.appointmentpostAPI
                                        .PostAppointmentForms(formData)
                                        .then((res) => {
                                            this.getAppointmentList();
                                            this.setState({
                                                showReschedule: false,
                                            });
                                            if (res.status) {
                                                this.props.history.push(
                                                    `/appointment/${this.state.ownername}`
                                                );
                                            } else {
                                                if (res.message) {
                                                    if (typeof res.message === "object") {
                                                        let value = Object.values(res.message);
                                                        this.setState({
                                                            errorMessage: value[0],
                                                            errormodal: true,
                                                        });
                                                    } else {
                                                        this.setState({
                                                            errorMessage: res.message,
                                                            errormodal: true,
                                                        });
                                                    }
                                                } else {
                                                    this.setState({
                                                        errorMessage: "Something Went Wrong",
                                                        errormodal: true,
                                                    });
                                                }
                                            }
                                        });
                                }}
                                validationSchema={resheduleSchema}
                            >
                                <Form className="appointment-cancel">
                                    <h5 className=" center" htmlFor="number">
                                        {AppoinmentText.Doyouappointment}
                                    </h5>
                                    <Field
                                        name="title"
                                        as="textarea"
                                        className="cancel-response mt-3"
                                    />
                                    <ErrorMessage name="title">
                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                    </ErrorMessage>
                                    <div className=" update-post d-flex flex-row mt-5">
                                        <Modal.Footer>
                                            <button type="submit" className="btn-blue  ">
                                                {AppoinmentText.Confirm}
                                            </button>{" "}
                                        </Modal.Footer>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </Modal.Body>
                </Modal>
                {/* private ErrorModal  */}
                <Modal
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    show={this.state.errormodal}
                    onHide={() => this.setState({ errormodal: false })}
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="w-100">
                            <center className="mt-5 mb-3">
                                <h4>
                                    <b>{this.state.errorMessage}</b>
                                </h4>
                            </center>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-flex flex-row justify-content-center w-100">
                            <button
                                className="btn-blue mt-4 mb-5 w-50"
                                onClick={() =>
                                    this.setState({
                                        errormodal: false,
                                        active: 1,
                                        showfromdate2: "",
                                    })
                                }
                            >
                                {AppoinmentText.ok}
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal>
                <Deletemodal
                    value={this.state.showmodal}
                    message={this.state.message}
                    deletefun={this.deleteappointment}
                />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        username: state.user,
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
)(withRouter(Appointment));

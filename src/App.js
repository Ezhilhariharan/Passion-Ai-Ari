import React, { Component } from "react";
import "./App.scss";
import Routing from "./components/router/Routing";
import { connect } from "react-redux";
import { FCMToken } from "firebaseInit";
import ReactNotificationComponent from "components/application/components/Notifications/ReactNotification";
import firebase1 from "firebaseInit";
import firebase from "firebase/app";
import { Modal } from "bootstrap";
class App extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      body: "",
      showNotification: false,
      notificationList: [],
      notificationListUpdateTime: "",
    };
    this.notification = React.createRef();
  }
  componentDidMount() {
    let messaging = null;
    if (firebase.messaging.isSupported()) {
      messaging = firebase1.messaging();
      console.error("messaging suppported");
    }
    if (!this.props.notify.token && messaging) {
      FCMToken()
        .then((token) => {
          if (token) {
            this.props.setToken(token);
          } else {
          }
        })
      messaging.onMessage((payload) => {
        let notifyMSG = payload.data
        console.log("notifyMSG", notifyMSG)
        let List = this.state.notificationList;
        List.unshift(notifyMSG);
        this.props.NotificationList({ list: List, Time: new Date().getTime() });
        this.setState({ notificationList: List });
        if (payload.hasOwnProperty("notification")) {
          this.props.setNotofication({
            title: payload.notification.title,
            body: payload.notification.body,
          });
        } else if (!Object.hasOwnProperty("notification")) {
          this.props.setNotofication({
            title: "sample",
            body: payload.data.default,
          });
        } else {
          alert("payload format not match");
        }
      });
    }
  }
  showWebinarViewModal = () => {
    const modalEle = this.notification.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideWebinarViewModal = () => {
    const modalEle = this.notification.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.notify.time !== 0 &&
      prevProps.notify.time !== this.props.notify.time
    ) {
      this.setState({ showNotification: true }, () => {
        setTimeout(() => this.setState({ showNotification: false }), 3000);
      });
    }
    if (
      this.props.Notification.NotificationTime !== 0 &&
      prevProps.Notification.NotificationTime !==
      this.props.Notification.NotificationTime
    ) {
      this.showWebinarViewModal();
    }
    if (prevState.notificationListUpdateTime !== this.props.List.Time) {
      this.setState({
        notificationList: this.props.List.List,
        notificationListUpdateTime: this.props.List.Time,
      });
    }
  }
  render() {
    return (
      <div
        className={this.props.theme.is_dark ? "theme--dark" : "theme--light"}
      >
        <div className="chage_color">
          <Routing />
          {this.state.showNotification ? (
            <ReactNotificationComponent
              title={this.props.notify.title}
              body={this.props.notify.body}
            />
          ) : (
            ""
          )}
        </div>
        <div className="modal " id="notification" ref={this.notification}>
          <div class="modal-dialog modal-dialog-centered 	modal-lg  modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h4 className="ms-auto ps-3">Notifications</h4>
                <i
                  class="fa-regular fa-circle-xmark  ms-auto"
                  onClick={this.hideWebinarViewModal}
                ></i>
              </div>
              <div class="modal-body">
                {/* <div className="currentday ms-2">Today</div> */}
                {this.state.notificationList.length > 0 ? (
                  <>
                    {this.state.notificationList.map((data, index) => (
                      <div
                        key={index}
                        className="d-flex flex-row notification-content mx-auto p-3 mt-3"
                      >
                        <div className="notification-profile my-auto ms-2">
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
                        <div className=" ms-3 content my-auto">
                          <div className="name">{data.title}</div>
                          <div className="msg mt-1">
                            {data.message}
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
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    theme: state.theme,
    notify: state.notify,
    Notification: state.Notification,
    List: state.List,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleTheme: (data) => {
      dispatch({ type: "TOGGLE_THEME", data: data });
    },
    setNotofication: (data) => {
      dispatch({ type: "NOTIFY_ME", data: data });
    },
    setToken: (data) => {
      dispatch({ type: "SET_TOKEN", data: data });
    },
    NotificationList: (data) => {
      dispatch({ type: "Notification_List", value: data });
    },
  };
};
// // export default withRouter(Header)
export default connect(mapStateToProps, mapDispatchToProps)(App);

// NTIFICATION RESPONSE
// {
//   "data": {
//       "profile_image": "https://passionaiaripro.s3.ap-south-1.amazonaws.com/profilePic/8466462590_60cef1c48a_b.jpg?2022-05-0306:51:03",
//       "webinar_id": "22",
//       "message": "Webinar by Mentor maanik is hosted on 2022-05-13 & 01:04.Tap the banner to know more",
//       "title": "PassionAri - webinar",
//       "type": "webinar_created"
//   },
//   "from": "211447117319",
//   "priority": "high",
//   "notification": {
//       "title": "PassionAri - webinar",
//       "body": "Webinar by Mentor maanik is hosted on 2022-05-13 & 01:04.Tap the banner to know more"
//   },
//   "fcmMessageId": "d4af2368-63f2-43bf-81b4-cf0ad6f1d393"
// }
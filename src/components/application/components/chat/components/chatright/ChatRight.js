import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import "./styles/chatright.scss";
import { postAPI } from "../../api/POST";
import ScrollArea from "react-scrollbar";
import moment from "moment";
moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "seconds",
    ss: "%ss",
    m: "a minute",
    mm: "%dm",
    h: "an hour",
    hh: "%dh",
    d: "a day",
    dd: "%dd",
    M: "a month",
    MM: "%dM",
    y: "a year",
    yy: "%dY",
  },
});
class ChatRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      currentUser: this.props.currentUser,
      chatImages: {},
      show: false,
      errormessage: "",
      showPreview: false,
      img_file: "",
      controlSroll: true,
      userType: "",
      showchatimg: false, // currentUserChat: this.props.messages
    };
    this.chatAPI = new postAPI();
    this.sendImage = this.sendImage.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.scrollRef = React.createRef();
    this.forwardRef = React.forwardRef();
    this.setChatLayout = this.setChatLayout.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    if (props.currentUser !== state.currentUser) {
      return {
        currentUser: props.currentUser,
        message: "",
      };
    }
    return null;
  }
  selectImage(e) {   
    let file = e.target.files[0];
    if (file) {
      if (file.size < 2097152) {
        this.setState({ showPreview: true, img_file: file });
        let reader = new FileReader();
        reader.onload = function () {
          document.getElementById("img_preview").src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.setState({
          errormessage: "Size is too big",
          show: true,
          img_file: [],
        });        
      }
    }    
    e.target.value = "";
  }
  sendImage() {
    this.props.Loading();
    let formData = new FormData();
    formData.append("file", this.state.img_file);
    formData.append("room_id", this.props.currentUser.room_id);
    this.chatAPI.uploadPic(formData).then((res) => {
      this.setState({ showPreview: false });
      this.props.Loading();
      if (res.status) {
        this.props.sendMessage({
          message: res.data.file_url,
          message_type: "image",
        });
      } else {
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ errormessage: value[0], show: true });
          } else {
            this.setState({ errormessage: res.message, show: true });
          }
        } else {
          this.setState({
            errormessage: "Something Went Wrong",
            show: true,
          });
        }
      }
    });
  }
  setChatLayout() {
    this.setState({ controlSroll: true });
  }
  showImage = (msg) => {
    if (msg) {
      this.setState({ chatimage: msg, showchatimg: true });
    }
  };
  convertToURL(index, file) {
    if ("File" in window && file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 
        return reader.result;
      };
      reader.readAsDataURL(file);
    }
    let chatImages = this.state.chatImages;
    chatImages[index] = file;
    this.setState({ chatImages: chatImages });
    return file;
  }
  scrollTop = (value) => {
    if (this.props.messages.length == 50) {
      if (value.topPosition == 0) {
        if (this.props.UserChatLoader.next && this.state.controlSroll) {
          let page_num = this.props.UserChatLoader.next.split("=")[1];
          // 
          this.props.loadMoreUserChatMessages(page_num);
          this.setState({ controlSroll: false });
        }
      }
    }
  };
  PreviewModalClose = () => {
    this.setState({ showPreview: false });
  };
  render() {
    // 
    return (
      <div className="chat-right d-none d-md-block">
        {Object.keys(this.state.currentUser).length > 0 ? (
          <>
            <div className="chat-right-header" id="chat">
              <button
                className="btn-white-circle d-block d-md-none"
                onClick={() => this.props.closeChatRight()}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className="pic ms-3">
                <img
                  src={
                    this.state.currentUser.profile_image
                      ? this.state.currentUser.profile_image
                      : "/image/errorprofileimg.webp"
                  }
                  onError={(e) =>
                    (e.target.src = "/image/errorprofileimg.webp")
                  }
                  alt={this.state.currentUser.name}
                />
              </div>
              <div className=" ms-3 ">
                <div className="name mb-1">{this.state.currentUser.name}</div>
                <div
                  className={
                    this.props.currentUserStatus ? "online " : "offline  "
                  }
                >
                  {this.props.currentUserStatus ? "Online" : "Offline"}
                </div>
              </div>
              {/* <i className="fas fa-search ms-auto"></i>
									<i className="fas fa-ellipsis-vertical ms-4 me-3"></i> */}
            </div>
            <ScrollArea
              speed={0.9}
              className="chat-right-scroll"
              horizontal={false}
              verticalScrollbarStyle={{
                background: "transparent",
                width: "0px",
              }}
              ref={this.scrollRef}
              onScroll={(value) => this.scrollTop(value)}
            >
              <div className="chat-right-body" id="chat-body">
                {this.props.messages.map((message, index) => {    
                  let value;          
                  if (message.message_type === "FILE") {
                    value = this.convertToURL(index, message.message);
                  }
                  //chat.status&
                  if (
                    message.message_type === "chat.status" ||
                    message.message_type === "chat.acknowledgement"
                  ) {
                    return null;
                  } else {
                    return (
                      <span
                        className={`message-boxes ${
                          message?._self ? "home" : null
                        }`}
                        key={index}
                      >
                        {message.message_type === "TXT" ||
                        message.message_type === "text"
                          ? message.message
                          : message.message_type === "image" && (
                              <img
                                className="chat_image"
                                src={message.message}
                                alt="file"
                                onClick={() => this.showImage(message.message)}
                              />
                            )}
                        <div className="time">
                          {moment
                            .utc(message.created_at)
                            .local()
                            .startOf("seconds")
                            .fromNow()}
                        </div>
                        {/* {message.created_at} */}
                      </span>
                    );
                  }
                })}
              </div>
            </ScrollArea>
            <div className="chat-right-footer">
              <label className="images_file" htmlFor="upload_image">
                <i class="far fa-image"></i>
              </label>
              <input
                type="file"
                id="upload_image"
                hidden={true}
                onChange={(e) => this.selectImage(e)}
                accept=".png, .jpg, .jpeg"
              />
              <textarea
                className="spans ms-3"
                type="text"
                placeholder={"type message..."}
                value={this.state.message}
                onChange={(e) => this.setState({ message: e.target.value })}
              ></textarea>
              <div className="image_split">             
                <button
                  className="planes"
                  value={"Send"}
                  onClick={() => {
                    if (this.state.message.replace(/\s+/g, "").length == 0) {
                      alert("Please enter message");
                    } else {                      
                      this.props.sendMessage({
                        message: this.state.message,
                        message_type: "TXT",
                      });
                      this.setState({ message: "" });
                    }                  
                  }}
                >
                  <i className="fas fa-paper-plane-top"></i>
                </button>
              </div>
            </div>
          </>
        ) : (
          <img
            src="/image/start_chat.png"
            className="no-chat img-fluid"
            alt="No Chat"
          />
        )}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.showchatimg}
          onHide={() => this.PreviewModalClose}
        >
          <Modal.Header>
            <i
              class="fa-regular fa-circle-xmark  ms-auto"
              onClick={() => this.setState({ showchatimg: false })}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <div className="">
              <center className="mt-3 mb-3">
                <div className="chat_preview">
                  <img
                    src={this.state.chatimage ? this.state.chatimage : null}
                    className="img-fluid"
                    id="img_preview"
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image/errorlogoadmin.png";
                    }}
                  />
                </div>
              </center>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.showPreview}
          onHide={() => this.PreviewModalClose}
        >
          <Modal.Header>
            <i
              class="fa-regular fa-circle-xmark  ms-auto"
              onClick={this.PreviewModalClose}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <div className="">
              <center className="mt-3 mb-3">
                <div className="chat_preview">
                  <img
                    src=""
                    className="img-fluid"
                    id="img_preview"
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image/errorlogoadmin.png";
                    }}
                  />
                </div>
              </center>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="w-100 d-flex flex-row justify-content-center mb-4">
              <button
                className="btn-blue mx-auto"
                value={"Send"}
                onClick={this.sendImage}
              >
                Send
              </button>
            </div>
          </Modal.Footer>
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
              <center className="mt-3 mb-3">
                <h2>{this.state.errormessage}</h2>
              </center>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={() => this.setState({ show: false })}
              className="btn-blue mx-auto mt-5 mb-5 w-50"
            >
              Ok
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default ChatRight;

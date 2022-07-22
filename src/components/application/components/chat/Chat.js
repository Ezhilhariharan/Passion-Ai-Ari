import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Header from "../../../navbar/header/Header";
import Sidenavbar from "../../../navbar/sidenavbar/Sidenavbar";
import instance from "services/Instance";
import ChatLeft from "./components/chatleft/ChatLeft";
import ChatRight from "./components/chatright/ChatRight";
import axios from "axios";
import { getUserRoom, getUserChatData } from "./api/GET";
import { postAPI } from "./api/POST";
import "./styles/Chat.scss";
let user_token, socket;
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      currentUserChatLoader: {},
      currentChatMessages: [],
      room_id: "",
      page: 1,
      lock: false,
      currentUserstatus: false,
    };
    user_token = localStorage.getItem("passion_token");
    this.chatAPI = new postAPI();
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.createChatWithUser = this.createChatWithUser.bind(this);
    this.loadSocket = this.loadSocket.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.loadUserChatMessages = this.loadUserChatMessages.bind(this);
    this.openChatRight = this.openChatRight.bind(this);
    this.closeChatRight = this.closeChatRight.bind(this);
    this.scrollLoader = this.scrollLoader.bind(this);
    this.chatRightRef = React.createRef();
    this.chatLeft = React.createRef();
    this.showLoading = this.showLoading.bind(this);
    this.loadOldChatsInChild = this.loadOldChatsInChild.bind(this);
  }
  componentDidMount() {
    getUserRoom()
      .then((res) => {
        this.setState({ room_id: res.data.id }, () => {
          this.loadOldChatsInChild();
          this.loadSocket();
        });      
      })    
  }
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  loadSocket() {
    let host = instance.defaults.baseURL.split("/")[2];  
    let socket_url = `wss://${host}/ws/global/${this.state.room_id}/?access_token=${user_token}`;
    socket = new WebSocket(socket_url);
    socket.onopen = () => {
      console.info("connected");    
    };
    socket.onmessage = (event) => {
      let data = JSON.parse(event.data);
      console.log("data socket >> ",data)
      if (this.state.currentUser.room_id === data.room) {
        let messages = this.state.currentChatMessages;     
        if (data.hasOwnProperty("message")) {
          messages.unshift(data);
          this.setState({ currentChatMessages: messages });
        }
        if (data.message_type == "chat.status") {
          this.setState({ currentUserstatus: true });
          socket.send(
            JSON.stringify({
              payload: {
                message: "online",
                message_type: "chat.acknowledgement",
              },
              room: this.state.currentUser.room_id,
              command: "send",
            })
          );
        }
      }
      this.loadOldChatsInChild();
    };
    socket.onclose = (e) => {
      // console.info("disconnected", e);   
      socket.close()
    };
  }
  loadOldChatsInChild() {
    if (this.chatLeft.current != null) {
      this.chatLeft.current.loadOldChatUsers();
    } 
  }
  sendMessage(message) {   
    try {
      socket.send(
        JSON.stringify({
          payload: {
            message: message.message,
            message_type: message.message_type,
          },
          room: this.state.currentUser.room_id,
          command: "send",
        })
      );
    } catch (err) {
      console.error(err);
    }
    let messages = this.state.currentChatMessages;
    messages.unshift({
      message: message.message,
      message_type: message.message_type,
      _self: true,
    });
    this.setState({ currentChatMessages: messages });
    this.chatLeft.current.loadOldChatUsers();
  }
  setCurrentUser(user) {
    if (user.is_online) {
      this.setState({ currentUserstatus: true });
    } else {
      this.setState({ currentUserstatus: false });
    }
    this.setState({
      currentUser: user,
    });
    // 
    this.chatRightRef.current.setChatLayout();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentUser !== this.state.currentUser &&
      Object.keys(this.state.currentUser).length > 0
    ) {
      this.setState({
        currentUserChatLoader: {},
        currentChatMessages: [],
        page: 1,
      });
      this.loadUserChatMessages();
      this.openChatRight();
    }
    if (Object.keys(this.state.currentUser).length > 0) {
      this.scrollLoader();
    }
  }
  openChatRight() {
    let left = document.getElementsByClassName("chat-left")[0].classList;
    let right = document.getElementsByClassName("chat-right")[0].classList;
    left.add("d-none");
    left.add("d-md-block");
    right.remove("d-none");
    right.remove("d-md-block");
  }
  closeChatRight() {
    let left = document.getElementsByClassName("chat-left")[0].classList;
    let right = document.getElementsByClassName("chat-right")[0].classList;
    left.remove("d-none");
    left.remove("d-md-block");
    right.add("d-none");
    right.add("d-md-block");
    this.setState({
      currentUser: {},
      currentUserChatLoader: {},
      currentChatMessages: [],
      page: 1,
    });
  }
  loadUserChatMessages(page_num) {
    getUserChatData(this.state.currentUser.room_id, page_num)
      .then((res) => {
        this.setState({ currentUserChatLoader: res.data });
        let messages = this.state.currentChatMessages;
        messages.push(...res.data.results);
        this.setState({ currentChatMessages: messages });
      })  
  }
  createChatWithUser(user) {
    this.chatAPI
      .newChat(this.state.currentUser.room_id, user)
      .then((res) => {
        this.setState({ currentUser: res.data.data });
      })   
  }
  scrollLoader() {
    let scroller = document.getElementsByClassName("chat-right-body")[0];
    scroller.addEventListener("scroll", () => {
      if (
        Math.abs(scroller.scrollTop) >
        (scroller.scrollHeight - scroller.clientHeight) * 0.99
      ) {
        // 
        if (
          !this.state.lock &&
          this.state.currentUserChatLoader?.next !== null
        ) {
          this.setState({ lock: true }, () => {
            this.setState({ page: this.state.page + 1 }, () => {
              getUserChatData(this.state.currentUser.room_id, this.state.page)
                .then((res) => {
                  let messages = this.state.currentChatMessages;
                  messages.push(...res.data.data.results);
                  this.setState({ currentUserChatLoader: res.data.data });
                  this.setState({ currentChatMessages: messages });
                  this.setState({ lock: false });
                })               
            });
          });
        }
      }
    });
  }
  closeChart = () => {
    socket.onclose()
  }
  componentWillUnmount(){
    socket.onclose()
  }
  render() {    
    return (
      <div className="chat-layout">
        <Sidenavbar />
        <div className="studenthomepage-header d-flex flex-row">
          <Header closeChart={this.closeChart}/>
        </div>
        <div className="chat-layout-body">
          <ChatLeft
            ref={this.chatLeft}
            room_id={this.state.room_id}
            setCurrentUser={this.setCurrentUser}
            createChatWithUser={this.createChatWithUser}
          />       
          <ChatRight
            closeChatRight={this.closeChatRight}
            currentUser={this.state.currentUser}
            currentUserStatus={this.state.currentUserstatus}
            ref={this.chatRightRef}
            messages={this.state.currentChatMessages}
            UserChatLoader={this.state.currentUserChatLoader}
            sendMessage={this.sendMessage}
            Loading={this.showLoading}
            loadMoreUserChatMessages={this.loadUserChatMessages}
          />
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
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Chat));
// export default withRouter(Chat);

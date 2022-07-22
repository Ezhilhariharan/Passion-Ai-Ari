import React, { Component } from "react";
import ChatCard from "./components/chatcard/ChatCard";
import NoChat from "../../../../../../assets/no-chat.svg";
import {
  getUserChats,
  getavailableChats,
  getUserRoom,
} from "../../api/GET";
import "./styles/chatleft.scss";
let chatusers;
class ChatLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatUsers: {},
      openedAllChatMenu: false,
      allUsers: [],
      room_id: "",
      available_chat: [],
      defaultChatList: [],
      userType: "",
      currentUserObject: {},
    };
    this.toggleAllChatMenu = this.toggleAllChatMenu.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.loadOldChatUsers = this.loadOldChatUsers.bind(this);
    this.availableChats = this.availableChats.bind(this);
    this.onChange = this.onChange.bind(this);
    // this.forwardRef = React.forwardRef()
  }
  componentDidMount() {
    let user_type = localStorage.getItem("passion_usertype");
    // 
    getUserRoom()
      .then((res) => {        
        this.setState({ room_id: res.data.id }, () => {
          this.availableChats();
        });
      })  
    this.setState({ userType: user_type });
  }
  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     !prevState.openedAllChatMenu &&
  //     this.state.openedAllChatMenu &&
  //     this.state.allUsers.length == 0
  //   ) {
  //     // getUsersForChat(this.state.room_id).then(res => {
  //     // 	this.setState({ allUsers: res.data.data })
  //     // }).catch(err => 
  //   }
  //   // if (prevProps.room_id !== this.props.room_id) {
  //   // 	this.setState({ room_id: this.props.room_id })
  //   // }
  // }
  availableChats() {    
    getavailableChats(this.state.room_id)
      .then((res) => {     
        this.setState({ available_chat: res.data });
      })
    this.loadOldChatUsers();
  }
  loadOldChatUsers() {
    console.log("id",this.state.room_id,)
    getUserChats(this.state.room_id)
      .then((res) => {
        console.log("res",res)
        if (res.status) {
          chatusers = res.data;
          let availableChat = this.state.available_chat;
          // 
          chatusers.reverse().map((data) => {
            // 
            let commonChat = availableChat.find(
              (item) => item.uuid === data.user_id
            );
            if (commonChat) {
              // 
              commonChat = {
                ...commonChat,
                last_message_time: data.last_message_time,
                last_message: data.last_message,
                is_online: data.is_online,
                last_message_type: data.last_message_type,
              };
              availableChat = availableChat.filter(
                (item) => item.uuid !== data.user_id
              );
              availableChat.unshift(commonChat);
            }
          });
          this.setState({
            // : available_chat,
            available_chat: availableChat,
            defaultChatList: availableChat,
          });
          availableChat.map((item) => {
            if (item.room_id !== null) {
              if (item.room_id == this.state.currentUserObject.room_id) {
                this.setCurrentUser(item);
              }
            }
          });
          // this.setState({ chatUsers: res.data.data })
        }
      })     
  }
  toggleAllChatMenu() {
    this.setState({
      openedAllChatMenu: !this.state.openedAllChatMenu,
    });
  }
  setCurrentUser(data) {
    this.setState({ openedAllChatMenu: false, currentUserObject: data });
    this.props.setCurrentUser(data);
  }
  onChange(e) {
    this.setState({
      available_chat: this.state.defaultChatList.filter((item) => {
        return item.name.toLowerCase().includes(e.target.value.toLowerCase());
      }),
    });
  }
  render() {
    return (
      <div className="chat-left">
        {/* {
					!this.state.openedAllChatMenu ? */}
        {this.state.room_id != "" ? (
          <>
            <div className="chat-left-header">
              <span>Chat</span>
              {this.state.userType == 6 ? null : (
                <div className="form-group my-auto d-flex flex-row ms-auto">
                  <input
                    type="text"
                    className="input"
                    onChange={(e) => this.onChange(e)}
                    placeholder="Search"
                  />
                  <i class="fa-light fa-magnifying-glass mt-2"></i>
                </div>
              )}
              {/* <div className='d-flex flex-row align-items-center'>
								Add new
								<button
									className='btn-white ms-3'
									onClick={this.toggleAllChatMenu}
								>
									<i className="fas fa-plus"></i>
								</button>
							</div> */}
            </div>
            {/* :
						<div className="chat-left-header">
							<span>New Chat</span>
							<div className='d-flex flex-row align-items-center'>
								<button
									className='btn-white ms-3'
									onClick={this.toggleAllChatMenu}
								>
									<i className="fas fa-times"></i>
								</button>
							</div>
						</div> */}
            {/* } */}
            <div className="chat-left-body">
              {
                // !this.state.openedAllChatMenu ?
                Object.keys(this.state.available_chat).length != 0
                  ? this.state.available_chat.map((user, index) => {
                      if (user.room_id !== this.state.room_id) {
                        return (
                          <ChatCard
                            data={user}
                            key={index}
                            setCurrentUser={this.props.setCurrentUser}
                          />
                        );
                      }
                    })
                  : null
              }
              {/* // 		:
								// 		Object.keys(this.state.allUsers).length != 0 ?
								// 			this.state.allUsers.map((user, index) => {
								// 				return <NewChatCard
								// 					data={user}
								// 					key={index}
								// 					setCurrentUser={this.setCurrentUser}
								// 					createChatWithUser={this.props.createChatWithUser}
								// 				/>
								// 			})
								// 			: null
								// } */}
              {this.state.userType == 6 && (
                <div className="d-flex flex-row justify-content-center">
                  <img src={NoChat} className="chat-left-img" alt="Chat" />
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    );
  }
}
export default ChatLeft;

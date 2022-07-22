import React, { Component } from "react";
import Header from "../../../navbar/header/Header";
import "../../components/feeds/style/Feedslayout.scss";
import Feed from "../../../../components/common_Components/feeds/Feed";
import { adminFeed } from "./api/Get";
import { connect } from "react-redux";
import CreateModal from "./feedsmodal/CreateFeed";
import EditModal from "./feedsmodal/EditFeed";
import { feedsText } from "./Const_feedsadmin";
import FlatList from "flatlist-react";
import axios from "axios";
class Feedslayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
      studentFeed: [],
      mentorFeed: [],
      communityFeed: [],
      collegeData: {},
      metavalues: "",
      showmetadata: false,
      getid: "",
      editpost: "",
      publicandprivate: true,
      url_preview: false,
      postpic: "",
      industryList: [],
      feedindustry_id: 1,
      currentIndustryID: "",
      industrylist: [],
      descriptionTouch: false,
      descriptionValue: "",
      titleValue: "",
      titleTouch: false,
      descriptionError: false,
      titleError: false,
      showCreatefeed: false,
      studentFeedPage: 1,
      StudenthasMoreItems: true,
      mentorFeedPage: 1,
      mentorhasMoreItems: true,
      communityhasMoreItems: true,
      communityFeedPage: 1,
    };
    this.adminFeed = new adminFeed();
    this.modalRef = React.createRef();
    this.editModalRef = React.createRef();
    this.feedid = this.feedid.bind(this);
    this.fetchfeedsdata = this.fetchfeedsdata.bind(this);
    this.showLoading = this.showLoading.bind(this);
    this.getquestionlist = this.getquestionlist.bind(this);
    this.refreshfeedsdata = this.refreshfeedsdata.bind(this);
  }
  componentDidMount() {
    if (typeof axios.defaults.headers.common["Authorization"] === "undefined") {
      axios.defaults.headers.common["Authorization"] =
        "Token " + localStorage.getItem("passion_token");
    }
    // this.fetchfeedsdata();
    this.industryList();
    this.refreshfeedsdata()
  }
  industryList = () => {
    let getIndustryList = [{ value: "", label: "GlobalFeed" }];
    let getfeedIndustryList = [{ value: "", label: "Industry List" }];
    this.adminFeed
      .getIndustryList()
      .then((res) => {
        if (res.status) {
          for (let i of res.data) {
            getIndustryList.push({ value: i.id, label: i.name });
            getfeedIndustryList.push({ value: i.id, label: i.name });
          }
          this.setState({ industryList: getIndustryList });
          this.setState({ industrylist: getfeedIndustryList });
        } else {
          this.setState({ industrylist: [] });
        }
      })
  };
  fetchfeedsdata() {
    console.log("fetchfeedsdata")
    this.adminFeed
      .getInitialStudentFeed(1, this.state.currentIndustryID)
      .then((data) => {
        if (data.status) {
          this.setState({ studentFeed: data.data.results });
        } else {
          this.setState({ studentFeed: [] });
        }
      });
    this.adminFeed
      .getInitialMentorFeed(1, this.state.currentIndustryID)
      .then((data) => {
        if (data.status) {
          this.setState({ mentorFeed: data.data.results });
        } else {
          this.setState({ mentorFeed: [] });
        }
      });
    this.adminFeed
      .getInitialCommunityFeed(1, this.state.currentIndustryID)
      .then((data) => {
        if (data.status) {
          this.setState({ communityFeed: data.data.results });
        } else {
          this.setState({ communityFeed: [] });
        }
      });
  }
  deleteFeed = (id) => {
    let List;
    if (this.state.active == 1) {
      let FeedList = this.state.studentFeed;
      FeedList.forEach((item, index) => {
        if (item.id === id) {
          List = FeedList.filter((element) => element !== item);
        }
      });
      this.setState({ studentFeed: List });
    } else if (this.state.active == 2) {
      let FeedList = this.state.mentorFeed;
      FeedList.forEach((item, index) => {
        if (item.id === id) {
          List = FeedList.filter((element) => element !== item);
        }
      });
      this.setState({ mentorFeed: List });
    } else {
      let FeedList = this.state.communityFeed;
      FeedList.forEach((item, index) => {
        if (item.id === id) {
          List = FeedList.filter((element) => element !== item);
        }
      });
      this.setState({ communityFeed: List });
    }
  };
  deleteToaste = () => {
    this.props.showtoast({
      text: "Feed Successfully Deleted",
      time: new Date().getTime(),
    });
  };
  updateLike = (value, id) => {
    if (this.state.active === 1) {
      let FeedList = this.state.studentFeed;
      FeedList.forEach((item, index) => {
        if (item.id === id) {
          console.log("feeed", item)
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
      this.setState({ studentFeed: FeedList });
    } else if (this.state.active === 2) {
      let FeedList = this.state.mentorFeed;
      FeedList.forEach((item, index) => {
        if (item.id === id) {
          console.log("feeed", item)
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
      this.setState({ mentorFeed: FeedList });
    } else {
      let FeedList = this.state.communityFeed;
      FeedList.forEach((item, index) => {
        if (item.id === id) {
          console.log("feeed", item)
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
      this.setState({ communityFeed: FeedList });
    }
  };
  updateComment = (value, id) => {
    console.log(value, id)
    if (this.state.active === 1) {
      let FeedList = this.state.studentFeed;
      FeedList.forEach((item, index) => {
        if (item.id === id) {
          if (value == "add") {
            item.commentcount = item.commentcount + 1;
          } else {
            if (item.commentcount == 0) {
              item.commentcount = item.commentcount;
            } else {
              item.commentcount = item.commentcount - 1;
            }
          }
        }
      });
      this.setState({ studentFeed: FeedList });
    } else if (this.state.active === 2) {
      let FeedList = this.state.mentorFeed;
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
      this.setState({ mentorFeed: FeedList });
    } else {
      let FeedList = this.state.communityFeed;
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
      this.setState({ communityFeed: FeedList });
    }
  }
  refreshfeedsdata(){
    console.log("refreshfeedsdata")
    // if (this.state.active === 1) {
    this.adminFeed
      .getStudentFeed(
        this.state.studentFeedPage,
        this.state.currentIndustryID
      )
      .then((data) => {
        if (data.status) {
          if (data.hasOwnProperty("data")) {
            if (
              data.data.hasOwnProperty("next") &&
              this.state.StudenthasMoreItems
            ) {
              let Studentpagenumber;
              if (data.data.next != null) {
                let pagenumber = data.data.next.split("=")[1];
                Studentpagenumber = pagenumber.split("&")[0];
              } else {
                Studentpagenumber = this.state.studentFeedPage + 1;
                console.log("null")
              }
              if (this.state.studentFeedPage < Studentpagenumber) {
                console.log("null-in")
                this.setState((prevState) => ({
                  studentFeed: [
                    ...prevState.studentFeed,
                    ...data.data.results,
                  ],
                }));
                if (data.data.next != null) {
                  this.setState({
                    studentFeedPage: this.state.studentFeedPage + 1,
                  });
                } else {
                  this.setState({ StudenthasMoreItems: false });
                }
              }
            }
          }
        } else {
          this.setState({ studentFeed: [] });
        }
      });
    // } else if (this.state.active === 2) {
    this.adminFeed
      .getMentorFeed(this.state.mentorFeedPage, this.state.currentIndustryID)
      .then((data) => {
        if (data.status) {
          if (data.hasOwnProperty("data")) {
            if (
              data.data.hasOwnProperty("next") &&
              this.state.mentorhasMoreItems
            ) {
              let mentorpagenumber;
              if (data.data.next != null) {
                let pagenumber = data.data.next.split("=")[1];
                mentorpagenumber = pagenumber.split("&")[0];
              } else {
                mentorpagenumber = this.state.mentorFeedPage + 1;
                console.log("null")
              }
              if (this.state.mentorFeedPage < mentorpagenumber) {
                console.log("null-in")
                this.setState((prevState) => ({
                  mentorFeed: [...prevState.mentorFeed, ...data.data.results],
                }));
                if (data.data.next != null) {
                  this.setState({
                    mentorFeedPage: this.state.mentorFeedPage + 1,
                  });
                } else {
                  this.setState({ mentorhasMoreItems: false });
                }
              }
            }
          }
        } else {
          this.setState({ mentorFeed: [] });
        }
      });
    // } else {
    this.adminFeed
      .getCommunityFeed(
        this.state.communityFeedPage,
        this.state.currentIndustryID
      )
      .then((data) => {
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
                console.log("null")
              }
              if (this.state.communityFeedPage < communitypagenumber) {
                console.log("null-in")
                this.setState((prevState) => ({
                  communityFeed: [
                    ...prevState.communityFeed,
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
          this.setState({ communityFeed: [] });
        }
      });
    // }
  };
  getquestionlist(event) {
    if (event.target.value == "") {
      this.setState(
        {
          currentIndustryID: event.target.value,
          communityFeedPage: 1,
          mentorFeedPage: 1,
          studentFeedPage: 1,
          studentFeed: [],
          mentorFeed: [],
          communityFeed: [],
        },
        () => this.fetchfeedsdata()
      );
    } else {
      this.setState(
        {
          currentIndustryID: event.target.value,
          communityFeedPage: 1,
          mentorFeedPage: 1,
          studentFeedPage: 1,
          studentFeed: [],
          mentorFeed: [],
          communityFeed: [],
        },
        () => this.fetchfeedsdata()
      );
    }
  }
  feedid(id) {
    if (this.state.active === 1) {
      this.state.studentFeed.forEach((item, index) => {
        if (item.id === id) {
          this.setState({ editpost: item });
        }
      });
    } else if (this.state.active === 2) {
      this.state.mentorFeed.forEach((item, index) => {
        if (item.id === id) {
          this.setState({ editpost: item });
        }
      });
    } else {
      this.state.communityFeed.forEach((item, index) => {
        if (item.id === id) {
          // 
          this.setState({ editpost: item });
        }
      });
    }
    this.openEditFeed();
  }
  Openpicture() {
    this.showpicture.current.click();
  }
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  fileChangedHandler = (event) => {
    const file = event.target.files[0];
    this.setState({ postpic: file });
    if (file) {
      let reader = new FileReader();
      reader.onload = function () {
        document.getElementById("profile_preview").src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };
  updateIndustryFeed = (industry) => {
    this.setState({ active: this.state.active });
    if (industry == "") {
      this.setState(
        {
          currentIndustryID: industry,
          communityFeedPage: 1,
          mentorFeedPage: 1,
          studentFeedPage: 1,
          studentFeed: [],
          mentorFeed: [],
          communityFeed: [],
        },
        () => this.fetchfeedsdata()
      );
    } else {
      this.setState(
        {
          currentIndustryID: industry,
          communityFeedPage: 1,
          mentorFeedPage: 1,
          studentFeedPage: 1,
          studentFeed: [],
          mentorFeed: [],
          communityFeed: [],
        },
        () => this.fetchfeedsdata()
      );
    }
  };
  getSearchValue = (value) => {
    this.setState({ searchValue: value });
  };
  closeFeed = (value) => {
    this.setState({ showCreatefeed: value });
  };
  closeEditFeed = (value) => {
    this.setState({ showEditfeed: value });
  };
  openFeed = () => {
    this.setState({ showCreatefeed: true }, () => {
      this.modalRef.current.openmodal();
    });
  };
  openEditFeed = () => {
    this.setState({ showEditfeed: true }, () => {
      this.editModalRef.current.openmodal(this.state.editpost);
    });
  };
  render() {
    return (
      <div className="Feedslayout d-flex flex-row justify-content-center">
        <div>
          <div className="studenthomepage-header d-flex flex-row">
            <Header searchValue={this.getSearchValue} />
          </div>
          <div className="feed-area">
            <div className="toggle-wrapper d-flex flex-row w-100">
              <div className="feeds-toggle d-flex flex-row">
                <button
                  className={this.state.active === 1 ? "btn-toggle" : ""}
                  onClick={() => this.setState({ active: 1 })}
                >
                  {feedsText.student}
                </button>
                <button
                  className={this.state.active === 2 ? "btn-toggle" : ""}
                  onClick={() => this.setState({ active: 2 })}
                >
                  {feedsText.mentor}
                </button>
                <button
                  className={this.state.active === 3 ? "btn-toggle" : ""}
                  onClick={() => this.setState({ active: 3 })}
                >
                  {feedsText.community}
                </button>
              </div>
              <div className="customFormAdmin   ms-5">
                <div className="form-group ">
                  <select
                    className="custom-select-1"
                    onChange={this.getquestionlist}
                  >
                    {this.state.industryList.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                className="add-icon  ms-auto mt-1"
                onClick={() => this.openFeed()}
              >
                <i class="fa-solid fa-plus "></i>
              </div>
            </div>
            {this.state.active === 1 && (
              <>
                {this.state.studentFeed.length !== 0 ? (
                  <div className="area  ">
                    <FlatList
                      list={this.state.studentFeed}
                      renderItem={(data) => (
                        <Feed
                          Localfeeddata={data}
                          updateLike={this.updateLike}
                          updateComment={this.updateComment}
                          comments={this.state.comments}
                          refreshfeed={this.fetchfeedsdata}
                          DeleteFeed={this.deleteFeed}
                          FeedId={this.feedid}
                          alertToaste={this.deleteToaste}
                          loading={this.showLoading}
                        />
                      )}
                      hasMoreItems={this.state.StudenthasMoreItems}
                      loadMoreItems={this.refreshfeedsdata}
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
                )}{" "}
              </>
            )}
            {this.state.active === 2 && (
              <>
                {this.state.mentorFeed.length !== 0 ? (
                  <div className="area  ">
                    <FlatList
                      list={this.state.mentorFeed}
                      renderItem={(data) => (
                        <Feed
                          Localfeeddata={data}
                          updateLike={this.updateLike}
                          updateComment={this.updateComment}
                          comments={this.state.comments}
                          refreshfeed={this.fetchfeedsdata}
                          DeleteFeed={this.deleteFeed}
                          FeedId={this.feedid}
                          alertToaste={this.deleteToaste}
                          loading={this.showLoading}
                        />
                      )}
                      hasMoreItems={this.state.mentorhasMoreItems}
                      loadMoreItems={this.refreshfeedsdata}
                    />
                    {/* {this.state.mentorFeed.map((data) => (
                                            <Feed Localfeeddata={data} refreshfeed={this.updateIndustryFeed}
                                                currentIndustryID={this.state.currentIndustryID}
                                                comments={this.state.comments} FeedId={this.feedid} />
                                        ))} */}
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
            {this.state.active === 3 && (
              <>
                {this.state.communityFeed.length !== 0 ? (
                  <div className="area  ">
                    <FlatList
                      list={this.state.communityFeed}
                      renderItem={(data) => (
                        <Feed
                          Localfeeddata={data}
                          updateLike={this.updateLike}
                          updateComment={this.updateComment}
                          comments={this.state.comments}
                          refreshfeed={this.fetchfeedsdata}
                          DeleteFeed={this.deleteFeed}
                          FeedId={this.feedid}
                          alertToaste={this.deleteToaste}
                          loading={this.showLoading}
                        />
                      )}
                      hasMoreItems={this.state.communityhasMoreItems}
                      loadMoreItems={this.refreshfeedsdata}
                    />
                    {/* {this.state.communityFeed.map((data) => (
                                            <Feed Localfeeddata={data} refreshfeed={this.updateIndustryFeed}
                                                currentIndustryID={this.state.currentIndustryID}
                                                comments={this.state.comments} FeedId={this.feedid} />
                                        ))} */}
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
          {this.state.showCreatefeed ? (
            <CreateModal
              closefeed={this.closeFeed}
              loading={this.showLoading}
              user={this.props.user}
              theme={this.props.theme}
              industryList={this.state.industrylist}
              updateFeed={this.updateIndustryFeed}
              ref={this.modalRef}
            />
          ) : null}
          {this.state.showEditfeed ? (
            <EditModal
              closefeed={this.closeEditFeed}
              loading={this.showLoading}
              user={this.props.user}
              theme={this.props.theme}
              industryList={this.state.industrylist}
              updateFeed={this.updateIndustryFeed}
              ref={this.editModalRef}
            />
          ) : null}
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
    showtoast: (data) => {
      dispatch({ type: "ShowToast", value: data });
    },
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Feedslayout);

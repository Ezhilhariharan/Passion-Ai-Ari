import React, { useState, useEffect } from "react";
import "../../application/components/home/studenthome/styles/StudentHomePage.scss";
import { Formik, Form, Field } from "formik";
import jwt_decode from "jwt-decode";
import Feed_comment from "./Feeds_comment";
import { feedAPI } from "./api/Api";
import Deletemodal from "../popup/Deletemodal";
import { feedsText } from "./const/Const_Feeds";
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
function Feed(props) {
  let {
    Localfeeddata,
    FeedId,
    refreshfeed,
    alertToaste,
    loading,
    DeleteFeed,
    updateLike,
    updateComment
  } = props;
  let usertype = localStorage.getItem("passion_usertype");
  const [usertypestate, setUsertype] = useState(usertype);
  const [liked, setLiked] = useState(true);
  const [cmmntId, setCmmntId] = useState("");
  const [active, setCommentactive] = useState(true);  
  const [showViewMore, setShowViewMore] = useState(false);
  const [cmmnt, setShowcmmnt] = useState(false);
  const [commentCount, setCommentCount] = useState(5);
  const [feedCommentCount, setfeedCommentCount] = useState(0);
  const [feedLikeCount, setfeedLikeCount] = useState(0);  
  const [feedscomment, setFeedscomment] = useState([]);
  const [showdeletemodal, setshowDeletemodal] = useState(false);
  const [modalmessage, setModalmessage] = useState("");
  const [modalid, setModalid] = useState("");
  let API = new feedAPI();  
  let action_like;
  let passionuserid;
  let userid;
  const likecountplus = (value, id) => {
    // 
    setLiked(true);
    // refreshfeed();
    updateLike(value, id);
  };
  const likecountdec = (value, id) => {
    // 
    setLiked(false);
    // refreshfeed();
    updateLike(value, id);
  };
  const likecountplusadmin = (value, id) => {
    setLiked(true);
    // refreshfeed(currentIndustryID);//update for admin
    updateLike(value, id);
  };
  const likecountdecadmin = (value, id) => {
    setLiked(false);
    // refreshfeed(currentIndustryID);//update for admin
    updateLike(value, id);
  };
  useEffect(() => {
    setLiked(Localfeeddata.user_liked);
    userid = localStorage.getItem("passion_token");
    let decoded = jwt_decode(userid);
    passionuserid = decoded.user_id;
    // setUser_id(passionuserid);
    // setAfterInitailRefresh(false);
    // setCommentCountupdate(0);
    setfeedCommentCount(Localfeeddata.commentcount);
    setfeedLikeCount(Localfeeddata.likescount);
    // setCommentactive(false)
    // getComment(Localfeeddata.id)
    setCommentactive(true);
  }, [Localfeeddata.user_liked, Localfeeddata.id]);
  const likefunc = () => {
    if (usertype == 1) {
      if (liked === false) {
        let formData = new FormData();
        formData.append("feed", Localfeeddata.id);
        loading();
        API.adminLike(formData)
          .then(function (response) {
            loading();
            response.status && likecountplusadmin(true, Localfeeddata.id);
          })
      } else {
        loading();
        API.adminUnLike(Localfeeddata.id)
          .then(function (response) {
            loading();
            response.status && likecountdecadmin(false, Localfeeddata.id);
          })
      }
    } else {
      if (liked === false) {
        let formData = new FormData();
        formData.append("feed", Localfeeddata.id);
        // axios.post('users/feeds_like/', formData)
        loading();
        API.userLike(formData)
          .then(function (response) {
            loading();
            response.status && likecountplus(true, Localfeeddata.id);
          })
          .catch(function (error) {
          });
      } else {
        loading();
        // axios.delete(`users/feeds_like/${Localfeeddata.id}`,)
        API.userUnLike(Localfeeddata.id)
          .then((response) => {
            loading();
            response.status && likecountdec(false, Localfeeddata.id);
          })
          .catch((error) => {
          });
      }
    }
  };
  const adminComment = (id) => {
    API.getAdminFeedCmmnts(id)
      .then((data) => {       
        if (data.status) {
          setShowcmmnt(true);
          setFeedscomment(data.data);  
         setfeedCommentCount(data.data.length);
          if (data.data.length > 5) {
            setShowViewMore(true);
          }
          if (data.data.length) {
            setCmmntId(data.data[0].feed_id);           
          }
        } else {
          setShowcmmnt(false);
          setfeedCommentCount(0);
        }
      })
  };
  const userComment = (id) => {    
    API.getFeedCmmnts(id)
      .then((data) => {
        if (data.status) {
          setShowcmmnt(true);
          setFeedscomment(data.data);
          setfeedCommentCount(data.data.length);
          if (data.data.length > 5) {
            setShowViewMore(true);
          }
          if (data.data.length) {
            setCmmntId(data.data[0].feed_id);
          }
        } else {
          setShowcmmnt(false);
          setfeedCommentCount(0);
        }
      })
  };
  const getComment = (id) => {
    setCommentactive((v) => !v);
    setCommentCount(5);
    // 
    if (usertype == 1) {
      adminComment(id);
    } else {
      userComment(id);
    }
  };
  const deleteFeedmodal = (id) => {
    setshowDeletemodal(true);
    setModalmessage("Are you sure you want to delete this Post..?");
    setModalid(id);
  };
  const deleteFeed = (a, id, confirm) => {
    setshowDeletemodal(a);
    if (confirm === "yes") {
      if (usertype == 1) {
        API.adminDelete(id)
          .then(function (response) {
            if (response.status) {
              DeleteFeed(id);
              alertToaste();
            }
          })
          .catch(function (error) {
          });
      } else {
        API.userDelete(id)
          .then((response) => {
            if (response.status) {
              DeleteFeed(id);
              alertToaste();
            }
          })
          .catch(function (error) {
          });
      }
    }
  };
  const viewMore = () => {
    // 
    if (feedscomment.length >= commentCount + 5) {
      setCommentCount(commentCount + 5);
      // commentCount = feedscomment.length
    } else if (feedscomment.length >= commentCount) {
      setCommentCount(feedscomment.length);
      setShowViewMore(false);
    }
  };
  const updateCommentData = () => {
    // setAfterInitailRefresh(false);
  }; 
  return (
    <div className="feed mx-auto">
      <div className="feed-card pb-1">
        <div className="d-flex flex-row">
          <div className="feed-card-profile  d-flex flex-row w-100">
            <div className="feed-card-profile-img my-auto ms-4">
              <img
                src={Localfeeddata.profile_image}
                alt=""
                className="img-fit img-fluid w-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/image/errorprofileimg.webp";
                }}
              />
            </div>
            <h4 className="my-auto p-3">{Localfeeddata.owner_name}</h4>
            <div className="feed-time-ago">
              {moment
                .utc(Localfeeddata.updated_on)
                .local()
                .startOf("seconds")
                .fromNow()}
            </div>
          </div>
          {Localfeeddata.owner == true ? (
            <div className="dropdown-feed me-5 ">
              <i className="fa-solid  fa-ellipsis-vertical  mt-4 cursor-pointer"></i>
              <div className="dropdown-content ">
                <div
                  onClick={() => FeedId(Localfeeddata.id)}
                  className="content-active px-3 py-1"
                >
                  {feedsText.edit}
                </div>
                <div
                  className="content-active px-3 py-1"
                  onClick={() => deleteFeedmodal(Localfeeddata.id)}
                >
                  {feedsText.delete}
                </div>
              </div>
            </div>
          ) : usertypestate == 1 ? (
            <i
              class="fa-regular fa-trash-can  mt-5 cursor-pointer me-5"
              onClick={() => deleteFeedmodal(Localfeeddata.id)}
            ></i>
          ) : null}
        </div>
        <div className="feed-title ps-4 mt-2">{Localfeeddata.title}</div>
        <div className="feed-description ps-4 mt-2">
          <span>{Localfeeddata.description}</span>
        </div>
        {Localfeeddata.file === null ? null : (
          <div className="feed-img mt-3">
            <img src={Localfeeddata.file} alt="" className="img-fluid w-100" />
          </div>
        )}
        <div className="feed-icon d-flex flex-row ps-2 ps-lg-4 mt-1 mb-3">
          <div className="col-6 d-flex flex-row d-flex flex-row justify-content-center">
            <div className="d-flex flex-row ">
              <img
                src={liked ? "/image/like.png " : "/image/unlike.png "}
                alt=""
                className="img-fluid feed-like me-2 mt-3 "
                onClick={likefunc}
              />
              <div className={liked ? "like-color mt-3 " : "like mt-3"}>
                {feedLikeCount}
              </div>
              <div
                className={
                  liked
                    ? "ms-1 me-4 mt-3 like-color "
                    : "ms-1 me-2 me-lg-4 mt-3  like"
                }
                onClick={likefunc}
              >
                {feedsText.like}
              </div>
            </div>
          </div>
          <div className="col-6 d-flex flex-row justify-content-center">
            <div className="d-flex flex-row">
              <img
                src={
                  active ? "/image/comment.png" : "/image/commentactive.png "
                }
                alt=""
                className="img-fluid me-2 cmmnt-icon feed-like"
                onClick={() => getComment(Localfeeddata.id)}
              />
              <div className={active ? "like mt-3 " : "like-color mt-3 "}>
                {
                  // afterInitailRefresh
                  //     ? Localfeeddata.commentcount + commentCountupdate
                  //     :
                  feedCommentCount
                }
              </div>
              <div
                className={
                  active
                    ? "ms-1 me-4 mt-3 like"
                    : "ms-1 me-2 me-lg-4 mt-3 like-color"
                }
                onClick={() => getComment(Localfeeddata.id)}
              >
                {feedsText.comment}
              </div>
            </div>
          </div>
        </div>
        {/* afterInitailRefresh ? Localfeeddata.commentcount + 1 : Localfeeddata.commentcount  cmmntId === Localfeeddata.id && */}
        {active ? null : (
          <div className="mt-2 ">
            <div className="d-flex flex-row ">
              <Formik
                initialValues={{ post: "" }}
                onSubmit={(values, onSubmitProps) => {
                  onSubmitProps.resetForm();
                  let formData = new FormData();
                  formData.append("comment", values["post"]);
                  {
                    usertypestate == 6 &&
                      formData.append("college", Localfeeddata.college_id);
                  }
                  formData.append("feed", Localfeeddata.id);
                  if (usertype == 1) {                   
                    API.createAdminComment(formData)
                      .then((res) => {
                        if (res.status) {                         
                          updateComment("add",Localfeeddata.id);
                          adminComment(Localfeeddata.id);                      
                          onSubmitProps.resetForm();                   
                        }
                      })                     
                  } else {                   
                    API.createUserComment(formData)
                      .then((res) => {
                        if (res.status) {                         
                          updateComment("add",Localfeeddata.id);
                          userComment(Localfeeddata.id);                 
                          onSubmitProps.resetForm();
                        }
                      })                      
                  }
                }}
              >
                {({ handleSubmit }) => (
                  <Form
                    className="d-flex flex-row comment-section col-12  p-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  >
                    <div className="  mb-3 col-9">
                      <Field
                        id="post"
                        name="post"
                        as="textarea"
                        className="feed-input-comment my-auto center p-2 w-100"
                        placeholder="Add a Comment...."
                        maxlength="150"
                      />
                    </div>
                    <div className="mb-3 col-3 ps-2">
                      <button type="submit" className="btn-yellow center  w-75">
                        {feedsText.post}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            {cmmnt ? (
              <div>
                {cmmntId === Localfeeddata.id && (
                  <div>
                    {feedscomment.slice(0, commentCount).map((data, index) => (
                      <Feed_comment
                        feed_comment={data}
                        key={index}
                        refreshAdminCmmnt={adminComment}
                        refreshUserCmmnt={userComment}
                        commentCount={updateComment}
                        feedid={Localfeeddata.id}
                        refreshfeeds={refreshfeed}
                        commentdata={updateCommentData}
                      />
                    ))}
                  </div>
                )}
                {showViewMore && feedscomment.length > 5 ? (
                  <div className="viewmore mb-3" onClick={viewMore}>
                    {feedsText.viewmore}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>
      <Deletemodal
        value={showdeletemodal}
        message={modalmessage}
        id={modalid}
        deletefun={deleteFeed}
      />
    </div>
  );
}
export default Feed;

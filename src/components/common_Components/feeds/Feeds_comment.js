import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Deletemodal from "../popup/Deletemodal";
import { feedAPI } from "../../application/components/home/studenthome/api/Api";
import { feedsText } from "./const/Const_Feeds.js";
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
function Feeds_coment(props) {
  let {
    feed_comment,
    refreshAdminCmmnt,
    commentdata,
    refreshUserCmmnt,
    commentCount
  } = props;
  let usertype = localStorage.getItem("passion_usertype");
  // const [usertypestate, setUsertype] = useState(usertype);
  const [cmmntrply, setCmmntrply] = useState(false);
  const [liked, setLiked] = useState(true);
  // const [likescount, setLikescount] = useState(feed_comment.comment_likescount);
  const [showdeletemodal, setshowDeletemodal] = useState(false);
  const [modalmessage, setModalmessage] = useState("");
  const [modalid, setModalid] = useState("");
  const API = new feedAPI();
  // 
  useEffect(() => {
    setLiked(feed_comment.comment_id);
  }, [feed_comment.comment_id]);
  const commentreply = () => {
    setCmmntrply((v) => !v);
  };
  const likecountplus = () => {
    // setLikescount(feed_comment.comment_likescount + 1);
    setLiked(true);
    // 
  };
  const likecountdec = () => {
    // setLikescount(feed_comment.comment_likescount - 1);
    setLiked(false);
  };
  const likefunc = () => {
    if (liked === false) {
      let formData = new FormData();
      formData.append("comment", feed_comment.comment_id);
      axios
        .post("admin/manage_comments_like/", formData)
        .then(function (response) {
          response.status == 201 && likecountplus();
        })
        .catch(function (error) {
        });
    } else {
      axios
        .delete(`admin/manage_comments_like/${feed_comment.comment_id}`)
        .then(function (response) {
          response.status == 200 && likecountdec();
        })
        .catch(function (error) {
        });
    }
  };
  const deletefeedcmmntmodal = (id) => {
    setshowDeletemodal(true);
    setModalmessage("Are you sure you want to delete this Comment..?");
    setModalid(id);
  };
  const deleteFeedcmmnt = (a, id, confirm) => {
    setshowDeletemodal(a);
    if (confirm === "yes") {
      API.deleteFeedCmmnts(id)
        .then((data) => {        
          if (data.status) {
            // refreshfeeds();
            if (usertype == 1) {
              refreshAdminCmmnt(feed_comment.feed_id);
              commentCount("delete",feed_comment.feed_id)
            } else {
              refreshUserCmmnt(feed_comment.feed_id);
              commentCount("delete",feed_comment.feed_id)
            }
            commentdata();
          } else {
          }
        })
        .catch((err) => {
          //   this.setState({ comments: "" });
        });
    } else {
    }
  };
  // 
  return (
    <div className=" feeds-comment  mt-1 ">
      <div className="feeds-comment-section  d-flex flex-row mt-1 mb-4">
        <div className="feed-comment-profile-img my-auto ms-4 ">
          <img
            src={feed_comment.owner_image}
            alt=""
            className="img-fit img-fluid w-100"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/image/errorprofileimg.webp";
            }}
          />
        </div>
        <div className="show-comments ms-3 p-2">
          <h4 className="pt-3 ">{feed_comment.owner_name}</h4>
          <span>{feed_comment.comment}</span>
          <div className="feedcmmnt-time-ago">
            {moment
              .utc(feed_comment.created_on)
              .local()
              .startOf("seconds")
              .fromNow()}
          </div>
        </div>
        {feed_comment.is_owner ? (
          <i
            class="fa-regular fa-trash-can mx-auto my-auto"
            onClick={() => deletefeedcmmntmodal(feed_comment.id)}
          ></i>
        ) : null}
      </div>
      {/* <div className=" d-flex flex-row justify-content-end  mt-2 me-4">
                <i onClick={likefunc} className={liked ? "fa-solid fa-thumbs-up me-2" : "fa-regular fa-thumbs-up me-2"} >
                    <div className=" p">{likescount === -1 ? 0 : likescount}</div>  </i>
                <i className="fa-regular fa-message-lines me-2" onClick={() => commentreply(feed_comment.comment_id)}>{feed_comment.reply_count}</i>
            </div> */}
      {cmmntrply ? (
        <Formik
          initialValues={{ replycomment: "" }}
          onSubmit={(values) => {
            let formData = new FormData();
            formData.append("comment", values["replycomment"]);
            formData.append("college", feed_comment.college_id);
            formData.append("is_reply", "True");
            formData.append("parent_id", feed_comment.feed_id);
            formData.append("replied_to", feed_comment.comment_user_id);
            formData.append("feed", feed_comment.feed_id);
            axios
              .post("users/feeds_comment/", formData)
              .then((res) => {
              })
              .catch((err) => {
              });
          }}
          //  validationSchema={commentSchema}
        >
          <Form className=" mt-3 mb-5">
            <div className="d-flex flex-row mt-3 ">
              {/* <div className="field" htmlFor="number">post</div> */}
              <Field
                id="post"
                name="replycomment"
                as="textarea"
                className="input-comment  ms-5"
                placeholder="type here"
              />
              <ErrorMessage name="post">
                {(msg) => <div style={{ color: "black" }}>{msg}</div>}
              </ErrorMessage>
            </div>
            <div className="d-flex flex-row  ">
              <button type="submit" className="btn-blue ms-auto">
                {feedsText.post}
              </button>
            </div>
          </Form>
        </Formik>
      ) : null}
      <Deletemodal
        value={showdeletemodal}
        message={modalmessage}
        id={modalid}
        deletefun={deleteFeedcmmnt}
      />
    </div>
  );
}
export default Feeds_coment;

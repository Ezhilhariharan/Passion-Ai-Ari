import React, { useState, useEffect } from "react";
import ScrollArea from "react-scrollbar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { studentProfileText } from "../../../../admin/components/profile/components/studentProfile/Const_StudentProfile";
import * as Yup from "yup";
import { studentprofileAPI } from "./utils/Api";
import ErrorModal from "../../../../common_Components/popup/ErrorModalpoup";
const commentSchema = Yup.object().shape({
  post: Yup.string().required("Required"),
});
let API = new studentprofileAPI();
let commentsDATA;
function Profile_Educationaldetails(props) {
  const {
    alertToaste,
    getcomments,
    currentstage,
    usertype,
    showcomments,
    refreshApi,
    course_status,
    approved,
  } = props;
  let type = localStorage.getItem("passion_usertype");
  const [showfield, setShowfield] = useState(false);
  const [currentCommentId, setcurrentCommentId] = useState(0);
  const [commentData, setCommentData] = useState([]);
  const [Type, setType] = useState(type);
  const [errorModal, setErrormodal] = useState(false);
  const [errorMsg, SetErrorMsg] = useState("");
  if (getcomments) {
    commentsDATA = getcomments.filter(
      (element) => element.is_approved === true
    );
  }
  useEffect(() => {
    if (Type == 6) {
      setCommentData(commentsDATA);
    } else {
      setCommentData(getcomments);
    }
  }, [getcomments]);
  const approveApi = () => {
  console.log("approveApi",)
    let formData = new FormData();
    formData.append("student_id", getcomments[0]?.student_id);
    API.StudentApprovelPatch(formData)
      .then((res) => {
        console.log("approveApi",res)
        if (res.status) {          
          refreshApi();
          alertToaste();
        }
      })
      .catch((err) => {
      });
  };
  const editComment = (id) => {
    getcomments.forEach((item, index) => {
      if (item.question_id === id) {
        // let currentItem = Object.assign({}, item);
        setcurrentCommentId(item.question_id);
      }
    });
    setShowfield(true);
  };
  const closeErrorModal = () => {
    SetErrorMsg("")
    setErrormodal(true)
  };
  return (
    <div className=" mt-1">
      {currentstage === 3 ? (
        <>
          {course_status === "completed" && approved ? (
            showcomments && (
              <ScrollArea
                speed={0.5}
                className="scroll-comment"
                horizontal={false}
                verticalScrollbarStyle={{
                  background: "transparent",
                  width: "0px",
                }}
                smoothScrolling={true}
              >
                {commentData.map((data, index) => (
                  <div className="questionandanswer p-4" key={index}>
                    <div className="question d-flex flex-row ">
                      <div className="serial-num">{index + 1}</div>
                      <div className="question-type my-auto ps-4">
                        {data.question} ?
                      </div>
                    </div>
                    {usertype == 6 || usertype == 5 ? (
                      <>
                        {currentCommentId === data.question_id ? (
                          showfield ? (
                            data.answer ? ( //update
                              <Formik
                                initialValues={{
                                  post: data.answer,
                                }}
                                enableReinitialize={true}
                                onSubmit={(values) => {
                                  let formData = new FormData();
                                  formData.append("answer", values.post);
                                  API.PatchMethod_StudentConfigureReport(
                                    data.answer_id,
                                    formData
                                  ).then((res) => {
                                    if (res.status) {
                                      refreshApi();
                                      setShowfield(false);
                                    }else{                                     
                                      if (res.message) {
                                        if (typeof res.message === "object") {
                                          let value = Object.values(res.message);
                                          SetErrorMsg(value[0])
                                          setErrormodal(true)
                                        } else {
                                          SetErrorMsg(res.message)
                                          setErrormodal(true)
                                        }
                                      } else {
                                        SetErrorMsg("Something went Wrong")
                                          setErrormodal(true)
                                      }
                                    }
                                  });
                                }}
                                validationSchema={commentSchema}
                              >
                                <Form className="d-flex flex-row mt-4 w-100">
                                  <Field
                                    id="post"
                                    name="post"
                                    as="textarea"
                                    className="answer-mentor p-3"
                                    maxlength="250"
                                  />
                                  <ErrorMessage name="post">
                                    {(msg) => (
                                      <div
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        Required
                                      </div>
                                    )}
                                  </ErrorMessage>
                                  <button type="submit">
                                    <i class="fa-solid fa-floppy-disk "></i>
                                  </button>
                                  <span
                                    className="form-cancel my-auto"
                                    onClick={() => setShowfield(false)}
                                  >
                                    {studentProfileText.cancel}
                                  </span>
                                </Form>
                              </Formik>
                            ) : (
                              <Formik //create
                                initialValues={{
                                  post: data.answer,
                                }}
                                enableReinitialize={true}
                                onSubmit={(values) => {
                                  let formData = new FormData();
                                  formData.append("answer", values.post);
                                  formData.append("question", data.question_id);
                                  formData.append("student", data.student_id);
                                  API.PostMethod_Studentconfigure_report(
                                    formData
                                  )
                                    .then((res) => {
                                      if (res.status) {
                                        refreshApi();
                                        setShowfield(false);
                                      }else{
                                        if (res.message) {
                                          if (typeof res.message === "object") {
                                            let value = Object.values(res.message);
                                            SetErrorMsg(value[0])
                                            setErrormodal(true)
                                          } else {
                                            SetErrorMsg(res.message)
                                            setErrormodal(true)
                                          }
                                        } else {
                                          SetErrorMsg("Something went Wrong")
                                            setErrormodal(true)
                                        }
                                      }
                                    })
                                    .catch((err) => {
                                    });
                                }}
                                validationSchema={commentSchema}
                              >
                                <Form className="d-flex flex-row mt-4 w-100">
                                  <Field
                                    id="post"
                                    name="post"
                                    as="textarea"
                                    className="answer-mentor p-3"
                                    maxlength="250"
                                  />
                                  <ErrorMessage name="post">
                                    {(msg) => (
                                      <div
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        Required
                                      </div>
                                    )}
                                  </ErrorMessage>
                                  <button type="submit">
                                    <i class="fa-solid fa-floppy-disk "></i>
                                  </button>
                                  <span
                                    className="form-cancel my-auto"
                                    onClick={() => setShowfield(false)}
                                  >
                                    {studentProfileText.cancel}
                                  </span>
                                </Form>
                              </Formik>
                            )
                          ) : (
                            <div className="d-flex flex-row w-100">
                              <span className="answer mt-3 ms-4 ms-sm-5 ps-2 w-75">
                                {data.answer}
                              </span>
                              <i
                                class="fa-solid fa-pen-to-square ms-3 mt-4 w-25"
                                onClick={() => editComment(data.question_id)}
                              ></i>
                            </div>
                          )
                        ) : (                          
                          <div className="d-flex flex-row w-100">
                            <span className="answer mt-3 ms-4 ms-sm-5 ps-2 w-75">
                              {data.answer}
                            </span>
                            <i
                              class="fa-solid fa-pen-to-square ms-3 mt-4 w-25"
                              onClick={() => editComment(data.question_id)}
                            ></i>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="answer mt-3 ms-4 ms-sm-5 p-2 ">
                        {data.answer}
                      </span>
                    )}
                  </div>
                ))}
                {Type == "5" ? (
                  <div className="d-flex flex-row w-100 mb-5">
                    <button
                      type="submit"
                      className="btn-yellow mt-3  ms-auto me-4"
                      onClick={approveApi}
                    >
                      {studentProfileText.approve}
                    </button>
                  </div>
                ) : null}
              </ScrollArea>
            )
          ) : (
            <div className="atlaststage">
              <img src="/image/approval.png" alt="" className=" mt-5" />
              <p className="mt-5">{studentProfileText.waitingapproval}</p>
            </div>
          )}
        </>
      ) : (
        <div className="atlaststage">
          <img src="/image/atlaststage.png" alt="" className=" mt-5" />
          <p className="mt-5">{studentProfileText.content}</p>
        </div>
      )}
      <ErrorModal
            message={errorMsg}
            value={errorModal}
            closeModal={closeErrorModal}
          />
    </div>
  );
}
export default Profile_Educationaldetails;

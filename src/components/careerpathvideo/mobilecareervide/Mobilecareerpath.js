import React, { useEffect, useRef, useState } from "react";
import "./styles/Mobilecareerpath.scss";
import { withRouter } from "react-router";
import { Modal } from "bootstrap";
import { API } from "../api/Api";
import ReactPlayer from "react-player";
import Careerpathvideo from "../Careerpathvideo";
import Success from "../success/Success";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { carrerSelectionText } from "../const/Const_Carrerselection";
function Mobilecareerpath(props) {
  let api = new API();
  let history = useHistory();
  const dispatch = useDispatch();
  const [playstate, setPlaying] = useState(false);
  const pause = () => setPlaying(false);
  const [question, SetQuestion] = useState([]);
  const [videouri, SetVideoUri] = useState();
  const [showqn, SetShowQn] = useState({});
  const [show, setShow] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(false);
  const [successvideo, SetShowVideoSuccess] = useState(false);
  const [finalPopup, SetFinalPopup] = useState(false);
  const modalAlert = useRef();
  const modalRef = useRef();
  const modalNavigation = useRef();
  useEffect(() => {
    try {
      InitialMount();
    } catch (exception) {
    }
  }, []);
  const InitialMount = () => {
    api
      .getQuestion()
      .then((res) => {
        // 
        if (res.data.is_test_taken) {
          SetShowVideoSuccess(true);
          showNavigationModal();
        } else {
          SetVideoUri(res.data.video_link);
          let questionResponse = res.data.questions;
          let questionData = [];
          questionResponse.forEach((element) => {
            questionData.push({
              ...element,
              isAnswered: show,
              answer: "",
            });
          });
          SetQuestion(questionData);
        }
      })
      .catch((err) => {
      });
  };
  const play = () => {
    setPlaying(true);
    // SetShowVideoSuccess(true);
  };
  const videoProgres = (progress) => {
    try {
      let questionlist = question;
      for (let i = 0; i < questionlist.length; i++) {
        let ProgressSeconds = parseInt(progress.playedSeconds);
        let currentqn = questionlist[i];
        if (!currentqn.isAnswered) {
          if (
            currentqn.seconds === ProgressSeconds - 1 ||
            currentqn.seconds === ProgressSeconds ||
            currentqn.seconds === ProgressSeconds + 1
          ) {
            pause();
            let showquestions = currentqn;
            SetShowQn(showquestions);
            setQuestionNumber(i);
            showModal();
            questionlist[i].isAnswered = true;
            SetQuestion(questionlist);
          }
        }
      }
    } catch (exception) {
    }
  };
  const handleClose = (result, question_id) => {
    if (result != null) {
      let questionlist = question;
      questionlist.find((element) => {
        return element.question_id === question_id;
      }).answer = result;
      SetQuestion(questionlist);
    }
    hideModal();
    play();
  };
  const endVideo = () => {
    // SetShowVideoSuccess(true);
    SetFinalPopup(true);
  };
  const showModal = () => {
    const modalEle = modalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  const showAlertModal = () => {
    const modalEle = modalAlert.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  const hideAlertModal = () => {
    const modalEle = modalAlert.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
    SetShowQn({});
    setQuestionNumber(false);
    InitialMount();
    window.location.reload(false)
  };
  const showNavigationModal = () => {
    const modalEle = modalNavigation.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  const hideNavigationModal = () => {
    const modalEle = modalNavigation.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
    history.push("/selectindustry");
  };
  const submitAnswer = () => {
    console.clear();
    let ifAnswerTrue = question.filter((element) => element.answer == "no");
    let ifAnswerFalse = question.filter((element) => element.answer == "yes");
    if (ifAnswerTrue.length == question.length) {
      showAlertModal();
    }
    if (ifAnswerFalse.length == question.length) {
      showAlertModal();
    }
    if (ifAnswerTrue.length != question.length || ifAnswerFalse.length != question.length) {
      let formData = new FormData();
      formData.append("test_result", JSON.stringify(question));
      api.submitAnswer(formData).then((res) => {
        if (res.status) {
          if (res.hasOwnProperty("data")) {
            dispatch({ type: "Industry-Data", filterdata: res.data });
            history.push("/selectindustry");
          } else {
            dispatch({ type: "Industry-Data", filterdata: [] });
          }
        } else {
          dispatch({ type: "Industry-Data", filterdata: [] });
        }
      });
    }
  };
  return (
    <>
      <div className="career_video">
        {!successvideo ? <Careerpathvideo playvideo={play} /> : null}
        {finalPopup ? <Success submitsanswer={submitAnswer} /> : null}
        {videouri ? (
          <div className="parent-player mx-auto  ">
            <ReactPlayer
              url={videouri}
              className="react-players"
              playing={playstate}
              onPlay={play}
              onPause={pause}
              playsinline
              onProgress={(progress) => videoProgres(progress)}
              onEnded={endVideo}
              controls={false}
            />
          </div>
        ) : (
          <div></div>
        )}
        {/* modalRef */}
        <div className="modal_main">
          <div className="modal fade" ref={modalRef} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered  ">
              <div className="modal-content">
                <div className="modal-header ">
                  <div className="modal-title  w-100 d-flex flex-row justify-content center">
                    {carrerSelectionText.Questions}
                  </div>
                </div>
                <div className="modal-body ">
                  <div className="question_back w-100 d-flex flex-row justify-content center">
                    <div className="">
                      {" "}
                      <button className="button">{questionNumber + 1}/{question.length}.</button>
                    </div>{" "}
                    {showqn.question}
                  </div>
                  <div className="buttons ">
                    <button
                      className="yes"
                      onClick={() => handleClose("yes", showqn.question_id)}
                    >
                      {carrerSelectionText.Yes}
                    </button>
                    <button
                      className="yes"
                      onClick={() => handleClose("no", showqn.question_id)}
                    >
                      {carrerSelectionText.No}
                    </button>
                  </div>
                </div>
                <div className="modal-footer"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" ref={modalAlert} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header"></div>
              <div className="modal-body">
                <center>
                  <h3>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries{" "}
                  </h3>
                </center>
                <center>
                  <button className="btn-yellow " onClick={hideAlertModal}>
                    ok
                  </button>
                </center>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" ref={modalNavigation} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header"></div>
              <div className="modal-body">
                <center>
                  <h3>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries{" "}
                  </h3>
                </center>
                <center>
                  <button className="btn-yellow " onClick={hideNavigationModal}>
                    ok
                  </button>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default withRouter(Mobilecareerpath);

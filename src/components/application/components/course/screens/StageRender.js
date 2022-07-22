import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import ScrollArea from "react-scrollbar";
import axios from "axios";
import { courseAPI } from "../api/Api";
import FreshChat from 'react-freshchat'
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Parser from "html-react-parser";
import { CourseText } from "../const/Const_course";
export default function StageRender(props) {
  let {
    stagedata,
    currentcontentid,
    courseid,
    stagenum,
    stage_completed,
    getdata,
    currentstage,
    nextstages,
    Loading,
    stagestarted,
    totalstage,
    showModal,
  } = props;
  let lastArray, firstArray, contentstage_no;
  let course = new courseAPI();
  // const [startCourse, setStartCourse] = useState(false);
  // const [played, setPlayed] = useState(0);
  const [details, setDetails] = useState("");
  const [changeicon, setChangeicon] = useState("");
  const [captureid, setCaptureid] = useState("");
  const [viewbutton, setViewbutton] = useState(false);
  const [laststagechangeicon, setLaststagechangeicon] = useState(true);
  const [lastarraydata, setLastarraydata] = useState({});
  const [firstarraydata, setFirstarraydata] = useState({});
  const [stageLastContentFinished, setStageLastContentFinished] =
    useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [selectedbox, setSelectedbox] = useState("");
  const [touchedIndex, settouchedIndex] = useState(null);
  // const [scrollend, setScrollend] = useState(0);
  const [scrollEndFuncTrigger, setScrollEndFuncTrigger] = useState(true);
  const inputEl = useRef(null);
  useEffect(() => {
    //mount
    if (Array.isArray(stagedata)) {
      findIndex();
    }
  }, []);
  useEffect(() => {
    //update
    if (Array.isArray(stagedata)) {
      updateFunc();
    }
  });
  const updateFunc = () => {
    // console.log("touchedIndex updateFunc", touchedIndex);
    lastArray = stagedata[stagedata.length - 1];
    setLastarraydata(lastArray);
    firstArray = stagedata[0];
    setFirstarraydata(firstArray);
    contentstage_no = firstArray.stage_no;
    inputEl.current.scrollArea.scrollTop();
    stagedata.forEach((item, index) => {
      if (item.id === currentcontentid) {
        // console.log("stagedata");
        if (stage_completed === false) {
          //new
          // console.log("touchedIndex <= index", touchedIndex <= index, touchedIndex);
          if (touchedIndex == 0 || touchedIndex) {
            if (touchedIndex <= index) {
              // console.log("cool");
              setDetails(stagedata[touchedIndex]);
            }
          } else {
            // console.log("stagedata");
            setCaptureid(index - 1);
            setSelectedbox(currentcontentid);
            setDetails(stagedata[index]);
          }
          // }
        }
      }
    });
  };
  // 
  const findIndex = () => {
    inputEl.current.scrollArea.scrollTop();
    lastArray = stagedata[stagedata.length - 1];
    setLastarraydata(lastArray);
    firstArray = stagedata[0];
    setFirstarraydata(firstArray);
    contentstage_no = firstArray.stage_no;
    if (firstArray.content_type == "image") {
      if (
        firstArray.id == currentcontentid &&
        currentstage == 1 &&
        !stagestarted
      ) {
        let formlastData = new FormData();
        formlastData.append("current_stage_no", currentstage);
        formlastData.append("course_id", courseid);
        course
          .startStage(formlastData)
          .then((res) => {
            // setStartCourse(false)
          })
      }
    }
    stagedata.forEach((item, index) => {
      //forinitialrender
      // 
      if (item.id === currentcontentid) {
        if (stage_completed === false) {
          //new
          setDetails(stagedata[index]);
          setCaptureid(index - 1);
          // 
        }
      } else if (firstArray.id === item.id) {
        setDetails(stagedata[index]);
        // 
      }
      if (stage_completed === true) {
        if (item.id == firstArray.id) {
          // 
          setDetails(stagedata[index]);
        }
      }
      if (item.id === currentcontentid && laststagechangeicon === true) {
        if (stage_completed === true && item.id === firstArray.id) {
          setDetails(stagedata[index]);
        }
        setChangeicon(index);
        if (stage_completed === true && contentstage_no != totalstage) {
          setViewbutton(true);
        } else {
          setViewbutton(false);
        }
      }
    });
    if (stage_completed === true) {
      setStageLastContentFinished(true);
      setViewbutton(true);
    } else {
      setStageLastContentFinished(false);
    }
    if (stage_completed === true && contentstage_no === totalstage) {
      setViewbutton(false);
    }
    if (stage_completed === true && contentstage_no != totalstage) {
      setStageLastContentFinished(true);
    }
  };
  const videoduriation = (progress, currentvideoid) => {
    // setPlayed(progress.played.toFixed(1));
    if (
      progress.played.toFixed(4) >= 0.0 &&
      progress.played.toFixed(4) <= 0.001 &&
      firstarraydata.id == currentvideoid &&
      currentstage == 1 &&
      !stagestarted
    ) {
      // 
      let formlastData = new FormData();
      formlastData.append("current_stage_no", currentstage);
      formlastData.append("course_id", courseid);
      course
        .startStage(formlastData)
        .then((res) => {
        })
        .catch((error) => {
        });
    }
  };
  const datapass = (id, data_id, stage_no, order_id) => {
    setSelectedbox(data_id);
    setScrollEndFuncTrigger(true);
    inputEl.current.scrollArea.scrollTop();
    if (stage_completed) {
      setDetails(stagedata[id]);
    } else if (captureid >= id) {
      // console.log("too check", id);
      // updateFunc(id)
      settouchedIndex(id)
      // setDetails(stagedata[id]);
    } else {
      if (changeicon >= id || currentstage != stage_no) {
        setDetails(stagedata[id]);

        let CurrentId_Index;
        stagedata.forEach((item, index) => {
          if (item.id === currentcontentid) {
            CurrentId_Index = index;
          }
          if (item.id === stagedata[id].id) {
            if (CurrentId_Index >= index) {
              setCaptureid(index - 1);
            }
          } else {
            // captureid >= index
            settouchedIndex(id)
            // console.log("too check", captureid >= index);
          }
        });
      } else {

      }
    }
  };
  const videoEnded = (id, stage_no) => {
    // 
    if (stage_no == currentstage && !stage_completed) {
      if (lastarraydata.id == id) {
        Loading();
        let formlastData = new FormData();
        formlastData.append("stage_no", currentstage);
        formlastData.append("course_id", courseid);
        course
          .lastVideoUpdater(formlastData)
          .then((res) => {
            // 
            Loading();
            if (res.status) {
              if (stage_completed === false) {
                setModalShow(true);
              }
              stagedata.forEach((item, index) => {
                if (item.id === details.id) {
                  setCaptureid(index - 1);
                }
              });
            }
          })
          .catch((error) => {
          });
      } else {
        if (id === currentcontentid) {
          Loading();
          let formlastData = new FormData();
          formlastData.append("content_id", id);
          formlastData.append("course_id", courseid);
          course
            .contentUpdater(formlastData)
            .then((res) => {
              // 
              Loading();
              if (res.status) {
                setLaststagechangeicon(false);
                stagedata.forEach((item, index) => {
                  if (item.id === id) {
                    setChangeicon(index + 1);
                    getdata();
                  }
                });
              }
            })
            .catch((error) => {
            });
        }
      }
    }
  };
  const scrollFunc = (value, id, stage_no) => {
    if (value.containerHeight + value.topPosition === value.realHeight) {
      //scrollEnd
      // 
      if (details.content_type == "image") {
        if (scrollEndFuncTrigger) {
          if (stage_no == currentstage && !stage_completed) {
            if (lastarraydata.id == id) {
              Loading();
              let formlastData = new FormData();
              formlastData.append("stage_no", currentstage);
              formlastData.append("course_id", courseid);
              course.lastVideoUpdater(formlastData).then((res) => {
                // 
                if (res.status) {
                  Loading();
                  if (stage_completed === false) {
                    setModalShow(true);
                  }
                  stagedata.forEach((item, index) => {
                    if (item.id === details.id) {
                      setCaptureid(index - 1);
                    }
                  });
                }
              });
            } else {
              if (id === currentcontentid) {
                Loading();
                let formlastData = new FormData();
                formlastData.append("content_id", id);
                formlastData.append("course_id", courseid);
                course.contentUpdater(formlastData).then((res) => {
                  Loading();
                  // 
                  if (res.status) {
                    setLaststagechangeicon(false);
                    stagedata.forEach((item, index) => {
                      if (item.id === id) {
                        setChangeicon(index + 1);
                        getdata();
                      }
                    });
                  }
                });
              }
            }
          }
        }
        setScrollEndFuncTrigger(false);
      }
    }
    // }
  };
  const changestage = () => {
    setModalShow(false);
    Loading();
    let formlastData = new FormData();
    formlastData.append("content_id", details.id);
    formlastData.append("stage_no", currentstage);
    formlastData.append("course_id", courseid);
    course.stageUpdater(formlastData).then((res) => {
      Loading();
      // 
      if (res.status) {
        getdata();
        setChangeicon(0);
      }
    });
  };
  const closeCongratulation = () => {
    setModalShow(false);
    showModal();
  };
  return (
    <div className="stages-body d-md-flex flex-row pe-5">
      <div className=" stages-body-card me-md-1 me-lg-5 d-flex flex-row ">
        <div className="menu-bar ">
          <h5 className="menu-bar-heading mt-5 ms-5 mb-5">
            {CourseText.stage} {stagedata === "" ? "" : stagedata[0]?.stage_no}
          </h5>
          <ScrollArea
            speed={0.9}
            className="area-course "
            horizontal={false}
            verticalScrollbarStyle={{
              background: "transparent",
              width: "0px",
            }}
            smoothScrolling={true}
          >
            {stagedata === ""
              ? ""
              : stagedata.map((data, index) => {
                return (
                  <div
                    className={
                      "multiple-video d-flex flex-row mx-auto" +
                      (data.id == selectedbox &&
                        (changeicon >= index || currentstage != data.stage_no)
                        ? " course-active"
                        : "")
                    }
                    onClick={() =>
                      datapass(index, data.id, data.stage_no, data.order_id)
                    }
                    key={index}
                  >
                    <div className="bar-left">
                      <img
                        src={
                          currentstage != data.stage_no
                            ? "image/done.png"
                            : stageLastContentFinished || captureid >= index
                              ? "image/done.png"
                              : changeicon >= index
                                ? "image/unlock.png"
                                : "image/lock.png"
                        }
                        alt=""
                        className="img-fluid mt-2"
                      />
                      {lastarraydata.id === data.id ? null : (
                        <div className="menubar-sideline  mt-2"></div>
                      )}
                    </div>
                    <div className="video-menu-title ps-1">
                      <p className="mt-1">{data.title}</p>
                      <span className="video-time d-flex flex-row">
                        <img
                          src="image/videotype.png"
                          alt=""
                          className="img-fluid"
                        />
                        {data.content_duration}
                      </span>
                    </div>
                  </div>
                );
              })}
          </ScrollArea>
        </div>
        <ScrollArea
          speed={0.9}
          className="course-video "
          horizontal={false}
          verticalScrollbarStyle={{
            background: "transparent",
            width: "0px",
          }}
          ref={inputEl}
          onScroll={(value) => scrollFunc(value, details.id, details.stage_no)}
        >
          {details.content_type == "image" ? (
            <div className="contenttype_img">
              <img src={details.link} alt="" className="" />
            </div>
          ) : (
            <div className="player-wrapper">
              <ReactPlayer
                className="react-player"
                url={
                  details === ""
                    ? "https://www.youtube.com/watch?v=linlz7-Pnvw"
                    : details.link
                }
                width="100%"
                height="180%"
                controls={true}
                onProgress={(progress) => videoduriation(progress, details.id)}
                onEnded={() => videoEnded(details.id, details.stage_no)}
              />
            </div>
          )}
          <div
            className={
              details.content_type == "image"
                ? "stage-image-description  mt-3"
                : "stage-video-description  mt-3"
            }
          >
            <h1 className=" stages-body-card-title ">
              {" "}
              {!details.title === "" ? null : details.title}
            </h1>
            <p className=" stages-body-card-para  ">
              {!details.description ? null : Parser(details.description)}
            </p>
          </div>
        </ScrollArea>
      </div>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        show={modalShow}
        onHide={() => setModalShow(false)}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="congratulation">
            <img
              src="image/congratulationgif.gif"
              alt=""
              className="img-fluid "
            />
            <h1 className="mt-4">{CourseText.Congratulations}</h1>
            <p className="mt-4 mb-3">
              {CourseText.Youve} {stagenum}
            </p>
            {totalstage == currentstage ? (
              <button
                className="btn-blue mt-5"
                onClick={() => closeCongratulation()}
              >
                {CourseText.Continue}
              </button>
            ) : (
              <button className="btn-blue mt-5" onClick={() => changestage()}>
                {CourseText.Continue}
              </button>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

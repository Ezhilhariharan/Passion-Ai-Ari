import React, { useEffect, useState, useRef } from "react";
import "./styles/Profile_personaldetails.scss";
import { Carousel } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { studentProfileText } from "../../../../admin/components/profile/components/studentProfile/Const_StudentProfile";
import { studentProfileUser_Text } from "./const/Studentprofile_const";
const data = [
  {
    stage_name: "stage 1",
    uv: 4000,
    hours: 2400,
    amt: 2400,
  },
  {
    stage_name: "stage 2",
    uv: 3000,
    hours: 1398,
    amt: 2210,
  },
  {
    stage_name: "stage 3",
    uv: 2000,
    hours: 9800,
    amt: 2290,
  },
];
const CustomizedDot = (props) => {
  const { cx, cy } = props;
  return (
    <svg
      x={cx - 7.5}
      y={cy - 7.5}
      width={15}
      height={15}
      fill="green"
      viewBox="0 0 30 30"
    >
      <ellipse
        id="efbpAm68eny2"
        rx="3"
        ry="3"
        transform="matrix(1 0 0 1 400.714137 215.2377)"
        fill="rgb(210,219,237)"
        stroke="none"
        stroke-width="0"
      />
      <ellipse
        id="efbpAm68eny3"
        rx="13.572204"
        ry="15"
        transform="matrix(1.1052 0 0 1 15 15)"
        fill="rgb(255,122,0)"
        stroke="none"
        stroke-width="0"
      />
    </svg>
  );
};
function Profile_Personaldetails(props) {
  const userefs = useRef();
  const { graphdata, currentstage, course_status } = props;
  const [stategraphdata, setGraphdata] = useState(data);
  useEffect(() => {
    graphdata ? setGraphdata(data) : setGraphdata(graphdata);
  }, [graphdata]);
  // console.log("graphdata",graphdata.length)
  if (graphdata) {
    if (graphdata.length > 0) {
      graphdata.forEach((item) => {
        graphdata[graphdata.indexOf(item)].stage_name = `stage ${item.stage_no}`;
      });
    }
  }
  const onPrevClick = () => {
    userefs.current.prev();
  };
  const onNextClick = () => {
    userefs.current.next();
  };
  console.log("stategraphdata", stategraphdata);
  return (
    <div className=" d-sm-flex flex-row graph-height">
      {currentstage === 3 ? (
        <>
          {course_status === "completed" ? (
            <>
              <div className="report-graph mx-auto my-auto d-none d-lg-none d-xl-flex">
                <LineChart
                  width={800}
                  height={300}
                  data={stategraphdata}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                  className="linechart"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage_name" />
                  <YAxis dataKey="" />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#979797"
                    dot={<CustomizedDot />}
                  />
                </LineChart>
              </div>
              <div className="report-graph mx-auto my-auto  d-none d-md-flex d-lg-flex  d-xl-none">
                <LineChart
                  width={450}
                  height={300}
                  data={stategraphdata}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage_name" />
                  <YAxis dataKey="" />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#979797"
                    dot={<CustomizedDot />}
                  />
                </LineChart>
              </div>
              <div className="report-graph mx-auto my-auto d-none d-sm-flex mt-sm-2 d-md-none">
                <LineChart
                  width={350}
                  height={250}
                  data={stategraphdata}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage_name" />
                  <YAxis dataKey="" />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#979797"
                    dot={<CustomizedDot />}
                  />
                </LineChart>
              </div>
              <div className="report-graph mt-3 d-flex d-sm-none ">
                <LineChart
                  width={280}
                  height={220}
                  data={stategraphdata}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage_name" />
                  <YAxis dataKey="" />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#979797"
                    dot={<CustomizedDot />}
                  />
                </LineChart>
              </div>
              <div className="report-stages me-auto my-auto d-none d-sm-flex ">
                <img
                  src="/image/down.png "
                  alt=""
                  className="rotate-left"
                  data-bs-target="#carouselstages"
                  data-bs-slide="prev"
                />
                <div className="main-box">
                  {stategraphdata.map((data) => (
                    <div className="box-first mt-2 mb-3">
                      <div className="stage-circle-box">
                        <h5 className="mt-2">
                          {/* {studentProfileText.stage} */}
                          {data.stage_name}
                        </h5>
                      </div>
                      <p className="stage-hours  pt-2">
                        {data.hours} {studentProfileText.Hours}
                      </p>
                    </div>
                  ))}
                </div>
                <img
                  src="/image/up.png"
                  alt=""
                  className="rotate-right "
                  data-bs-target="#carouselstages"
                  data-bs-slide="next"
                />
              </div>
              <div className="report-stages  mt-3 d-sm-none d-flex ">
                <div onClick={() => onPrevClick()}>
                  <img
                    src="image/down.png "
                    alt=""
                    className="rotate-lefts"
                    data-bs-target="#carouselstages"
                    data-bs-slide="prev"
                  />
                </div>
                <Carousel indicators={false} ref={userefs} controls={false}>
                  {stategraphdata.map((data, index) => {
                    return (
                      <Carousel.Item>
                        <div key={index}>
                          <div class="report-stages-carousel">
                            <div className="stages-scroll mt-3">
                              <div className="mentorstudent-stagecircle ">
                                <h5 className="mt-2">
                                  {studentProfileText.stage}
                                  {data.stage_name}
                                  <span
                                    style={{
                                      color: "white",
                                    }}
                                  ></span>
                                </h5>
                              </div>
                              <p className="stage-hours  pt-2 mb-4">
                                {data.hours} {studentProfileText.Hours}
                                <span>{studentProfileUser_Text.Hours}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
                <div onClick={() => onNextClick()}>
                  <img
                    src="image/up.png"
                    alt=""
                    className="rotate-rights "
                    data-bs-target="#carouselstages"
                    data-bs-slide="next"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="atlaststage">
              <img src="/image/atlaststage.png" alt="" className=" mt-5 " />
              <p className="mt-5">{studentProfileText.content}</p>
            </div>
          )}
        </>
      ) : (
        <div className="atlaststage">
          <img src="/image/atlaststage.png" alt="" className=" mt-5 " />
          <p className="mt-5">{studentProfileText.content}</p>
        </div>
      )}
    </div>
  );
}
export default Profile_Personaldetails;

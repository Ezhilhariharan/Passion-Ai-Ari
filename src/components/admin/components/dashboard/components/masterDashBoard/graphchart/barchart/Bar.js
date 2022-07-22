import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { graphText } from "../Const_graph";
function Bar(props) {
  const { stageone, stagetwo, stagethree, industryname } = props;
  const [industry, setIndustry] = useState([]);
  const [stageOne, setStageOne] = useState([]);
  const [stageTwo, setStageTwo] = useState([]);
  const [stageThree, setStageThree] = useState([]);
  const passion_usertype = localStorage.getItem("passion_usertype");
  const [usertype, setUsertype] = useState("");
  useEffect(() => {
    let stage_1 = [];
    let stage_2 = [];
    let stage_3 = [];
    let industry = [];
    industryname.slice(0, 6).forEach((item) => {
      industry.push(item.chartindustryname);
    });
    stageone.slice(0, 6).forEach((item) => {
      if (item === 0 || isNaN(item.stage_1)) {
        stage_1.push(0);
      } else {
        stage_1.push(item.stage_1);
      }
    });
    stagetwo.slice(0, 6).forEach((item) => {
      if (item === 0 || isNaN(item.stage_2)) {
        stage_2.push(0);
      } else {
        stage_2.push(item.stage_2);
      }
    });
    stagethree.slice(0, 6).forEach((item) => {
      if (item === 0 || isNaN(item.stage_3)) {
        stage_3.push(0);
      } else {
        stage_3.push(item.stage_3);
      }
    });
    setIndustry(industry);
    setStageOne(stage_1);
    setStageTwo(stage_2);
    setStageThree(stage_3);
    setUsertype(passion_usertype);
  }, [industryname, passion_usertype]);
  // 
  const basicData3 = {
    labels: [...industry],
    datasets: [
      {
        label: "Stage1",
        backgroundColor: "#C4C4C4",
        data: [...stageOne],
      },
      {
        label: "Stage2",
        backgroundColor: "#FF7A00",
        data: [...stageTwo],
      },
      {
        label: "Stage3",
        backgroundColor: "#5A619E",
        data: [...stageThree],
      },
    ],
  };
  const basicOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1.0,
    plugins: {
      legend: {
        labels: {
          color: "#C4C4C4",
        },
      },
    },
    scales: {
      xAxes: [
        {
          barPercentage: 0.4,
        },
      ],
      x: {
        ticks: {
          color: "#C4C4C4",
        },
        grid: {
          color: "transparent",
        },
      },
      y: {
        ticks: {
          color: "#C4C4C4",
        },
        grid: {
          color: "transparent",
        },
      },
    },
  };
  return (
    <div className="dashboard-bargraph ">
      <div className="d-flex flex-row col-11">
        <div className="dashboard-piechart-title col-6 ps-3"></div>
        {usertype == 1 ? (
          <div className="col-6 d-flex flex-row justify-content-end ">
            <div
              className="dashboard-piechart-viewmore"
              data-bs-toggle="modal"
              data-bs-target="#open-industrymodal"
            >
              {graphText.viewMore}
            </div>
          </div>
        ) : (
          <div className=" col-6 d-flex flex-row justify-content-end ">
            <div
              className="dashboard-piechart-viewmore"
              data-bs-toggle="modal"
              data-bs-target="#open-collegeindustrymodal"
            >
              {graphText.viewMore}
            </div>
          </div>
        )}
      </div>
      <Chart
        type="bar"
        data={basicData3}
        options={basicOptions}
        style={{ width: "90%", height: "85%" }}
      />
    </div>
  );
}
export default Bar;

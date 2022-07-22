import React, { useState } from "react";
import { Chart } from "primereact/chart";
import { graphText } from "../Const_graph";
function WebinarAndAppointment(props) {
  const { webinar, appointment } = props;
  const [active, setActive] = useState(1);
  const basicData1 = {
    labels: ["Completed", "Yet to start"],
    datasets: [
      {
        label: "Appoinment",
        backgroundColor: "#2a2e4b",
        data: [...appointment],
      },
    ],
  };
  const basicData2 = {
    labels: ["Completed", "Yet to start"],
    datasets: [
      {
        label: "Webinar",
        backgroundColor: "#FF7A00",
        data: [...webinar],
      },
    ],
  };
  let horizontalOptions = {
    indexAxis: "y",
    maintainAspectRatio: false,
    aspectRatio: 1.9,
    plugins: {
      legend: {
        labels: {
          color: "#C4C4C4",
        },
      },
    },
    scales: {
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
    <div className="appointmentandwebinor-graph ">
      <div className="d-flex flex-row p-3">
        <div
          className={
            active === 1
              ? "active-header heading-size  d-flex flex-row me-2"
              : "heading-size  d-flex flex-row me-2"
          }
          onClick={() => setActive(1)}
          data-bs-target="#appointmentandwebinor-graph"
          data-bs-slide-to="0"
        >
          <div className="appointment-dot ms-2 me-1 "></div>
          <div className="col-3 heading d-flex flex-row ">
            {graphText.appointment}
          </div>
        </div>
        <div
          className={
            active === 2
              ? "active-header heading-size  d-flex flex-row me-2"
              : "heading-size  d-flex flex-row me-2"
          }
          onClick={() => setActive(2)}
          data-bs-target="#appointmentandwebinor-graph"
          data-bs-slide-to="1"
        >
          <div className="Webinor-dot ms-2 me-1"></div>
          <div className="col-3 heading d-flex flex-row">
            {graphText.webinar}
          </div>
        </div>
      </div>
      <div
        id="appointmentandwebinor-graph"
        class="carousel slide w-100 h-100"
        data-bs-interval="false"
      >
        <div class="carousel-inner">
          <div class="carousel-item active w-100  ">
            <Chart
              type="bar"
              data={basicData1}
              options={horizontalOptions}
              style={{ width: "92%", height: "85%" }}
            />
          </div>
          <div class="carousel-item w-100 ">
            <Chart
              type="bar"
              data={basicData2}
              options={horizontalOptions}
              style={{ width: "92%", height: "85%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default WebinarAndAppointment;

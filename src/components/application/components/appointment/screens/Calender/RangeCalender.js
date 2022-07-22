import React, { useState } from "react";
import useCalendar from "./useCalender";
import "../../styles/Appointment.scss";
import { AppoinmentText } from "../../const/const_Appoinment";
import { Modal } from "react-bootstrap";
const Calendar = (props) => {
  const {
    calendarRows,
    selectedDate,
    todayFormatted,  
    monthNames,
    getNextMonth,
    getPrevMonth,
  } = useCalendar();
  const { showcalender, fromdate, todate } = props;
  // const [fromDate, setfromDate] = useState([]);
  // const [fromclassDate, setFromclassDate] = useState(0);
  // const [toDate, settoDate] = useState([]);
  // const [toclassDate, setToclassDate] = useState(0);
  const [active, setActive] = useState(1);
  const [activerangedate, setActiverangedate] = useState(false);
  const [rangecalender, setRangecalender] = useState(true);
  const [calendarrows, setcalendarrows] = useState([]);
  const [errormodal, setErrormodal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rangeFromDate, setRangeFromDate] = useState("");
  let dt = new Date();
  let currentdate = dt.getDate().toString().padStart(2, "0");
  let currentmonth = dt.getMonth().toString().padStart(2, "0");
  let currentYear = dt.getFullYear();
  const nextMonth = () => {
    getNextMonth();
    setRangecalender(true);
  };
  const prevMonth = () => {
    getPrevMonth();
    setRangecalender(true);  
  };
  const fromdateHandler = (data, classes) => {
    let selecteddate = data.split("-");
    setRangeFromDate(
      new Date(selecteddate[2], selecteddate[1] - 1, selecteddate[0])
    );    
    if (classes === "in-next-month" || classes === "in-prev-month") {
    } else {
      if (
        new Date(currentYear, currentmonth, currentdate) <=
        new Date(selecteddate[2], selecteddate[1] - 1, selecteddate[0])
      ) {
        setRangecalender(true);
        setActive(2);
        let re = /-/g;
        let str = data;
        let result = re[Symbol.split](str);
        // setfromDate(result);
        fromdate(result[0], `${result[2]}-${result[1]}-${result[0]}`);
        // setFromclassDate(result[0]);
      } else {
        props.toast();
        setErrormodal(true);
        setErrorMessage("please select future Dates");
      }
    }
  };
  const todateHandler = (data, classes) => {
    let selecteddate = data.split("-");
    // 
    if (classes === "in-next-month" || classes === "in-prev-month") {      
    } else {
      if (
        new Date(currentYear, currentmonth, currentdate) <=
        new Date(selecteddate[2], selecteddate[1] - 1, selecteddate[0])
      ) {
        setActive(1);
        let re = /-/g;
        let str = data;
        let result = re[Symbol.split](str);
        // settoDate(result);
        todate(
          result[0] +
            " " +
            monthNames[selectedDate.getMonth()] +
            " " +
            result[2],
          `${result[2]}-${result[1]}-${result[0]}`
        );
        // setToclassDate(result[0]);
        // let calenderdata = [];
        Object.values(calendarRows).forEach((cols) => {
          cols.forEach((col) => {
            let convertedDate = col.date.split("-");
            if (
              rangeFromDate <=
                new Date(
                  convertedDate[2],
                  convertedDate[1] - 1,
                  convertedDate[0]
                ) &&
              new Date(selecteddate[2], selecteddate[1] - 1, selecteddate[0]) >=
                new Date(
                  convertedDate[2],
                  convertedDate[1] - 1,
                  convertedDate[0]
                )
            ) {
              col["selected_range"] = true;
            } else {
              col["selected_range"] = false;
            }
          });
        });
        setcalendarrows(calendarRows);
        setRangecalender(false);
      } else {
        props.toast();
        setErrormodal(true);
        setErrorMessage("please select future Dates");
      }
    }
    // 
  };
  // 
  // 
  return (
    <div
      className={"Calendar mt-3" + (showcalender ? "" : " calender_opacity ")}
    >
      <div className="d-flex flex-row ">
        <p className=" my-auto ps-1 ps-sm-4">{AppoinmentText.SelectDate}</p>
        <div className="d-flex flex-row ms-auto my-auto me-1 me-sm-5">
          {" "}
          <img
            src="image/up.png"
            alt=""
            className=" img-fluid rotate-left-calender"
            onClick={prevMonth}
          />
          <div className="monthandyear ms-2 me-2">{`${
            monthNames[selectedDate.getMonth()]
          } - ${selectedDate.getFullYear()}`}</div>
          <img
            src="image/down.png"
            alt=""
            className=" img-fluid rotate-right-calender"
            onClick={nextMonth}
          />
        </div>
      </div>
      <div className=" calender-table">
        <table className="table mt-3 ">
          <tbody>
            <tr>
              <th>{AppoinmentText.Mon}</th>
              <th>{AppoinmentText.Tue}</th>
              <th>{AppoinmentText.Wed}</th>
              <th>{AppoinmentText.Thur}</th>
              <th>{AppoinmentText.Fri}</th>
              <th>{AppoinmentText.Sat}</th>
              <th>{AppoinmentText.Sun}</th>
            </tr>
            {rangecalender ? (
              <>
                {Object.values(calendarRows).map((cols) => {
                  let todayDate = todayFormatted.split("-");
                  //  let date = cols[0].date.split("-");
                  let Today = new Date(
                    todayDate[2],
                    todayDate[1] - 1,
                    todayDate[0]
                  );
                  return (
                    <tr key={cols[0].date}>
                      {cols.map((col) =>
                        new Date(
                          col.date.split("-")[2],
                          col.date.split("-")[1] - 1,
                          col.date.split("-")[0]
                        ) < Today ? (
                          <td
                            key={col.date}
                            className="in-prev-month"
                            onClick={() =>
                              active === 1
                                ? fromdateHandler(col.date, "in-prev-month")
                                : todateHandler(col.date, "in-prev-month")
                            }
                          >
                            {col.value}
                          </td>
                        ) : (
                          <td
                            key={col.date}
                            className={col.classes}
                            onClick={() =>
                              active === 1
                                ? fromdateHandler(col.date, col.classes)
                                : todateHandler(col.date, col.classes)
                            }
                          >
                            {col.value}
                          </td>
                        )
                      )}
                    </tr>
                  );
                })}
              </>
            ) : (
              <>
                {Object.values(calendarrows).map((cols) => {
                  return (
                    <tr key={cols[0].date}>
                      {cols.map((col) =>
                        col.date === todayFormatted ? (
                          <td
                            key={col.date}
                            // className={`${col.classes} today`}
                            className={
                              col.classes == ""
                                ? activerangedate
                                  ? "range"
                                  : col.classes
                                : col.classes
                            }
                            onClick={
                              active === 1
                                ? () => fromdateHandler(col.date, col.classes)
                                : () => todateHandler(col.date, col.classes)
                            }
                          >
                            {col.value}
                          </td>
                        ) : (
                          <td
                            key={col.date}
                            // className={col.classes}
                            className={
                              col.classes == ""
                                ? col.selected_range
                                  ? "range"
                                  : col.classes
                                : col.classes
                            }
                            onClick={
                              active === 1
                                ? () => fromdateHandler(col.date, col.classes)
                                : () => todateHandler(col.date, col.classes)
                            }
                          >
                            {col.value}
                          </td>
                        )
                      )}
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        show={errormodal}
        onHide={() => setErrormodal(false)}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-100">
            <center className="mt-5 mb-3">
              <h4>
                <b>{errorMessage}</b>
              </h4>
            </center>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex flex-row justify-content-center w-100">
            <button
              className="btn-blue mt-4 mb-5 w-50"
              onClick={() => setErrormodal(false)}
            >
              {AppoinmentText.ok}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      {/* <Errormodal value={errormodal} message={errorMessage} /> */}
    </div>
  );
};
export default Calendar;

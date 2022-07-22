import React, { Fragment, useState } from "react";
import useCalendar from "./useCalender";
import { AppoinmentText } from "../../const/const_Appoinment";
const Calendar = (props) => {
  const {
    calendarRows,
    selectedDate,
    todayFormatted,   
    monthNames,
    getNextMonth,
    getPrevMonth,
  } = useCalendar();
  const { showcalender, selectdate } = props;
  let dt = new Date();
  let currentdate = dt.getDate().toString().padStart(2, "0");
  let currentmonth = dt.getMonth().toString().padStart(2, "0");
  let currentYear = dt.getFullYear();
  // let currentdata = `${currentdate}-${currentmonth}-${currentYear}`;
  const [calendarrows, setcalendarrows] = useState([]);
  const [rangecalender, setRangecalender] = useState(true);
  const nextMonth = () => {
    getNextMonth();
    setRangecalender(true);
    props.cleardata();
  };
  const prevMonth = () => {
    getPrevMonth();
    setRangecalender(true);
    props.cleardata();
  };
  const dateClickHandler = (data, classes) => {
    console.log(data)
    let selecteddate = data.split("-");
    if (classes === "in-next-month" || classes === "in-prev-month") {      
    } else {
      if (
        new Date(currentYear, currentmonth, currentdate) <=
        new Date(selecteddate[2], selecteddate[1] - 1, selecteddate[0])
      ) {
        let re = /-/g;
        let str = data;
        let result = re[Symbol.split](str);
        // 
        selectdate(
          result[2] + "-" + result[1] + "-" + result[0],
          result[0] +
            " " +
            monthNames[selectedDate.getMonth()] +
            " " +
            result[2]
        );
        Object.values(calendarRows).forEach((cols) => {
          cols.forEach((col) => {
            let convertedDate = col.date.split("-");
            if (result[0] == col.value && result[1] == convertedDate[1]) {
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
      }
    }
  };
  return (
    <div className={"Calendar" + (showcalender ? "" : " calender_opacity ")}>
      <div className="d-flex flex-row ">
        <p className=" my-auto ps-1 ps-sm-4">{AppoinmentText.SelectDate}</p>
        <div className="d-flex flex-row ms-auto my-auto me-1 me-sm-5">
          {" "}
          <img
            src="/image/up.png"
            alt=""
            className=" img-fluid rotate-left-calender"
            onClick={prevMonth}
          />
          <div className="monthandyear ms-2 me-2">{`${
            monthNames[selectedDate.getMonth()]
          } - ${selectedDate.getFullYear()}`}</div>
          <img
            src="/image/down.png"
            alt=""
            className=" img-fluid rotate-right-calender"
            onClick={nextMonth}
          />
        </div>
      </div>
      <div className="calender-table ">
        <table className="table  ">
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
                  // let date = cols[0].date.split("-");
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
                              dateClickHandler(col.date, "in-prev-month")
                            }
                          >
                            {col.value}
                          </td>
                        ) : (
                          <td
                            key={col.date}
                            className={col.classes}                          
                            onClick={() =>
                              dateClickHandler(col.date, col.classes)
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
                  let todayDate = todayFormatted.split("-");
                  // let date = cols[0].date.split("-");
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
                              dateClickHandler(col.date, "in-prev-month")
                            }
                          >
                            {col.value}
                          </td>
                        ) : (
                          <td
                            key={col.date}
                            className={
                              col.selected_range ? "range" : col.classes
                            }
                            onClick={() =>
                              dateClickHandler(col.date, col.classes)
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
    </div>
  );
};
export default Calendar;

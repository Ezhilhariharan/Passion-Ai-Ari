import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import { feedAPI } from "../../studenthome/api/Api";
import { mentorText } from "../const/Const_mentor";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TextField from "@mui/material/TextField";
import TimePicker from "@mui/lab/TimePicker";
import DatePicker from 'react-date-picker';
import moment from "moment";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";

const createpostSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});
class CreateWebinar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selecteddate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
      showmodal: false,
      showError: false,
      errorMessage: "",
      date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
      dateError: false,
      time: "",
      showtime: "",
      timeError: false,
    };
    this.closeModal = this.closeModal.bind(this);
    this.openmodal = this.openmodal.bind(this);
    this.datePicker = React.createRef();
    this.timeRef = React.createRef();
    this.feedAPI = new feedAPI();
  }
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
    this.closeModal();
  };
  onChangedate = (value) => {
    // selectedDates, dateStr, instance selecteddate: dateStr    
    if (value) {
      let converted = moment(value).format("YYYY-MM-DD");
      console.log("converted",converted)
      this.setState({ date: value, selecteddate: converted });
    } else {
      this.setState({
        date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
        selecteddate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
      });
    }
  };
  componentDidMount() {
    let converted = moment(new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)).format("YYYY-MM-DD");
    this.setState({
      selecteddate: converted
    });
  }
  openmodal() {
    this.setState({ showmodal: true });
  }
  closeModal() {
    this.setState({ showmodal: false });
    this.props.closefeed(false);
  }
  handleDateChange = (date) => {
    // setSelectedDate(date);
  };
  dateSelect = (date) => {
    if (!date) {
      this.setState({ timeError: false });
    }
    if (date) {
      let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
      let am_pm = date.getHours() >= 12 ? "PM" : "AM";
      hours = hours < 10 ? "0" + hours : hours;
      let minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let Time = hours + ":" + minutes + " " + am_pm;
      this.setState({
        showtime: date.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        time: Time,
      });
    }
  };
  render() {
    return (
      <div>
        {" "}
        <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.showmodal}
          onHide={() => this.setState({ showmodal: false })}
          className={this.props.theme ? "themeblack_modal" : "themewhite_modal"}
        >
          <Modal.Header>
            <div className="d-flex flex-row  w-100">
              <h3 className="ms-auto ps-3" onClick={ () => this.setState({ errorMessage: "", showError: true })  }>{mentorText.modaltitle}</h3>
              <i
                class="fa-regular fa-circle-xmark  ms-auto"
                onClick={this.closeModal}
              ></i>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{ description: "", title: "" }}
              onSubmit={(values) => {
                if (
                  (this.state.selecteddate.length === 0 &&
                    this.state.time.length === 0) ||
                  (this.state.selecteddate.length === 0 &&
                    this.state.time.length !== 0) ||
                  (this.state.selecteddate.length !== 0 &&
                    this.state.time.length === 0)
                ) {
                  this.setState({
                    dateError: true,
                    timeError: true,
                  });
                } else {
                  if (
                    this.state.selecteddate.length !== 0 &&
                    this.state.time !== ""
                  ) {
                    this.props.loading();
                    let formData = new FormData();
                    formData.append("description", values["description"]);
                    formData.append("title", values["title"]);
                    formData.append("date", this.state.selecteddate);
                    formData.append("time", this.state.showtime);
                    this.feedAPI.createWebinar(formData).then((res) => {
                      this.props.loading();                  
                          if (res.status) {
                        this.props.alertToaste();
                        this.props.refreshWebinarData();
                        this.closeModal();
                      } else {
                        if (res.message) {
                          if (typeof res.message === "object") {
                            let value = Object.values(res.message);
                            this.setState({
                              errorMessage: value[0],
                              showError: true,
                            });                            
                          } else {                         
                            this.setState({
                              errorMessage: res.message,
                              showError: true,
                            });
                          }                    
                        } else {
                          this.setState({
                            errorMessage: "Something Went Wrong",
                            showError: true,
                          });
                        }                        
                      }
                    });
                  }
                }
              }}
              validationSchema={createpostSchema}
            >
              <Form className=" mt-3 p-2">
                <div
                  className="webinarlabel "
                  htmlFor="number"
                  onClick={() => this.props.refreshWebinarData()}
                >
                  {mentorText.title}
                </div>
                <Field
                  name="title"
                  type="text"
                  className="input-createwebinar"
                  maxlength="35"
                />
                <ErrorMessage name="title">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
                <div className="webinarlabel mt-3 mb-3" htmlFor="number">
                  {mentorText.description}
                </div>
                <Field
                  name="description"
                  as="textarea"
                  className="textarea-createwebinar"
                  maxlength="150"
                />
                <ErrorMessage name="description">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
                <div className="d-flex flex-row  ">
                  <div>
                    <div className="webinarlabel mt-3 mb-3" htmlFor="number">
                      {mentorText.date}
                    </div>                
                    <div className="cusDatepicker  ">
                      <DatePicker onChange={this.onChangedate} value={this.state.date} minDate={new Date(
                        new Date().getTime() + 3 * 24 * 60 * 60 * 1000)} />
                    </div>
                    {this.state.dateError ? (
                      <>
                        {this.state.selecteddate.length === 0 ? (
                          <div style={{ color: "red" }}>
                            {mentorText.required}
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                  <div className="ms-3 ">
                    <div className="webinarlabel mt-3 mb-3 " htmlFor="number">
                      {mentorText.time}
                    </div>
                    <div className="d-flex flex-row cusTime-picker">
                      <div className="span">{this.state.time}</div>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                          value={this.state.time}
                          onChange={(time) => this.dateSelect(time)}
                          renderInput={(params) => <TextField {...params} />}
                          onBlur={() =>
                            this.setState({
                              timeError: true,
                            })
                          }
                        />
                      </LocalizationProvider>
                    </div>
                    {this.state.timeError ? (
                      <>
                        {this.state.time === "" ? (
                          <div style={{ color: "red" }}>
                            {mentorText.required}
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
                <Modal.Footer>
                  <div className=" update-post d-flex flex-row mt-5 mb-4 w-100">
                    <button type="submit" className="btn-blue w-50 ">
                      {mentorText.create}
                    </button>{" "}
                  </div>
                </Modal.Footer>
              </Form>
            </Formik>
          </Modal.Body>
        </Modal>
        <ErrorModal
          message={this.state.errorMessage}
          value={this.state.showError}
          closeModal={this.closeErrorModal}
        />
        {/* <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.showError}
          onHide={() => this.setState({ showError: false })}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="w-100">
              <center className="mt-5 mb-3">
                <h4>
                  <b>{this.state.errorMessage}</b>
                </h4>
              </center>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex flex-row justify-content-center w-100">
              <button
                className="btn-blue mt-4 mb-5 w-50"
                onClick={() => this.setState({ showError: false })}
              >
                {mentorText.Ok}
              </button>
            </div>
          </Modal.Footer>
        </Modal> */}
      </div >
    );
  }
}
export default CreateWebinar;

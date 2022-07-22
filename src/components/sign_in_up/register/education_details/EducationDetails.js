import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { Tooltip } from "primereact/tooltip";
import { registerText } from "../../register/Registerconst";
import { API } from "../api/api";
import YearPicker from "react-single-year-picker";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
let getcollegelist = [{ code: "", name: "" }];
class EducationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegelist: [],
      departmentlist: [],
      enddate: new Date().getFullYear(),
      // batchyear:  props.batch?props.batch:"",
      // batchyear:props.batch,
      batchyear: props.batch,
      collegeData: props.college_id,
      departmentData: props.department_id,
      college: "",
      inputtouch: false,
      departmentinputtouch: false,
      dateinputtouch: false,
      initialdepartment: props.department,
      initialcollege: props.college,
      collegeValue: props.collegevalue,
    };
    this.changepage = this.props.changepage.bind(this);
    this.inputOpenFileRef = React.createRef();
    this.showOpenFileDlg = this.showOpenFileDlg.bind(this);
    // this.collegename = getcollegelist;
    // this.departmentname = getdepartmentlist;
    this.collegenamelist = this.collegenamelist.bind(this);
    this.ondepartmentchange = this.ondepartmentchange.bind(this);
    this.validate = this.validate.bind(this);
    this.getdata = this.props.getdata.bind(this);
    this.API = new API();
  }  
  componentDidMount() {
    delete axios.defaults.headers.common["Authorization"];
    this.collegeList();
  }
  collegeList = () => {
    this.API.collegeList().then((res) => {
      if (res.status) {
        if (getcollegelist[0]?.code === "" && getcollegelist[0]?.name === "") {
          if (getcollegelist.length > 1) {
            this.setState({ collegelist: getcollegelist });
          } else {
            for (let i of res.data) {
              getcollegelist.push({ code: i.id, name: i.name });
            }
            this.setState({ collegelist: getcollegelist });
          }
        }
      }
    });
    if (this.state.initialcollege) {
      let value = this.state.collegeValue;
      if (typeof value !== "string") {
        this.setState({
          initialcollege: value.name,
          collegeData: value.code,
        });
      }
      if (typeof value === "string") {
        if (value.match(/^[a-zA-Z][a-zA-Z ]*$/) === null) {
          this.setState({ initialcollege: "", inputtouch: true });
        } else {         
          getcollegelist.forEach((obj) => {
            if (obj.name.toLowerCase() === value.toLowerCase()) {             
              this.setState({
                initialcollege: obj.name,
                collegeData: obj.code,
              });
            } else {             
              this.setState({
                initialcollege: value,
                collegeData: value,
              });
            }
          });
        }
      }
      if (typeof value === "object") {
        let getdepartmentlist = [{ code: "", name: "" }];
        this.API.departmentList(value.code).then((res) => {
          if (res.status) {
            for (let i of res.data) {
              getdepartmentlist.push({ code: i.id, name: i.name });
            }
            this.setState({ departmentlist: getdepartmentlist });
          }
        });
      } else {
        let getdepartmentlist = [{ code: "", name: "" }];
        this.API.departmentList(value).then((res) => {
          if (res.status) {
            for (let i of res.data) {
              getdepartmentlist.push({ code: i.id, name: i.name });
            }
            this.setState({ departmentlist: getdepartmentlist });
          }
        });
      }
    }
  };
  showOpenFileDlg() {
    this.inputOpenFileRef.current.handlePicker();
  }
  collegenamelist(e) {
    this.setState({ collegeValue: e.value });
    if (typeof e.value !== "string") {
      this.setState({
        initialcollege: e.value.name,
        collegeData: e.value.code,
      });    
    }
    if (typeof e.value === "string") {
      if (e.value.match(/^[a-zA-Z][a-zA-Z ]*$/) === null) {
        this.setState({ initialcollege: "", inputtouch: true });
      } else {      
        getcollegelist.forEach((obj) => {
          if (obj.name.toLowerCase() === e.value.toLowerCase()) {            
            this.setState({
              initialcollege: obj.name,
              collegeData: obj.code,
            });
          } else {           
            this.setState({
              initialcollege: e.value,
              collegeData: e.value,
            });
          }
        });
      }
    }
    if (typeof e.value === "object") {
      let getdepartmentlist = [{ code: "", name: "" }];
      this.API.departmentList(e.value.code).then((res) => {
        if (res.status) {
          for (let i of res.data) {
            getdepartmentlist.push({ code: i.id, name: i.name });
          }
          this.setState({ departmentlist: getdepartmentlist });
        }
      });
    } else {
      let getdepartmentlist = [{ code: "", name: "" }];
      this.API.departmentList(e.value).then((res) => {
        if (res.status) {
          for (let i of res.data) {
            getdepartmentlist.push({ code: i.id, name: i.name });
          }
          this.setState({ departmentlist: getdepartmentlist });
        }
      });
    }
  }
  ondepartmentchange(e) {
    if (typeof e.value !== "string") {
      this.setState({
        initialdepartment: e.value.name,
        departmentData: e.value.code,
      });
    }
    if (typeof e.value === "string") {
      if (e.value.match(/^[a-zA-Z][a-zA-Z ]*$/) === null) {
        this.setState({
          initialdepartment: "",
          departmentinputtouch: true,
        });
      } else {
        this.state.departmentlist.forEach((obj) => {
          if (obj.name.toLowerCase() === e.value.toLowerCase()) {
            this.setState({
              initialdepartment: obj.name,
              departmentData: obj.code,
            });
          } else {
            this.setState({
              initialdepartment: e.value,
              departmentData: e.value,
            });
          }
        });
      }
    }
  }
  validate(event) {
    event.preventDefault();
    let data = {};
    if (this.state.initialcollege.length !== 0) {
      data["college_id"] = this.state.collegeData;
      data["collegeName"] = this.state.initialcollege;
    } else {
      this.setState({ inputtouch: true });
    }
    if (this.state.initialdepartment.length !== 0) {
      data["department_id"] = this.state.departmentData;
      data["departmentName"] = this.state.initialdepartment;
      data["collegeValue"] = this.state.collegeValue;
    } else {
      this.setState({ departmentinputtouch: true });
    }
    if (this.state.batchyear !== "") {
      data["batch"] = this.state.batchyear;  
    } else {
      this.setState({ dateinputtouch: true });
    }
    if (
      this.state.initialcollege.length !== 0 &&
      this.state.initialdepartment.length !== 0 &&
      (this.state.batchyear || this.state.batchyear !== "")
    ) {
      this.getdata(data, 2, 2);
    }
  }
  render() {
    return (
      <div className="w-100 ">
        <form
          className="customForm   mx-auto pb-5 pt-2"
          onSubmit={this.validate}
        >
          <div
            className="back-icon ms-auto  me-3 "
            onClick={() => this.changepage(null)}
          >
            <i className="fa-solid fa-chevron-left "></i>
          </div>
          <h1 className="login-txt mb-5 mx-auto pt-5">
            {registerText.cardSecondTitle}
          </h1>
          <div className="form-group mt-2">
            <label className="label" htmlFor="college">
              {registerText.college}
            </label>
            <div className="w-100 d-flex flex-row">
              <Dropdown
                id="collegelist"
                value={this.state.initialcollege}
                options={this.state.collegelist}
                onChange={this.collegenamelist}
                optionLabel="name"
                className="dropdown-reg  mb-2"
                editable
                maxLength="50"
                onBlur={() => {
                  this.setState({
                    inputtouch: true,
                  });
                }}
              />
              <div>
                <Tooltip target=".custom-target-icon" />
                <i
                  className="custom-target-icon pi pi-exclamation-circle info-icon ms-3 mt-3"
                  data-pr-tooltip="If you dont't find your college in the List ,please enter it manually"
                  data-pr-position="top"
                  style={{
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                ></i>
              </div>
            </div>
            {this.state.inputtouch ? (
              <>
                {this.state.initialcollege.length === 0 && (
                  <div style={{ color: "red" }}>{registerText.errorclg}</div>
                )}
              </>
            ) : null}
          </div>
          <div className="form-group mt-2">
            <label className="label" htmlFor="department">
              {registerText.department}
            </label>
            <div className="w-100 d-flex flex-row">
              <Dropdown
                value={this.state.initialdepartment}
                options={this.state.departmentlist}
                onChange={this.ondepartmentchange}
                optionLabel="name"
                className="dropdown-reg  mb-2"
                editable
                maxLength="25"
                onBlur={() => {
                  this.setState({
                    departmentinputtouch: true,
                  });
                }}
              />
              <div>
                <Tooltip target=".custom-target-icon" />
                <i
                  className="custom-target-icon pi pi-exclamation-circle info-icon ms-3 mt-3"
                  data-pr-tooltip="Replace College with department for department list"
                  data-pr-position="top"
                  style={{
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                ></i>
              </div>
            </div>
            {this.state.departmentinputtouch ? (
              <>
                {this.state.initialdepartment.length === 0 && (
                  <div style={{ color: "red" }}>
                    {registerText.errordepartment}
                  </div>
                )}
              </>
            ) : null}
          </div>
          <div className="form-group mt-2">
            <label className="label" htmlFor="graduation">
              {registerText.batch}
            </label>
            <div className="yearpicker d-flex flex-row ">
              <YearPicker
                value={this.state.batchyear}
                onSelect={(e) => this.setState({ batchyear: e })}
                hideInput={false}
                className="input "
                ref={this.inputOpenFileRef}
                minRange={1960}
                maxRange={this.state.enddate}
              />
              <i
                className="fa-light fa-calendar calendar"
                onClick={this.showOpenFileDlg}
              ></i>
            </div>
            {this.state.dateinputtouch ? (
              <>
                {!this.state.batchyear && (
                  <div
                    style={{
                      color: "red",
                      padding: "10px 0px 0px 0px",
                    }}
                  >
                    {registerText.errormsg}
                  </div>
                )}
              </>
            ) : null}
          </div>
          <div className=" w-100 d-flex flex-row justify-content-center">
            <button type="submit" value="Submit" className="btn-blue  mt-5 ">
              {registerText.nextbutton}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
export default withRouter(EducationDetails);

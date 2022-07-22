import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { API } from "./utils/API";
import "../collegeList/styles/CollegeList.scss";
import Header from "../../../../../navbar/header/Header";
import Deletemodal from "../../../../../common_Components/popup/Deletemodal";
import { collegeText } from "../../Const_College";
import { connect } from "react-redux";


let url;
class CollegeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeList: {},
      openmodal: false,
      modalmessage: "",
      id: "",
      lock: false,
      page: 1,
      subscriptiontype: [],
      subscription: "",
      status: "",
      searchvalue: "",
      studentResultsLength: "",
      studentCount: "",
      college_type: "",
    };
    url = this.props.match.path;
    this.nameTemplate = this.nameTemplate.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
    this.statusTemplate = this.statusTemplate.bind(this);
    this.approveStudent = this.approveStudent.bind(this);
    this.deleteDetails = this.deleteDetails.bind(this);
    this.collegeAPI = new API();
    this.scrollLoader = this.scrollLoader.bind(this);
    this.getCollegeList = this.getCollegeList.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }
  componentDidMount() {
    this.getCollegeList();
    this.scrollLoader();
    this.initialRender();
  }
  initialRender = () => {
    let getSubscriptionType = [{ id: "", subscription_type: "All type" }];
    this.collegeAPI
      .subscription()
      .then((res) => {
        if (res.status) {
          for (let i of res.data) {
            getSubscriptionType.push({
              id: i.id,
              subscription_type: i.subscription_type,
            });
          }
          this.setState({ subscriptiontype: getSubscriptionType });
        }
      })
  };
  scrollLoader() {
    let scroller = document.getElementsByClassName(
      "p-datatable-scrollable-body"
    )[0];
    let scrollerBody = document.getElementsByClassName(
      "p-datatable-scrollable-body-table"
    )[0];
    scroller.addEventListener("scroll", () => {
      if (
        scroller.scrollTop >
        (scrollerBody.clientHeight - scroller.clientHeight) * 0.9
      ) {
        if (!this.state.lock && this.state.collegeList.next) {
          this.setState({ lock: true }, () => {
            if (
              this.state.studentCount / this.state.studentResultsLength >
              this.state.page
            ) {
              this.setState({ page: this.state.page + 1 }, () => {
                this.getCollegeList();
              });
            }
          });
        }
      }
    });
  }
  getCollegeList(
    pageNumber,
    searchValue,
    subscription,
    status,
    college_type,
    reset = false
  ) {
    if (this.state.status !== "") {
      status = this.state.status;
    }
    if (this.state.subscription !== "") {
      subscription = this.state.subscription;
    }
    if (this.state.college_type !== "") {
      college_type = this.state.college_type;
    }
    if (pageNumber === 1) {
      this.state.page = pageNumber;
    }
    let list;
    this.collegeAPI
      .getColleges(
        this.state.page,
        searchValue,
        subscription,
        status,
        college_type
      )
      .then((res) => {
        if (Object.keys(this.state.collegeList).length !== 0 && !reset) {
          list = this.state.collegeList.results;
          list.push(...res.data.results);
          res.data.results = list;
          this.setState({ collegeList: res.data });
        } else {
          this.setState({
            collegeList: res.data,
            studentResultsLength: res.data.results.length,
            studentCount: res.data.count,
          });
        }
        this.setState({ lock: false });
      })
  }
  nameTemplate(rowData) {
    return (
      <React.Fragment>
        <img
          alt={rowData.name}
          src={
            rowData.logo
              ? rowData.logo
              : `https://avatars.dicebear.com/api/initials/${rowData.name}.svg`
          }
          onError={(e) =>
          (e.target.src =
            "https://avatars.dicebear.com/api/initials/random.svg")
          }
          width={50}
          style={{ verticalAlign: "middle" }}
          className=" table-img img-fluid me-3"
        />
        <span className="image-text">{rowData.name}</span>
      </React.Fragment>
    );
  }
  changeStatus(i) {
    let collegeList = this.state.collegeList;
    if (collegeList.results[i].status == "active") {
      collegeList.results[i].status = "inactive";
    } else if (collegeList.results[i].status == "inactive") {
      collegeList.results[i].status = "active";
    }
    let formData = new FormData();
    formData.append("status", collegeList.results[i].status);
    this.collegeAPI
      .updateCollegeStatus(collegeList.results[i].id, formData)
      .then(
        (res) => {
          if (res.status) {
            this.setState({ collegeList: collegeList });
          }
        }
      );
  }
  approveStudent(i) {
    let collegelist = this.state.collegeList;
    if (collegelist.results[i].status == "not_verified") {
      collegelist.results[i].status = "active";
    }
    let formData = new FormData();
    formData.append("college_id", collegelist.results[i].id);
    this.collegeAPI
      .updateStudentStatus(this.state.collegeList.results[i].id, formData)
      .then(
        (res) => {
          if (res.status) {
            this.setState({ collegeList: collegelist });
          }
        }
      );
  }
  statusTemplate(rowData) {
    let i = this.state.collegeList.results.indexOf(rowData);
    if (rowData.status == "not_verified") {
      return (
        <React.Fragment>
          <button className="btn-yellow" onClick={() => this.approveStudent(i)}>
            Verify
          </button>
        </React.Fragment>
      );
    } else if (rowData.status == "deleted") {
      return (
        <React.Fragment>
          <p>{collegeText.deleted}</p>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="d-flex flex-row justify-content-center">
            {rowData.user_id ? (
              <label className="customised-switch">
                <input
                  type="checkbox"
                  checked={
                    this.state.collegeList.results[i].status == "active"
                      ? true
                      : false
                  }
                  onChange={() => this.changeStatus(i)}
                />
                <span className="customised-slider customised-round"></span>
              </label>
            ) : (
              "Active"
            )}
          </div>
        </React.Fragment>
      );
    }
  }
  openDeleteModal = (id) => {
    this.setState({
      openmodal: true,
      modalmessage: "Are you sure you want to delete this College",
      id: id,
    });
  };
  deleteDetails(value, id, answer) {
    this.setState({
      openmodal: value,
    });
    if (answer === "yes") {
      let collegelist = this.state.collegeList;
      let currentList, i;
      this.collegeAPI.deleteCollegelist(id).then((res) => {
        if (res.status) {
          currentList = this.state.collegeList.results.filter(
            (element) => element.id == id
          );
          i = this.state.collegeList.results.indexOf(currentList[0]);
          if (collegelist.results[i].status == "active") {
            collegelist.results[i].status = "deleted";
          } else if (collegelist.results[i].status == "inactive") {
            collegelist.results[i].status = "deleted";
          } else if (collegelist.results[i].status == "not_verified") {
            collegelist.results[i].status = "deleted";
          }
          this.setState({ collegeList: collegelist });
        }
      });
    }
  }
  actionTemplate(rowData) {
    return (
      <React.Fragment>
        {rowData.status == "deleted" ? null : (
          <div className="d-flex flex-row align-items-center">
            {rowData.user_id ? (
              <NavLink to={`${url}/editcollege/${rowData.id}`}>
                {" "}
                <i class="fa-solid fa-pen-to-square me-3 text-black cursor-pointer"></i>
              </NavLink>
            ) : null}
            <i
              className="fa-solid fa-trash-can text-black cursor-pointer me-4"
              onClick={() => this.openDeleteModal(rowData.id)}
            ></i>
          </div>
        )}
      </React.Fragment>
    );
  }
  getSearchValue = (value) => {
    this.getCollegeList(
      1,
      value,
      this.state.subscription,
      this.state.status,
      this.state.college_type,
      true
    );
    this.setState({ searchvalue: value });
  };
  getSubscription = (e) => {
    if (e.target.value == "All type") {
      this.setState({ subscription: "" }, () => {
        this.getCollegeList(
          1,
          this.state.searchvalue,
          "",
          this.state.status,
          this.state.college_type,
          true
        );
      });
    } else {
      this.setState({ subscription: e.target.value }, () => {
        this.getCollegeList(
          1,
          this.state.searchvalue,
          e.target.value,
          this.state.status,
          this.state.college_type,
          true
        );
      });
    }
  };
  // getApproveStatus
  getApproveStatus = (e) => {
    if (e.target.value == "") {
      this.setState({ college_type: "" }, () => {
        this.getCollegeList(
          1,
          this.state.searchvalue,
          "",
          this.state.status,
          "",
          true
        );
      });
    } else {
      this.setState({ college_type: e.target.value }, () => {
        this.getCollegeList(
          1,
          this.state.searchvalue,
          this.state.subscription,
          this.state.status,
          e.target.value,
          true
        );
      });
    }
  };
  getStatus = (e) => {
    this.setState({ status: e.target.value }, () => {
      this.getCollegeList(
        1,
        this.state.searchvalue,
        this.state.subscription,
        e.target.value,
        this.state.college_type,
        true
      );
    });
  };
  render() {
    // 
    return (
      <div>
        <div className="studenthomepage-header d-flex flex-row">
          <Header searchValue={this.getSearchValue} />
        </div>
        <div className="d-flex flex-row align-items-center mt-4 pt-3 w-100">
          <div className="main-heading me-5 col-3">Create College</div>
          <div className=" col-1 pe-5">
            <NavLink
              to={`${url}/addcollege`}
              style={{ textDecoration: "none" }}
            >
              <div className="add-icon  ms-auto me-5">
                <i class="fa-solid fa-plus "></i>
              </div>
            </NavLink>
          </div>
          <div className="customFormAdmin mt-3 d-flex flex-row justify-content-center col-8">
            <div className="d-flex flex-row">
              <div className=" form-group  ">
                <select
                  className="custom-select-2"
                  onChange={this.getApproveStatus}
                >
                  <option value="">{collegeText.alllist}</option>
                  <option value="false">{collegeText.b2b}</option>
                  <option value="true">{collegeText.b2c}</option>
                </select>
              </div>
              <div className=" form-group ms-4 ">
                <select
                  className="custom-select-2"
                  onChange={this.getSubscription}
                >
                  {this.state.subscriptiontype.map((option) => (
                    <option value={option.subscription_type}>
                      {option.subscription_type}
                    </option>
                  ))}
                </select>
              </div>
              <div className=" form-group  ms-4">
                <select className="custom-select-2" onChange={this.getStatus}>
                  <option value="">{collegeText.status}</option>
                  <option value="active">{collegeText.active}</option>
                  <option value="inactive">{collegeText.inactive}</option>
                  <option value="deleted">{collegeText.delete}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div
          className="table-wrapper w-100"
          style={{ height: "calc(100vh - 180px)" }}
        >
          <DataTable
            value={this.state.collegeList.results}
            scrollable
            scrollHeight="100%"
          >
            <Column
              field="college_name"
              header={collegeText.collegename}
              body={this.nameTemplate}
            ></Column>
            <Column
              field="student_count"
              header={collegeText.numberofstudent}
            ></Column>
            <Column
              field="subscription_type"
              header={collegeText.subscription}
            ></Column>
            <Column
              field="status"
              header={collegeText.status}
              body={this.statusTemplate}
            ></Column>
            <Column
              field="id"
              header={collegeText.Action}
              body={this.actionTemplate}
            ></Column>
          </DataTable>
        </div>
        <Deletemodal
          message={this.state.modalmessage}
          value={this.state.openmodal}
          id={this.state.id}
          deletefun={this.deleteDetails}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    toast: state.toast,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    showtoast: (data) => {
      dispatch({ type: "ShowToast", value: data });
    },
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CollegeList));
// export default withRouter(CollegeList);

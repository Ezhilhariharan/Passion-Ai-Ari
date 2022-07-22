import React, { Component } from "react";
import { connect } from "react-redux";
import { 
  Route,
  Switch,
  NavLink, 
  withRouter,
} from "react-router-dom";
import "./styles/AdminLayout.scss";
import CollegeLayout from "./components/college/CollegeLayout";
import MentorLayout from "./components/mentor/MentorLayout";
import ExpertLayout from "./components/expert/ExpertLayout";
import StudentLayout from "./components/student/StudentLayout";
import CmsLayout from "./components/cms/CmsLayout";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import BulkImport from "./components/bulkImport/BulkImport";
import Department from "./components/department/Departmentlayout";
import EditDepartment from "./components/department/components/EditDepartment";
import Feed from "./components/feeds/Feedslayout";
import MentorProfile from "./components/profile/components/mentorProfile/MentorProfile";
import StudentProfile from "./components/profile/components/studentProfile/StudentProfile";
import { Toast } from "primereact/toast";
import { BlockUI } from "primereact/blockui";
import Department_Info from "./components/department/components/Department_info";
import bulk_admin from "../../assets/icons/bulk_admin.svg";
import dashboard from "../../assets/navbaricon/dashboard.svg";
import collegeSVG from "../../assets/navbaricon/college.svg";
import mentorSVG from "../../assets/navbaricon/mentor.svg";
import expertSVG from "../../assets/navbaricon/expert.svg";
import studentSVG from "../../assets/navbaricon/student.svg";
import feedsSVG from "../../assets/navbaricon/feeds.svg";
import cmsSVG from "../../assets/navbaricon/cms.svg";
import departmentSVG from "../../assets/navbaricon/department.svg";
let url
class AdminLayout extends Component {
  constructor(props) {
    super(props);
    url = this.props.match.path;
    this.state = {
      user_type: "",
      toastText: "",
      blockedLayer: true,
      loading: "",
      blockedPanel: false,
    };
    this.showSuccess = this.showSuccess.bind(this);
    this.ShowLoading = this.ShowLoading.bind(this);
    this.blockRef = React.createRef();
  } 
  componentDidMount() {
    let passion_usertype = localStorage.getItem("passion_usertype");   
    this.setState({ user_type: passion_usertype });
  }
  componentDidUpdate(prevProps, prevState) {
    if (!this.props.user.isLoggedIn) {
      this.props.history.push("/login");
    }
    if (
      this.props.toast.text.length !== 0 &&
      this.props.toast.time !== 0 &&
      prevProps.toast.time !== this.props.toast.time
    ) {
      this.showSuccess();
    }
    if (prevProps.loading.loadingState !== this.props.loading.loadingState) {
      // 
      this.ShowLoading();
      // this.forceUpdate();
    }
    if (!this.props.user.isLoggedIn) {
      // console.log("login from adminlayout")
      this.props.history.push("/login");
    }
  }
  componentDidUpdate() {
    if (!this.props.user.isLoggedIn) {
      this.props.history.push("/login");
    }
  }
  showSuccess() {
    this.toast.show({
      severity: "success",
      summary: this.props.toast.text,
      life: 5000,
    });
  }
  ShowLoading() {
    this.setState({
      blockedPanel: !this.state.blockedPanel,
      loading: this.props.loading.loadingState,
    });
  }
  render() {
    // 
    return (
      <div>
        {this.state.blockedPanel && (
          <BlockUI blocked={this.state.blockedLayer} fullScreen />
        )}
        <div className="adminLayout">
          {/* {
            this.state.blockedPanel ?
              <div className="spinner-parent">
                <Spinner />
              </div>
              : null
          } */}
          <Toast ref={(el) => (this.toast = el)} />
          <header>
            <nav className="sideNav">
              <NavLink exact activeClassName="active" to={`${url}`}>
                <img src={dashboard} />
              </NavLink>
              {this.state.user_type == 1 ? (
                <>
                  <NavLink activeClassName="active" to={`${url}/colleges`}>
                    <img src={collegeSVG} />
                  </NavLink>
                  <NavLink activeClassName="active" to={`${url}/mentors`}>
                    <img src={mentorSVG} />
                  </NavLink>
                  <NavLink activeClassName="active" to={`${url}/experts`}>
                    <img src={expertSVG} />
                  </NavLink>
                  <NavLink activeClassName="active" to={`${url}/students`}>
                    <img src={studentSVG} />
                  </NavLink>
                  <NavLink exact activeClassName="active" to={`${url}/feeds`}>
                    <img src={feedsSVG} />
                  </NavLink>
                </>
              ) : null}
              {this.state.user_type == 1 ? (
                <>
                  <NavLink activeClassName="active" to={`${url}/cms`}>
                    <img src={cmsSVG} />
                  </NavLink>
                </>
              ) : null}
              {this.state.user_type == 2 ? (
                <>
                  <NavLink activeClassName="active" to={`${url}/department`}>
                    <img src={departmentSVG} />
                  </NavLink>
                </>
              ) : null}
              {this.state.user_type == 3 ? (
                <>
                  <NavLink activeClassName="active" to={`${url}/students`}>
                    <img src={studentSVG} />
                  </NavLink>
                  <NavLink
                    exact
                    activeClassName="active"
                    to={`${url}/bulk-import`}
                  >
                    <img src={bulk_admin} />
                  </NavLink>
                </>
              ) : null}
            </nav>
          </header>
          <Switch>
            <Route exact path={`${url}`} component={DashboardLayout} />
            <main className="container">
              {this.state.user_type == 1 ? (
                <>
                  <Route path={`${url}/colleges`} component={CollegeLayout} />
                  <Route path={`${url}/mentors`} component={MentorLayout} />
                  <Route path={`${url}/experts`} component={ExpertLayout} />
                  <Route path={`${url}/cms`} component={CmsLayout} />
                  <Route path={`${url}/students`} component={StudentLayout} />
                  <Route path={`${url}/feeds`} component={Feed} />
                </>
              ) : null}
              {this.state.user_type == 2 ? (
                <>
                  <Route
                    path={`${url}/department/info/:id`}
                    component={Department_Info}
                  />
                  <Route path={`${url}/department`} component={Department} />
                  <Route
                    path={`${url}/college/edit/:id`}
                    component={EditDepartment}
                  />
                </>
              ) : null}
              {this.state.user_type == 3 ? (
                <>
                  <Route path={`${url}/bulk-import`} component={BulkImport} />
                  <Route path={`${url}/students`} component={StudentLayout} />
                </>
              ) : null}
              <Route
                path={`${url}/mentors/profile/:username`}
                component={MentorProfile}
              />
              <Route
                path={`${url}/experts/profile/:username`}
                component={MentorProfile}
              />
              <Route
                path={`${url}/experts/studentprofile/:username`}
                component={StudentProfile}
              />
              <Route
                path={`${url}/mentors/studentprofile/:username`}
                component={StudentProfile}
              />
              <Route
                path={`${url}/students/profile/:username`}
                component={StudentProfile}
              />
              <Route
                path={`${url}/department/studentprofile/:username`}
                component={StudentProfile}
              />
            </main>
          </Switch>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    toast: state.toast,
    loading: state.loading,
  };
};
export default connect(mapStateToProps)(withRouter(AdminLayout));

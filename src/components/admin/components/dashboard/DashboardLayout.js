import React, { Component } from "react";
import { withRouter } from "react-router";
import CollegeDashBoard from "./components/collegeDashBoard/CollegeDashBoard";
import MasterDashBoard from "./components/masterDashBoard/MasterDashBoard";
let passion_usertype;
class DashboardLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDashboard: true,
      usertype: "",
    };
  }
  componentDidMount() {
    passion_usertype = localStorage.getItem("passion_usertype");    
    this.setState({ usertype: passion_usertype });  
  }
  render() {
    const layout = () => {
      switch (this.state.usertype) {
        case "1":
          return <MasterDashBoard />;
        case "2":
          return <CollegeDashBoard />;
        case "3":
          return <CollegeDashBoard />;
        default:
        // return <center className="mt-4"><h1>Server not found</h1></center>;
      }
    };
    return (
      <div className="dashboard-component">       
        {this.state.usertype !== "" ? layout() : null}
      </div>
    );
  }
}
export default withRouter(DashboardLayout);

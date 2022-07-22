import React, { Component } from "react";
import StudentHomePage from "./studenthome/screens/StudentHomFeed";
import Mentorhome from "./mentor_home/screen/Mentor_home";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeprofile: null,
      usertype: null,
    };
  }
  componentDidMount() {
    let _usertype = localStorage.getItem("passion_usertype");    
    const { usertype } = this.state;
    if (usertype === null) {
      this.setState({ usertype: _usertype });
    }
    if (usertype == 5) {
      this.setState({ changeprofile: false });
    } else {
      this.setState({ changeprofile: true });
    }
  }
  render() {   
    const { usertype } = this.state;
    const layout = () => {
      switch (usertype) {
        case "4":
        case "5":
          return <Mentorhome />;
        case "6":
          return <StudentHomePage />;
        default:
          return <h1>Page not found</h1>;
      }
    };
    return (
      <div>      
        {usertype !== null ? layout() : ""}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps)(withRouter(Home));

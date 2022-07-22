import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import MentorProfile from "./components/mentorProfile/MentorProfile";
import StudentProfile from "./components/studentProfile/StudentProfile";
import "./styles/ProfileLayout.scss";
import { API } from "./utils/Api";
let url, username, usertype, params, user_type, paramsname;
class ProfileLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderProfile: "",
      username: "",
    };
    url = this.props.match.path;
    username = this.props.match.params.username;
    url = url.replace("/" + url.split("/").splice(-2).join("/"), "");
    params = username.split("&");
    paramsname = params[0];
    user_type = params[1];
    // 
  }
  componentDidMount() {
    this.setState({ username: paramsname });
  }
  render() {
    const layout = () => {
      switch (user_type) {
        case "student":
          return <StudentProfile username={this.state.paramsname} />;
        case "mentor":
          return (
            <MentorProfile
              username={this.state.paramsname}
              usertype={user_type}
            />
          );
        case "expert":
          return (
            <MentorProfile
              username={this.state.paramsname}
              usertype={user_type}
            />
          );
        default:
          return (
            <center>
              <h1>User Not Found</h1>
            </center>
          );
      }
    };
    return (
      <div>
        {/* {usertype !== null ? layout() : ""} */}
        <Switch>
          {/* <Route exact path={`${url}`} component={CollegeList} /> */}
          <Route
            exact
            path={`${url}/mentor`}
            render={() => (
              <MentorProfile
                username={this.state.paramsname}
                usertype={user_type}
              />
            )}
          />
          <Route
            exact
            path={`${url}/student`}
            render={() => <StudentProfile username={this.state.paramsname} />}
          />
          {/* <Route exact path={`${url}/editcollege/:collegeID`} component={EditCollege} /> */}
        </Switch>
      </div>
    );
  }
}
export default withRouter(ProfileLayout);

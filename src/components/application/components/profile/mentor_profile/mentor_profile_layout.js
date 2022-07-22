import React, { Component } from "react";
import {
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import StudentProfile from "../student_profile/StudentProfile";
import MentorProfile from "./MentorProfile";
let url;
class Mentor_profile_layout extends Component {
  constructor(props) {
    super(props);
    url = this.props.match.path;    
  }
  render() {
    return (
      <div>
        <Switch>
          <Route exact path={`${url}`} render={() => <MentorProfile />} />
          <Route exact path={`${url}/:username`} component={StudentProfile} />
        </Switch>
      </div>
    );
  }
}
export default withRouter(Mentor_profile_layout);

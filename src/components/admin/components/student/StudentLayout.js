import React, { Component } from "react";
import {
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import StudentList from "./components/studentList/StudentList";
let url;
class StudentLayout extends Component {
  constructor(props) {
    super(props);
    url = this.props.match.path;
  }
  render() {
    return (
      <div>
        <Switch>
          <Route exact path={`${url}`} component={StudentList} />
          <Route exact path={`${url}/:MentorID`} component={StudentList} />
        </Switch>
      </div>
    );
  }
}
export default withRouter(StudentLayout);

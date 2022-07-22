import React, { Component } from "react";
import {
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import MentorList from "./components/mentorList/MentorList";
import AddMentor from "./components/addMentor/AddMentor";
import EditMentor from "./components/editMentor/EditMentor";
let url;
class CollegeLayout extends Component {
  constructor(props) {
    super(props);
    url = this.props.match.path;
  }
  render() {
    return (
      <div>
        <Switch>
          <Route exact path={`${url}`} component={MentorList} />
          <Route exact path={`${url}/addmentor`} component={AddMentor} />
          <Route
            exact
            path={`${url}/editmentor/:MentorID`}
            component={EditMentor}
          />
        </Switch>
      </div>
    );
  }
}
export default withRouter(CollegeLayout);

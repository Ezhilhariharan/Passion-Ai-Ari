import React, { Component } from "react";
import {
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import CollegeList from "./components/collegeList/CollegeList";
import AddCollege from "./components/addCollege/AddCollege";
import EditCollege from "./components/editCollege/EditCollege";
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
          <Route exact path={`${url}`} component={CollegeList} />
          <Route exact path={`${url}/addcollege`} component={AddCollege} />
          <Route
            exact
            path={`${url}/editcollege/:collegeID`}
            component={EditCollege}
          />
        </Switch>
      </div>
    );
  }
}
export default withRouter(CollegeLayout);

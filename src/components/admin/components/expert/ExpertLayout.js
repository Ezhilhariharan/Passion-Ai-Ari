import React, { Component } from "react";
import { 
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import ExpertList from "./components/expertList/ExpertList";
import AddExpert from "./components/addexpert/AddExpert";
import EditExpert from "./components/editexpert/EditExpert";
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
          <Route exact path={`${url}`} component={ExpertList} />
          <Route exact path={`${url}/addexpert`} component={AddExpert} />
          <Route
            exact
            path={`${url}/editexpert/:MentorID`}
            component={EditExpert}
          />
        </Switch>
      </div>
    );
  }
}
export default withRouter(CollegeLayout);

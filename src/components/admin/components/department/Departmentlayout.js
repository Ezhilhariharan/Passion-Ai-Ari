import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DepartmentList from "./components/Department";
class Departmentlayout extends Component {
  constructor(props) {
    super(props);   
  }
  render() {
    return (
      <div>
        <Switch>
          <Route exact path={"/admin/department"} component={DepartmentList} />  
        </Switch>
      </div>
    );
  }
}
export default Departmentlayout;

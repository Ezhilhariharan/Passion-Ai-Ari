import React, { Component } from "react";
import {
  Route,
  Switch,
  NavLink,
  Redirect,
  withRouter,
} from "react-router-dom";
import { cmsText } from "./Const_CMS";
import HomePageContent from "./components/homePageContent/HomePageContent";
import Industry from "./components/industry/Industry";
import ConfigureReport from "./components/configureReport/ConfigureReport";
import Course from "./components/course/Course.js";
import Header from "../../../navbar/header/Header";
import "./styles/CmsLayout.scss";
let url;
class CmsLayout extends Component {
  constructor(props) {
    super(props);
    url = this.props.match.path;
    this.state = {
      searchValue: "",
    };
  }
  getSearchValue = (value) => {     
    this.setState({ searchValue: value });
  };
  render() {   
    return (
      <div>
        <div className="studenthomepage-header d-flex flex-row">
          <Header searchValue={this.getSearchValue} />
        </div>
        <p className="main-heading mt-4 pt-3"> {cmsText.cmstitle}</p>
        <div className="cms-card">
          <div className="cms-navbar ">
            <NavLink to={`${url}/homepage`}>{cmsText.homepage}</NavLink>
            <NavLink to={`${url}/industry`}>{cmsText.industry}</NavLink>
            <NavLink to={`${url}/configurereport`}>
              {cmsText.configurereport}
            </NavLink>
            <NavLink to={`${url}/course`}>{cmsText.course}</NavLink>
          </div>
          <div className="cms-content-wrapper">
            <Switch>
              <Redirect exact from={`${url}`} to={`${url}/homepage`} />
              <Route
                exact
                path={`${url}/homepage`}
                component={HomePageContent}
              />
              <Route
                exact
                path={`${url}/industry`}
                render={() => <Industry searchValue={this.state.searchValue} />}
              />
              <Route
                exact
                path={`${url}/configurereport`}
                component={ConfigureReport}
              />
              <Route exact path={`${url}/course`} component={Course} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(CmsLayout);

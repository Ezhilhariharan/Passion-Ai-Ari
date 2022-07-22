import React, { Component } from "react";
import SelectIndustry from "./components/select_industry/screens/SelectIndustry.js";
import CarrierPath from "./components/carrier_path/screens/CarrierPath";
import Profile from "./components/profile/Profile";
import SettingUser from "./components/setting/screens/SettingUser";
import Home from "./components/home/UserHome";
import Appointment from "./components/appointment/screens/Appointment";
import Stages from "./components/course/screens/Stages";
import Mobilecareerpath from "../careerpathvideo/mobilecareervide/Mobilecareerpath";
import Chat from "./components/chat/Chat";
import NotFound from "./components/404/NotFound";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
let image;
let storagetoken;
let decodedtoken;
class User_Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showlogin: true,
      // changeprofile: true,
      imageurl: "",
      authenticated: true,
      industrydata: {},
    };
  }
  componentDidMount() {
    image = localStorage.getItem("passion_image");
    storagetoken = localStorage.getItem("passion_token");
    if (
      storagetoken === null ||
      storagetoken === undefined ||
      storagetoken === ""
    ) {
      this.setState({ authenticated: true });
    } else {
      this.setState({ authenticated: false });
      decodedtoken = jwt_decode(storagetoken);
      this.setState({ imageurl: image });
    }
  }
  componentDidUpdate() {
    if (!this.props.user.isLoggedIn) {
      this.props.history.push("/login");
    }
  }
  Updateprofile = (someArg) => {
    // 
    this.setState({ imageurl: someArg });
  };
  getFilterindustrydata = (data) => {
    // 
    this.setState({ industrydata: data });
  };
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/carrerpath" render={() => <CarrierPath />} />
          <Route
            path="/selectindustry"
            render={() => (
              <SelectIndustry industrydata={this.state.industrydata} />
            )}
          />
          <Route
            path="/selectcareer"
            render={() => (
              <Mobilecareerpath
                filterindustrydata={this.getFilterindustrydata}
              />
            )}
          />
          <Route path={"/home/:id"} component={Home} />
          <Route path="/home" render={() => <Home />} />
          <Route path="/course" render={() => <Stages />} />
          <Route path="/appointment/:id" render={() => <Appointment />} />
          <Route path="/appointment/" render={() => <Appointment />} />
          <Route path="/profile" render={() => <Profile />} />
          <Route path={"/setting/:id"} component={SettingUser} />
          <Route path="/setting" render={() => <SettingUser />} />
          <Route path="/chat" component={Chat} />
          <Route path="/*" component={NotFound} />
        </Switch>
      </Router>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps)(withRouter(User_Layout));

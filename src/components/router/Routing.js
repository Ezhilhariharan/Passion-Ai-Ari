import React, { Component } from "react";
import Login from "../sign_in_up/login/Login";
import Register from "../sign_in_up/register/RegisterLayout";
import ForgotPassword from "../sign_in_up/forgot_password/ForgotPassword";
import AdminLayout from "../admin/AdminLayout";
import {
  BrowserRouter as Router,
  Switch,
  Route, 
} from "react-router-dom";
import LandingPage from "components/landing/LandingPage.js";
import UserLayout from "../application/User_Layout";
import Check from "../sign_in_up/register/register_id/IdSetup";
import { connect } from "react-redux";
import { BlockUI } from "primereact/blockui";
import Spinner from "../passionspinner/PassionSpinner";
import { Toast } from "primereact/toast";
import TermsandConditions from "components/landing/components/terms and conditions/TermsandConditions";
import DataPolicy from "../landing/components/datapolicy/DataPolicy";
class Routing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registeroauthname: "",
      registeroauthemail: "",
      blockedPanel: false,
      blockedLayer: true,
    };
    this.sendOauthDataToRegister = this.sendOauthDataToRegister.bind(this); 
    this.showSuccess = this.showSuccess.bind(this);
    this.ShowLoading = this.ShowLoading.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.toast.text.length !== 0 &&
      this.props.toast.time !== 0 &&
      prevProps.toast.time !== this.props.toast.time
    ) {
      this.showSuccess();
    }
    if (prevProps.loading.loadingState !== this.props.loading.loadingState) {
      this.ShowLoading();
    }
  }
  sendOauthDataToRegister(name, email) {
    this.setState({ registeroauthname: name, registeroauthemail: email });
  }
  showSuccess() {
    this.toast.show({
      severity: "success",
      summary: this.props.toast.text,
      life: 5000,
    });
  }
  ShowLoading() {
    this.setState({
      blockedPanel: !this.state.blockedPanel,
      loading: this.props.loading.loadingState,
    });
  }
  render() {
    // 
    return (
      // <div>
      <Router>
        {this.state.blockedPanel && (
          <BlockUI blocked={this.state.blockedLayer} fullScreen />
        )}
        <div className="Layout">
          <Toast ref={(el) => (this.toast = el)} />
          {this.state.blockedPanel ? (
            <div className="spinner-parent">
              <Spinner />
            </div>
          ) : null}
          <Switch>
            <Route exact path="/" render={() => <LandingPage />} />
            <Route
              path="/login"
              render={() => <Login toregister={this.sendOauthDataToRegister} />}
            />
            <Route
              path="/register"
              render={() => (
                <Register
                  OauthName={this.state.registeroauthname}
                  OauthEmail={this.state.registeroauthemail}
                  // parenttochild={this.passdata}
                />
              )}
            />
            <Route path="/check" render={() => <Check />} />
            <Route path="/forgotpassword/" render={() => <ForgotPassword />} />
            <Route path="/admin" render={() => <AdminLayout />} />
            <Route path="/terms" component={TermsandConditions} />
            <Route path="/datapolicy" component={DataPolicy} />
            <Route path="/*" render={() => <UserLayout />} />
          </Switch>
        </div>
      </Router>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    loading: state.loading,
    toast: state.toast,
  };
};
export default connect(mapStateToProps)(Routing);

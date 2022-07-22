import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles/notfound.scss";
class NotFound extends Component { 
  render() {
    return (
      <div className="not-found-layout">
        <h1>404 NOT FOUND</h1>
        <p>
          The page you seem to be looking for does not exist. Please follow
          proper buttons to navigate around the website rather than directly
          using the URL bar.
        </p>
        <button
          className="btn-white"
          onClick={() => this.props.history.goBack()}
        >
          Go Back
        </button>
      </div>
    );
  }
}
export default withRouter(NotFound);

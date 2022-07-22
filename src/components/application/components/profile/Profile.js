import React, { Component } from "react";
import StudentProfile from "../profile/student_profile/StudentProfile";
import Mentorprofilelayout from "../profile/mentor_profile/mentor_profile_layout";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeprofile: null,
      imageurlpass: "",
    };
  }
  handleToUpdate = (someArg) => {
    this.setState({ imageurlpass: someArg });
    this.props.Updateprofile(this.state.imageurlpass);
  };
  Update = (someArg) => {
    this.setState({ imageurlpass: someArg });
    this.props.Updateprofile(this.state.imageurlpass);
  };
  componentDidMount() {
    let usertype = localStorage.getItem("passion_usertype");
    if (usertype == 5 || usertype == 4) {
      this.setState({ changeprofile: false });
    } else {
      this.setState({ changeprofile: true });
    }
  }
  render() {
    return (
      <div>
        {this.state.changeprofile ? (
          <StudentProfile handleToUpdate={this.handleToUpdate} />
        ) : (
          <Mentorprofilelayout />
        )}
      </div>
    );
  }
}

import instance from "services/Instance";
let industry_id;
export class profileAPI {
  getMentorProfile() {
    return instance
      .get("users/profile/")
      .then((res) => {
        // 
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  getstudentprofile(studentname) {
    return new Promise((success, error) => {
      instance
        .get("users/profile/", { params: { username: studentname } })
        .then((res) => {
          success(res);
          industry_id = res.data.industry_id;
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  getstudentappointment(studentname) {
    // 
    return new Promise((success, error) => {
      instance
        .get("users/profile/get_student_appointment/", {
          params: { username: studentname },
        })
        .then((res) => {
          success(res);
          // 
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  getstudentgraphview(studentname, course_id) {
    // 
    return new Promise((success, error) => {
      instance
        .get("users/manage_user_course/get_graph_view/", {
          params: { username: studentname, course_id: course_id },
        })
        .then((res) => {
          success(res);
          // 
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  getstudentquestion(industry_id) {
    return instance
      .get("users/configure_report/get_ques_ans/", {
        params: { user_id: industry_id },
      })
      .then((res) => {
        // 
        return res;
        // 
      })
      .catch((err) => {
        return [];
      });
  }
  getTopiclearned(studentname) {
    // 
    return new Promise((success, error) => {
      instance
        .get("users/manage_topics_learned/get_topics_learned/", {
          params: { username: studentname },
        })
        .then((res) => {
          success(res);
          // 
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  getAppointmentMeetLink(id) {
    return instance
      .get(`users/manage_appointment/${id}/join/`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
}

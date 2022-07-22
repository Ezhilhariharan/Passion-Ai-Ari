import axios from "axios";
import instance from "services/Instance";
export class studentprofileAPI {
  getStudentProfile() {
    return instance
      .get("users/profile/") //student
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  getGraphView() {
    return instance
      .get("users/manage_user_course/get_graph_view/")
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  getAnalysis() {
    if (typeof axios.defaults.headers.common["Authorization"] === "undefined") {
      axios.defaults.headers.common["Authorization"] =
        "Token " + localStorage.getItem("passion_token");
    }
    return instance
      .get("student/get_analysis/")
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  getTopiclearned(userName) {
    return instance
      .get("users/manage_topics_learned/get_topics_learned/", {
        params: { username: userName },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  getComments() {
    return instance
      .get("users/configure_report/get_ques_ans/")
      .then((res) => {
        // 
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  StudentApprovelPatch(formData) {
    return instance
      .patch("users/configure_report/approve_comments/", formData)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  PatchMethod_StudentConfigureReport(id, formData) {
    return instance
      .patch(`users/configure_report/${id}/`, formData)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  // post datas
  PostMethod_Studentconfigure_report(formData) {
    return instance
      .post("users/configure_report/", formData)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
}

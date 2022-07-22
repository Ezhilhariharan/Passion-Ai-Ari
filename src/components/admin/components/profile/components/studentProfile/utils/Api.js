import instance from "services/Instance";
export class API {
  getstudentinfo(user_name) {
    return new Promise((success, reject) => {
      instance
        .get("admin/profile/", { params: { username: user_name } }) // admin
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  getstudentgraphview(studentname, course_id) {
    return new Promise((success, error) => {
      instance
        .get("admin/manage_course/get_graph_view/", {
          params: { username: studentname },
        })
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  getstudentquestion(industry_id) {
    return instance
      .get("admin/manage_student_review_question/get_ques_ans/", {
        params: { user_id: industry_id },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getTopiclearned(studentname) {
    return new Promise((success, error) => {
      instance
        .get("admin/manage_topics_learned/get_topics_learned/", {
          params: { username: studentname },
        })
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
}

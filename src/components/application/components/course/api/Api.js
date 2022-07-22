import instance from "services/Instance";
export class courseAPI {
  getCourse() {
    return instance
      .get("users/manage_user_course/get_course/")
      .then((res) => {
        return res;
        // 
      })
      .catch((err) => {
        return [];
      });
  }
  updatestartstage() {
    return new Promise((success, error) => {
      instance
        .post("student/start_stage/")
        .then((res) => {
          success(res);
          // 
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  contentUpdater(value) {
    // 
    return new Promise((success, error) => {
      instance
        .patch("users/manage_user_course/content_updater/", value)
        .then((res) => {
          success(res);
          // 
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  startStage(value) {
    return new Promise((success, error) => {
      instance
        .post("users/manage_user_course/start_stage/", value)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  lastVideoUpdater(value) {
    return new Promise((success, error) => {
      instance
        .patch("users/manage_user_course/last_video_updater/", value)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  stageUpdater(value) {
    return new Promise((success, error) => {
      instance
        .patch("users/manage_user_course/stage_updater/", value)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  feedBack(value) {
    return new Promise((success, error) => {
      instance
        .post("users/create_feedback/", value)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
}

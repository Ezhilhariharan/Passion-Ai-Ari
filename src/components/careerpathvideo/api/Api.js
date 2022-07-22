import instance from "services/Instance";
export class API {
  getQuestion() {
    return new Promise((success, reject) => {
      instance
        .get("users/manage_pttest/")
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  submitAnswer(value) {
    return new Promise((success, reject) => {
      instance
        .post("users/manage_pttest/analyse_pttest_result/", value)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

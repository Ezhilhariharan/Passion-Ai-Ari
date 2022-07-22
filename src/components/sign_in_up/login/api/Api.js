import instance from "services/Instance";
export class API {
  login(value) {
    return new Promise((success, reject) => {
      instance
        .post("auth/login/", value)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  Noification(value) {
    return instance
      .get("user_notification/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
}

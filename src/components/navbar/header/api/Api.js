import instance from "services/Instance";
export class API {
  logout(data, passionuserid) {
    return new Promise((success, error) => {
      instance
        .post("auth/logout/")
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
}

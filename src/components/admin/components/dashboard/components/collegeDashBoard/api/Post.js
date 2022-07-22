import instance from "services/Instance";
export class postAPI {
  logout() {
    return new Promise((success, reject) => {
      instance
        .post("auth/logout/")
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
}

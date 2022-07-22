import instance from "services/Instance";
export class API {
  forgotPassword(value) {
    return instance
      .post("auth/forgot_password/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  submitForgotPassword(value) {
    return instance
      .post("auth/forgot_password/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
}

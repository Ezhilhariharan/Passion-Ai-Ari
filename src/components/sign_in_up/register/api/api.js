import instance from "services/Instance";
export class API {
  signUp(values) {
    return new Promise((success, reject) => {
      instance
        .post("auth/register/", values)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  collegeList() {
    return new Promise((success, reject) => {
      instance
        .get("auth/get_colleges/")
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  departmentList(value) {
    return new Promise((success, reject) => {
      instance
        .get("auth/get_departments/", { params: { college_id: value } })
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  verifyOtp(value) {
    return new Promise((success, reject) => {
      instance
        .post("auth/verify_otp/", value)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  resendOtp(value) {
    return new Promise((success, reject) => {
      instance
        .post("auth/resend_otp/", value)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

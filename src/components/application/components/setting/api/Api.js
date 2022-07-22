import instance from "services/Instance";
export class SettingAPI {
  EditName(data, passionuserid) {
    return new Promise((success, error) => {
      instance
        .patch(`users/profile/${passionuserid}/`, data)
        .then((res) => {
          // 
          // 
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  EditGmail(data, passionuserid) {
    return new Promise((success, error) => {
      instance
        .patch("users/profile/update_email/", data)
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  Editphonenumber(data, passionuserid) {
    return new Promise((success, error) => {
      instance
        .patch("users/profile/change_old_number/", data)
        .then((res) => {
          // 
          // 
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  EditPicture(data, passionuserid) {
    return new Promise((success, error) => {
      instance
        .patch(`users/profile/${passionuserid}/`, data)
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  EditUserName(data, passionuserid) {
    return new Promise((success, error) => {
      instance
        .patch(`users/profile/${passionuserid}/`, data)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  GetProfileDetails() {
    return new Promise((success, error) => {
      instance
        .get("users/profile/")
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  // patch method apis
  PatchChangeIndustry() {
    return new Promise((success, error) => {
      instance
        .patch("users/manage_industry/change_industry/")
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  // post methods
  PostOtpSettings(data) {
    return new Promise((success, error) => {
      instance
        .post("users/profile/confirm_new_number/", data)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  PostResendOtp() {
    return new Promise((success, error) => {
      instance
        .post("users/profile/change_number_resend_otp/")
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  PostEmailEditOtp(formDataemail) {
    return new Promise((success, error) => {
      instance
        .post("users/profile/verify_otp/", formDataemail)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  PostEmailResendOtp(formDataemail) {
    return new Promise((success, error) => {
      instance
        .post("users/profile/resend_otp/", formDataemail)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  PostResetPassword(formData) {
    return new Promise((success, error) => {
      instance
        .post("auth/reset_password/", formData)
        .then((res) => {
          success(res);
          // 
          // this.props.backto_accountdetails();
        })
        .catch((error) => {
        });
    });
  }
  logout() {
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

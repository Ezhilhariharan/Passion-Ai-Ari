import instance from "services/Instance";
export class CollegeAPI {
  getCollege(collegeID) {
    return new Promise((success, error) => {
      instance
        .get(`admin/manage_college/${collegeID}/`)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  subscription() {
    return new Promise((success, reject) => {
      instance
        .get("admin/manage_college/get_subscription_type/")
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  patchCollege(id, values, logo, document) {
    return new Promise((success, error) => {
      let formData = new FormData();
      formData.append("id", id);
      formData.append("name", values.name);
      formData.append("address", values.address);
      formData.append("mobile_no", values.mobile_no);
      formData.append("email", values.email);
      formData.append("student_limit", values.student_limit);
      formData.append("subscription_type", values.subscription_type);
      formData.append("contract_document", document);
      formData.append("logo", logo);
      for (let pair of formData.entries()) {
      }
      instance
        .patch(`admin/manage_college/${id}/`, formData)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
}

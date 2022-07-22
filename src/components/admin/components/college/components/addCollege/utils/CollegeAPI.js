import instance from "services/Instance";
export class CollegeAPI {
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
  postCollege(values, logo, document) {
    return new Promise((success, error) => {
      let formData = new FormData();
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
        .post("admin/manage_college/", formData)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
}

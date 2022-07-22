import instance from "services/Instance";
export class API {
  postExpert(values, logo) {
    return new Promise((success, reject) => {
      let formData = new FormData();
      formData.append("industry_id", values.industry_id);
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("company", values.company);
      formData.append("position", values.position);
      formData.append("mobile_no", values.mobile_no);
      formData.append("profile_image", logo);
      for (let pair of formData.entries()) {
      }
      instance
        .post("/admin/manage_experts/", formData)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

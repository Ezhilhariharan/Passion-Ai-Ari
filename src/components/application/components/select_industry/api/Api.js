import instance from "services/Instance";
export class API {
  getIndustry() {
    return new Promise((success, error) => {
      instance
        .get("users/manage_industry/get_industry/")
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  confirmIndustry(id) {
    return new Promise((success, error) => {
      instance
        .post("users/manage_industry/select_industry/", {
          industry_id: id,
        })
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
  getIndustryVideo(id) {
    return new Promise((success, error) => {
      instance
        .get(`users/manage_industry/${id}/`)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          error(err);
        });
    });
  }
}

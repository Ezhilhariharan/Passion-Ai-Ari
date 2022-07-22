import instance from "services/Instance";
export class API {
  getIndustries(name) {
    return new Promise((success, reject) => {
      instance
        .get("admin/manage_industry/", { params: { name: name } })
        .then((res) =>
          // 
          success(res)
        )
        .catch((err) => {
        });
    });
  }
  updateIndustryStatus(id, data) {
    return new Promise((success, reject) => {
      instance
        .patch(`admin/manage_industry/${id}/`, data)
        .then((res) => success(res))
        .catch((err) => {
        });
    });
  }
  deleteIndustryApi(data) {
    return new Promise((success, reject) => {
      instance
        .delete(`admin/manage_industry/${data}/`)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  createIndustry(data) {
    return new Promise((success, reject) => {
      instance
        .post("admin/manage_industry/", data)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  editIndustry(id, data) {
    return new Promise((success, reject) => {
      instance
        .patch(`admin/manage_industry/${id}/`, data)
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
        });
    });
  }
}

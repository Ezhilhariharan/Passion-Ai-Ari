import instance from "services/Instance";
export class API {
  getColleges(pagenum, searchValue, subscription, status, college_type) {   
        return new Promise((success, reject) => {
      instance
        .get(`admin/manage_college?page_no=${pagenum}`, {
          params: {
            name: searchValue,
            status: status,
            subscription: subscription,
            college_type: college_type,
          },
        })
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
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
  updateCollegeStatus(id, value) {
    return new Promise((success, reject) => {
      instance
        .patch(`admin/manage_college/${id}/`, value)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  updateStudentStatus(id, status) {
    return new Promise((success, reject) => {
      // `admin/manage_college/${id}/`
      instance
        .post("admin/manage_college/approve_college/", status)
        .then((res) => success(res))
        .catch((err) => reject(err));
    });
  }
  deleteCollegelist(id) {
    return new Promise((success, reject) => {
      instance
        .delete(`admin/manage_college/${id}/`)
        .then((res) => success(res))
        .catch((err) => reject(err));
    });
  }
}

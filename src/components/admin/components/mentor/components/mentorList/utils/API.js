import instance from "services/Instance";
export class API {
  getMentors(pagenum, searchValue, status) {
    return new Promise((success, reject) => {
      instance
        .get(`/admin/manage_mentors?page_no=${pagenum}`, {
          params: { name: searchValue, status: status },
        })
        .then((res) => {
          success(res);
        })
        .catch((err) => reject(err));
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
  updateMentorStatus(status) {
    return new Promise((success, reject) => {
      instance
        .patch("admin/common/update_user_status/", status)
        .then((res) => success(res))
        .catch((err) => reject(err));
    });
  }
  deleteMentor(id) {
    return new Promise((success, reject) => {
      let formData = new FormData();
      formData.append("status", "deleted");
      instance
        .patch(`admin/manage_mentors/${id}/`, formData)
        .then((res) => success(res))
        .catch((err) => reject(err));
    });
  }
}

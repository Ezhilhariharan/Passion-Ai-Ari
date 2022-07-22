import axios from "axios";
import instance from "services/Instance";
export class API {
  getExpert(pagenum, searchValue, status) {
    return new Promise((success, reject) => {
      instance
        .get(`/admin/manage_experts?page_no=${pagenum}`, {
          params: { name: searchValue, status: status },
        })
        .then((res) => {
          success(res);
        })
        .catch((err) => reject(err));
    });
  }
  updateMentorStatus(status) {
    return new Promise((success, reject) => {
      axios
        .patch("admin/common/update_user_status/", status)
        .then((res) => success(res))
        .catch((err) => reject(err));
    });
  }
  deleteMentor(id) {
    return new Promise((success, reject) => {
      let formData = new FormData();
      formData.append("status", "deleted");
      axios
        .patch(`admin/manage_experts/${id}/`, formData)
        .then((res) => success(res))
        .catch((err) => reject(err));
    });
  }
}

import axios from "axios";
import instance from "services/Instance";
export class patchAPI {
  updateMentorStatus(id, status) {
    // 
    return new Promise((success, reject) => {
      instance
        .patch(`admin/department_admin/${id}/`, status)
        .then((res) => success(res))
        .catch((err) => reject(err));
    });
  }
  editDepartment(values, id) {
    return new Promise((success, reject) => {
      instance
        .patch(`admin/department_admin/${id}/`, values)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

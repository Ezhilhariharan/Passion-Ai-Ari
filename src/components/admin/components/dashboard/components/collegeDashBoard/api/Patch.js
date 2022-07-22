import instance from "services/Instance";
export class patchAPI {
  editPassword(id, value) {
    return new Promise((success, reject) => {
      instance
        .patch(`admin/department_admin/${id}/`, value)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  editEmail(id, value) {
    return new Promise((success, reject) => {
      instance
        .patch(`admin/department_admin/${id}/`, value)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
}

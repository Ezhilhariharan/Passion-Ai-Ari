import axios from "axios";
import instance from "services/Instance";
import { decode as base64_decode, encode as base64_encode } from "base-64";
export class postAPI {
  addDepartment(values) {
    return new Promise((success, reject) => {
      let formData = new FormData();
      let encoded = base64_encode(values.password);
      formData.append("password", encoded);
      formData.append("name", values.name);
      formData.append("email", values.email);
      instance
        .post("admin/department_admin/", formData)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  editDepartment(id, value) {
    return new Promise((success, reject) => {
      instance
        .patch(`admin/manage_college/${id}/`, value)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  logout() {
    return new Promise((success, reject) => {
      instance
        .post("auth/logout/")
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
}

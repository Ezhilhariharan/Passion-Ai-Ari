import axios from "axios";
import instance from "services/Instance";
let user_id;
export class API {
  getDepartmentList() {
    return new Promise((success, reject) => {
      instance
        .get("admin/department_admin/")
        .then((res) => {
          // 
          success(res);
          user_id = res.data[0]?.user_id;
        })
        .catch((err) => {
        });
    });
  }
  getstudentList(user_id, pagenum) {
    return new Promise((success, reject) => {
      instance
        .get(`admin/common/get_student_details/?page_no=${pagenum}`, {
          params: { department_id: user_id },
        })
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  getDepartmentdetails(id) {
    // 
    return new Promise((success, reject) => {
      instance
        .get(`admin/department_admin/${id}/`)
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  getDepartmentdetails_graph(id) {    
    return new Promise((success, reject) => {
      instance
        .get("admin/department_admin/get_stage_vs_students/", {
          params: { department_id: id },
        })
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
        });
    });
  }
}

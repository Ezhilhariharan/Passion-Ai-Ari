import instance from "services/Instance";
export class API {
  getmentorinfo(user_name) {
    return new Promise((success, reject) => {
      instance
        .get(`admin/manage_mentors/${user_name}`)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  getmentorStudentlist(user_name, user_id, pagenum) {
    // 
    return new Promise((success, reject) => {
      instance
        .get(`admin/student_list/?page_no=${pagenum}`, {
          params: { mentor_id: user_id },
        })
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  getexpertinfo(user_name) {
    return new Promise((success, reject) => {
      instance
        .get(`admin/manage_experts/${user_name}`)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  getexpertStudentlist(user_name, user_id, pagenum) {
    // 
    return new Promise((success, reject) => {
      instance
        .get(`admin/student_list/?page_no=${pagenum}`, {
          params: { expert_id: user_id },
        })
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
}

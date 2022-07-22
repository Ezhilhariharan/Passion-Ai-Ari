import instance from "services/Instance";
export class API {
  getStudents(pagenum, searchValue, status, industry, college, stage) {
    let reqParam = {};
    if (searchValue !== "") {
      reqParam = { ...reqParam, name: searchValue };    
    }
    if (status !== "") {
      reqParam = { ...reqParam, user_status: status };    
    }
    if (industry !== "") {
      reqParam = { ...reqParam, industry: industry };      
    }
    if (college !== "") {
      reqParam = { ...reqParam, college: college };      
    }
    if (stage !== "") {
      reqParam = { ...reqParam, progress: stage };    
    }
    if (
      (stage === undefined,
      college === undefined,
      searchValue === undefined,
      status === undefined,
      industry === undefined)
    ) {
      reqParam = { ...reqParam, page_no: pagenum };
    } else {
      reqParam = { ...reqParam, page_no: pagenum };
    }    
    return new Promise((success, reject) => {
      instance
        .get(`admin/common/get_student_details/`, { params: reqParam })
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getStudentsMain(pagenum, searchValue) {    
    return new Promise((success, reject) => {
            instance
        .get(`admin/common/get_student_details/?page_no=${pagenum}`, {
          params: { name: searchValue },
        })
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getIndustryList() {
    return new Promise((success, reject) => {
      instance
        .get("admin/manage_industry/")
        .then((res) => { 
          success(res);
        })      
    });
  }
  getCollegeList() {
    return new Promise((success, reject) => {
      instance
        .get("auth/get_colleges/")
        .then((res) => {         
          success(res);
        })       
    });
  }
  getDepartmentStudents(pagenum, department_id) {    
    return new Promise((success, reject) => {
      instance
        .get(`admin/common/get_student_details/?page_no=${pagenum}`, {
          params: { department_id: department_id },
        })
        .then((res) => {
          success(res); 
          console.log(res)                
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  updateStudentStatus(data) {
    return new Promise((success, reject) => {
      instance
        .patch("admin/common/update_user_status/", data)
        .then((res) => success(res))
        .catch((err) => reject(err));
    });
  }
  approveStudent(id, status) {
    return new Promise((success, reject) => {
      instance
        .patch(`admin/manage_users/${id}/`, status)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getUserId() {
    return new Promise((success, reject) => {
      instance
        .get("admin/department_admin/get_homepage/")
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

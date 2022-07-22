import instance from "services/Instance";
export class API {
  getDashboard() {
    return new Promise((success, reject) => {
      instance
        .get("admin/college_admin/get_dashboard/", {
          params: { type: "dashboard" },
        })
        .then((res) => {          
          success(res);
        })      
    });
  }
  getCompleted_vs_Ongoing() {
    return new Promise((success, reject) => {
      instance
        .get("admin/college_admin/get_dashboard/", {
          params: { type: "completed_vs_ongoing" },
        })
        .then((res) => {         
          success(res);
        })     
    });
  }
  getBarGraphData() {
    return new Promise((success, reject) => {
      instance
        .get("/admin/college_admin/get_dashboard/", {
          params: { type: "studentVsstage" },
        })
        .then((res) => {       
          success(res);
        })
        .catch((err) => {
          reject(err);           
        });
    });
  }
  getdepartmentDashboard() {
    return new Promise((success, reject) => {
      instance
        .get("admin/department_admin/get_homepage/")
        .then((res) => {          
          success(res);
        })     
    });
  }
  getdepartmentcurrent_vs_completed(id) {
    return new Promise((success, reject) => {
      instance
        .get("admin/department_admin/get_current_vs_completed/", {
          params: { department_id: id },
        })
        .then((res) => {          
          success(res);
        })      
    });
  }
  getstage_vs_students(id) {
    return new Promise((success, reject) => {
      instance
        .get("admin/department_admin/get_stage_vs_students/", {
          params: { department_id: id },
        })
        .then((res) => {        
          success(res);
        })       
    });
  }
}

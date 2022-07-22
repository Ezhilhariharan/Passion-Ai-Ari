import instance from "services/Instance";
export class API {
  getIndustryList() {
    return new Promise((success, reject) => {
      instance
        .get("admin/manage_industry/")
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  getWebinarsandAppiontments() {
    return new Promise((success, reject) => {
      instance
        .get("admin/admin_dashboard/analysis/", {
          params: { type: "webinars_appiontments" },
        })
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  getCourse_Status() {
    return new Promise((success, reject) => {
      instance
        .get("admin/admin_dashboard/analysis/", {
          params: { type: "course_status" },
        })
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  getUsers_Count() {
    return new Promise((success, reject) => {
      instance
        .get("admin/admin_dashboard/analysis/", { params: { type: "users" } })
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  getStage_Analytics() {
    return new Promise((success, reject) => {
      instance
        .get("admin/admin_dashboard/analysis/", {
          params: { type: "stage_analytics" },
        })
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  getStar_Count(id) {
    return new Promise((success, reject) => {
      instance
        .get("admin/admin_dashboard/analysis/", {
          params: { type: "star_count", industry_id: id },
        })
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
        });
    });
  }
  getFeedback(industry_id) {
    return new Promise((success, reject) => {
      instance
        .get("admin/admin_dashboard/get_user_feedback/", {
          params: { industry_id: industry_id },
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

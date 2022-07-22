import instance from "services/Instance";
export class API {
  getCourse(industry_id) {
    return new Promise((success, reject) => {
      instance
        .get("admin/manage_course/get_course/", {
          params: { industry_id: industry_id },
        })
        .then((res) => {
          success(res);
        })
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
  getCourseContent(industry_id, stage_no, pagenum) {
    return new Promise((success, reject) => {
      instance
        .get(`admin/manage_course_content/?page_no=${pagenum}`, {
          params: { industry_id: industry_id, stage_no: stage_no },
        })
        .then((res) => {
          success(res);
        })
    });
  }
  reOrderList(value) {
    return new Promise((success, reject) => {
      instance
        .patch("admin/manage_course_content/reorder_course_stages/", value)
        .then((res) => {          
          success(res);
        })      
    });
  }
  CreateCourse(value) {
    return new Promise((success, reject) => {
      instance
        .post("admin/manage_course_content/", value)
        .then((res) => {        
          success(res);
        })       
    });
  }
  updateCourse(id, value) {
    return new Promise((success, reject) => {
      instance
        .patch(`admin/manage_course_content/${id}/`, value)
        .then((res) => {          
          success(res);
        })      
    });
  }
}

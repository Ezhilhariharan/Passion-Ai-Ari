import instance from "services/Instance";
export class API {
  getQuestion(industry_id) {
    return new Promise((success, reject) => {
      instance
        .get("admin/manage_student_review_question/get_review_questions/", {
          params: { industry_id: industry_id },
        })
        .then((res) => {          
          success(res);
        })     
    });
  }
  addQuestion(data) {
    return new Promise((success, reject) => {
      instance
        .post("admin/manage_student_review_question/", data)
        .then((res) => {
          success(res);
        })      
    });
  }
  getIndustryList(industry_id) {
    return new Promise((success, reject) => {
      instance
        .get("admin/manage_industry/")
        .then((res) => {       
          success(res);
        })       
    });
  }
  getTopicLearned(industry_id) {
    return new Promise((success, reject) => {
      instance
        .get("admin/manage_topics_learned/", {
          params: { industry_id: industry_id },
        })
        .then((res) => {          
          success(res);
        })        
    });
  }
  createTopicLearned(data) {    
    return new Promise((success, reject) => {
      instance
        .post("admin/manage_topics_learned/", data)
        .then((res) => {          
          success(res);
        })      
    });
  }
  updateTopicLearned(industry_id, data) {
    return new Promise((success, reject) => {
      instance
        .patch(`admin/manage_topics_learned/${industry_id}/`, data)
        .then((res) => {
          success(res);
        })      
    });
  }
  deleteTopicLearned(industry_id) {
    return new Promise((success, reject) => {
      instance
        .delete(`admin/manage_topics_learned/${industry_id}`)
        .then((res) => {
          // 
          success(res);
        })      
    });
  }
  deleteQuestion(industry_id) {
    return new Promise((success, reject) => {
      instance
        .delete(`admin/manage_student_review_question/${industry_id}/`)
        .then((res) => {
          success(res);
        })      
    });
  }
  editQuestion(data, industry_id) {    
    return new Promise((success, reject) => {
      instance
        .patch(`admin/manage_student_review_question/${industry_id}/`, data)
        .then((res) => {
          success(res);
        })       
    });
  }
}

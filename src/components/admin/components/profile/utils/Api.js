import axios from "axios";
export class API {
  getCourse(industry_id) {
    return new Promise((success, reject) => {
      axios
        .get("admin/get_course/", { params: { industry_id: industry_id } })
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
        });
    });
  }
}

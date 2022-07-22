import instance from "services/Instance";
export class API {
  getOneMentor(MentorUN) {
    return new Promise((success, reject) => {
      instance
        .get(`admin/manage_mentors/${MentorUN}/`)
        .then((res) => success(res))
        .catch((err) => reject(err));
    });
  }
  updateMentor(values, logo, MentorID) {
    return new Promise((success, reject) => {
      // for (let pair of formData.entries()) {
      //     
      // }
      instance
        .patch(`admin/manage_mentors/${MentorID}/`, values)
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

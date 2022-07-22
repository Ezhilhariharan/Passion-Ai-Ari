import instance from "services/Instance";
export class adminFeed {
  getStudentFeed(pagenumber, id) {
    let reqParam = {};
    if (id !== "") {
      reqParam = { ...reqParam, visibility: "student", industry_id: id };
    } else {
      reqParam = { ...reqParam, visibility: "student" };
    }
    return instance
      .get(`admin/feeds/?page_no=${pagenumber}`, { params: reqParam })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getMentorFeed(pagenumber, id) {
    let reqParam = {};
    if (id !== "") {
      reqParam = { ...reqParam, visibility: "mentor", industry_id: id };
    } else {
      reqParam = { ...reqParam, visibility: "mentor" };
    }
    return instance
      .get(`admin/feeds/?page_no=${pagenumber}`, { params: reqParam })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getCommunityFeed(pagenumber, id) {
    let reqParam = {};
    if (id !== "") {
      reqParam = { ...reqParam, visibility: "community", industry_id: id };
    } else {
      reqParam = { ...reqParam, visibility: "community" };
    }
    return instance
      .get(`admin/feeds/?page_no=${pagenumber}`, { params: reqParam })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getInitialStudentFeed(pagenumber, id) {
    let reqParam = {};
    if (id !== "") {
      reqParam = { ...reqParam, visibility: "student", industry_id: id };
    } else {
      reqParam = { ...reqParam, visibility: "student" };
    }
    return instance
      .get(`admin/feeds/?page_no=${pagenumber}`, { params: reqParam })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getInitialMentorFeed(pagenumber, id) {
    let reqParam = {};
    if (id !== "") {
      reqParam = { ...reqParam, visibility: "mentor", industry_id: id };
    } else {
      reqParam = { ...reqParam, visibility: "mentor" };
    }
    return instance
      .get(`admin/feeds/?page_no=${pagenumber}`, { params: reqParam })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getInitialCommunityFeed(pagenumber, id) {
    let reqParam = {};
    if (id !== "") {
      reqParam = { ...reqParam, visibility: "community", industry_id: id };
    } else {
      reqParam = { ...reqParam, visibility: "community" };
    }
    return instance
      .get(`admin/feeds/?page_no=${pagenumber}`, { params: reqParam })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getParser(value) {
    return instance
      .get("student/data-parser/", { params: { url: value } })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  filterStudentFeed(id) {
    return instance
      .get("admin/feeds/", {
        params: { visibility: "student", industry_id: id },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  filterMentorFeed(id) {
    return instance
      .get("admin/feeds/", {
        params: { visibility: "mentor", industry_id: id },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  filterCommunityFeed(id) {
    return instance
      .get("admin/feeds/", {
        params: { visibility: "community", industry_id: id },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getIndustryList(industry_id) {
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
}

import instance from "services/Instance";
export class BlogAPI {
  getBlogList(pagenum) {
    return instance
      .get(`admin/manage_blog/?page_no=${pagenum}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getTermsandCondition() {
    return instance
      .get("admin/common/terms_and_conditions/")
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getPrivacyPolicy() {
    return instance
      .get("admin/common/privacy_policy/")
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  delete(id) {
    return instance
      .delete(`admin/manage_blog/${id}/`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  postTermsAndCondition(value) {
    return instance
      .post("admin/common/terms_and_conditions/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  postPrivacypolicy(value) {
    return instance
      .post("admin/common/privacy_policy/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  createBlog(value) {
    return instance
      .post("admin/manage_blog/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  editBlog(id, value) {
    return instance
      .patch(`admin/manage_blog/${id}/`, value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
}

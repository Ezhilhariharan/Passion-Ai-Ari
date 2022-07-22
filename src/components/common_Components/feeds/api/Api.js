import instance from "services/Instance";
export class feedAPI {
  getFeedCmmnts(id) {
    return instance
      .get("users/feeds_comment/", { params: { feed_id: id } })
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  getAdminFeedCmmnts(id) {
    return instance
      .get("admin/feeds_comment/", { params: { feed_id: id } })
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  adminLike(value) {
    return instance
      .post("admin/feeds_like/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  adminUnLike(id) {
    return instance
      .delete(`admin/feeds_like/${id}/`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  userLike(value) {
    return instance
      .post("users/feeds_like/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  userUnLike(id) {
    return instance
      .delete(`users/feeds_like/${id}/`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  adminDelete(id) {
    return instance
      .delete(`admin/feeds/${id}/`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  userDelete(id) {
    return instance
      .delete(`users/feeds/${id}/`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  createAdminComment(value) {
    return instance
      .post("admin/feeds_comment/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  createUserComment(value) {
    return instance
      .post("users/feeds_comment/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
}

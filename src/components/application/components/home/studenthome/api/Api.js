// import axios from "axios";
import instance from "services/Instance";
export class feedAPI {
  getLocalFeed(pagenum) {
    return instance
      .get(`users/feeds/?page_no=${pagenum}`, {
        params: { visibility: "local" },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getGlobalFeed(pagenum) {
    return instance
      .get(`users/feeds/?page_no=${pagenum}`, {
        params: { visibility: "global" },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getcommunityFeed(pagenum) {
    return instance
      .get(`users/feeds/?page_no=${pagenum}`, {
        params: { visibility: "community" },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getAnalysis() {
    return instance
      .get("users/manage_user_course/get_analysis/")
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  deleteFeedCmmnts(id) {
    if (typeof instance.defaults.headers.common["Authorization"] === "undefined") {
      instance.defaults.headers.common["Authorization"] =
        "Token " + localStorage.getItem("passion_token");
    }
    return instance
      .delete(`users/feeds_comment/${id}/`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  getWebinar() {
    if (typeof instance.defaults.headers.common["Authorization"] === "undefined") {
      instance.defaults.headers.common["Authorization"] =
        "Token " + localStorage.getItem("passion_token");
    }
    return instance
      .get("users/manage_webinar/")
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  createWebinar(value) {
    return instance
      .post("users/manage_webinar/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  updateWebinar(id, value) {
    return instance
      .patch(`users/manage_webinar/${id}/`, value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  deleteWebinar(id, value) {
    return instance
      .delete(`users/manage_webinar/${id}/`, { data: value })
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  createFeed(value) {
    return instance
      .post("users/feeds/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  getParser(value) {
    return instance
      .get("student/data-parser/", { params: { url: value } })
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  editFeed(id, value) {
    return instance
      .patch(`users/feeds/${id}/`, value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  getMeetLink(id) {
    return instance
      .get(`users/manage_webinar/${id}/join/`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  AppointmentReschedule(formData) {
    return instance
      .post("users/manage_appointment/delete_reschedule/", formData)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  AppointmentDelete(formData) {
    return instance
      .post("users/manage_appointment/delete_reschedule/", formData)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  getAppointmentMeetLink(id) {
    return instance
      .get(`users/manage_appointment/${id}/join/`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
}

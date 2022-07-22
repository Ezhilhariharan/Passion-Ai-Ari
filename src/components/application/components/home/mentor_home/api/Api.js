import instance from "services/Instance";
export class mentorhome {
  gethomedata() {
    return instance
      .get("student/get_home/")
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getGlobalFeed() {
    return instance
      .get("users/feeds/")
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getcommunityFeed() {
    return instance
      .get("users/feeds/", { params: { visibility: "community" } })
      .then((res) => {
        // 
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  paginationGlobalFeed(pagenum) {
    return instance
      .get(`users/feeds/?page_no=${pagenum}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  paginationcommunityFeed(pagenum) {
    return instance
      .get(`users/feeds/?page_no=${pagenum}`, {
        params: { visibility: "community" },
      })
      .then((res) => {
        // 
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getmentorappointment() {
    return instance
      .get("users/manage_appointment/")
      .then((res) => {
        // 
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
  getmentorwebinar() {
    return instance
      .get("users/manage_webinar/")
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
  getAppointmentMeetLink(id) {
    return instance
      .get(`users/manage_appointment/${id}/join/`)
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
  createMentorFeed(value) {
    return instance
      .post("users/feeds/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
      });
  }
  editMentorFeed(id, value) {
    return instance
      .patch(`users/feeds/${id}/`, value)
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
      })
      .catch((err) => {
      });
  }
  AppointmentDelete(formData) {
    return instance
      .post("users/manage_appointment/delete_reschedule/", formData)
      .then((res) => {
      })
      .catch((err) => {
      });
  }
}

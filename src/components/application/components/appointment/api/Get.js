import instance from "services/Instance";
export class appointmentAPI {
  getAppointment() {
    return new Promise((success, reject) => {
      instance
        .get("users/manage_appointment/")
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  selectAppointmentdate(mentor_id, date) {
    return new Promise((success, reject) => {
      instance
        .get("users/manage_slots/get_slots/", {
          params: { mentor_id: mentor_id, date: date },
        })
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getAppointmentslots(mentor_id, date) {
    // 
    return new Promise((success, reject) => {
      instance
        .get("users/manage_slots/get_slots/", { params: { date: date } })
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getRangeSlots(date, date2) {
    return new Promise((success, reject) => {
      instance
        .get("users/manage_slots/ranged_slots/", {
          params: { from_date: date, to_date: date2 },
        })
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getAppointmentMentorandExpert() {
    return new Promise((success, reject) => {
      instance
        .get("users/manage_appointment/")
        .then((res) => {
          // 
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
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

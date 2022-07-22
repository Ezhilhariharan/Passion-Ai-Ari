import instance from "services/Instance";
export class appointmentpostAPI {
  bookAppointment(mentor_id, appointmentdate, slotsid, student) {
    console.log(mentor_id, appointmentdate, slotsid, student)
    let formData = new FormData();
    formData.append("mentor", mentor_id);
    formData.append("appointment_date", appointmentdate);
    formData.append("slot", slotsid);
    formData.append("student", student);
    return new Promise((success, reject) => {
      instance
        .post("users/manage_appointment/", formData)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  updateSlotsAvailability(date, addedSlots, removeSlots) {
    let formData = new FormData();
    formData.append("date", date);
    formData.append("added_slots", JSON.stringify(addedSlots));
    formData.append("removed_slots", JSON.stringify(removeSlots));
    return new Promise((success, reject) => {
      instance
        .post("users/manage_slots/update_slots/", formData)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  updateRangeSlotsAvailability(slot_id, start_date, end_date) {
    // 
    let formData = new FormData();
    formData.append("slot_id", JSON.stringify(slot_id));
    formData.append("start_date", start_date);
    formData.append("end_date", end_date);
    return new Promise((success, reject) => {
      instance
        .post("users/manage_slots/", formData)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  PostAppointmentForms(formData) {
    return new Promise((success, reject) => {
      instance
        .post("users/manage_appointment/delete_reschedule/", formData)
        .then((res) => {
          success(res);
        })
        .catch((err) => {
        });
    });
  }
}

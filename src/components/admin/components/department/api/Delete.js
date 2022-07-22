import instance from "services/Instance";
export class deleteAPI {
  deleteDepartment(id) {
    return new Promise((success, reject) => {      
      instance
        .delete(`admin/department_admin/${id}/`)
        .then((res) => {          
          success(res);
        })      
    });
  }
}

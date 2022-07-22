import instance from "services/Instance";
export class postAPI {
  bulkupload(values) {
    return new Promise((success, reject) => {
      instance
        .post("admin/admin_site_config/user_bulk_upload/", values)
        .then((res) => {          
          success(res);
        })
        .catch((err) => {          
        });
    });
  }
}

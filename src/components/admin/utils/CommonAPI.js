import instance from "services/Instance";
export class CommonAPI {
  getIndustry() {
    return new Promise((success, reject) => {
      instance
        .get("admin/manage_industry/")
        .then((res) => {
          if (true) {
            let industryList = [{ value: "", label: "Select an industry" }];
            for (let i of res.data) {
              industryList.push({ value: i.id, label: i.name });
            }
            success(industryList);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

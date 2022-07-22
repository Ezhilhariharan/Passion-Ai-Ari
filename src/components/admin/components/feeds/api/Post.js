import instance from "services/Instance";
export class createFeed {
  postFeed(value) {
    return instance
      .post("admin/feeds/", value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
}

import instance from "services/Instance";
export class editFeed {
  editFeedApi(id, value) {
    return instance
      .patch(`admin/feeds/${id}/`, value)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return [];
      });
  }
}

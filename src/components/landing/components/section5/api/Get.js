import axios from "axios";
export function getBackDatas() {
  return axios.get(`admin/manage_blog/get_blog/`);
}

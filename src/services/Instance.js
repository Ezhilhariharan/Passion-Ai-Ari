import { ENV, LOCAL_SERVER, PRODUCTION_SERVER } from "./Config";
import axios from "axios";
const instance = axios.create({
  baseURL: ENV === "local" ? LOCAL_SERVER : PRODUCTION_SERVER,
});
instance.defaults.withCredentials = true;
instance.defaults.headers.post["Content-Type"] = "multipart/form-data";
if (localStorage.hasOwnProperty("passion_token")) {
  instance.defaults.headers.common["Authorization"] =
    "Token " + localStorage.getItem("passion_token");
  // courseURL.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('passion_token')
}
// if using application/json, add below line to headers
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
const check_status = (code) => {
  let success_code = [200, 201, 202];
  let failure_code = [400, 404];
  let error_code = [500];
  if (success_code.includes(code)) return true;
  else if (failure_code.includes(code)) return false;
  else if (error_code.includes(code)) return false;
  else return false;
};
const check_data = (data) => {
  let info = {};
  if (data.hasOwnProperty("length") && !data.includes("DOCTYPE"))
    info["data"] = data;
  if (typeof data === "string" && data.includes("DOCTYPE"))
    info["message"] = "error occured in api call";
  if (data.hasOwnProperty("data")) info["data"] = data.data;
  if (data.hasOwnProperty("Message")) info["message"] = data.Message;
  if (!info.hasOwnProperty("message") && !info.hasOwnProperty("data"))
    info["message"] = "error occured in api call";
  return info;
};
const prepareResponse = (response) => {  
  let output = {};
  output["status"] = check_status(response.data.StatusCode);
  let result = check_data(response.data); 
  if (result.hasOwnProperty("data")) output["data"] = result["data"];
  if (result.hasOwnProperty("message")) output["message"] = result["message"];
  return output;
};
instance.interceptors.response.use(
  function (response) {   
    return prepareResponse(response);
  },
  function (err) {
    if (err.response) {
      let response = err.response;
      if (response.hasOwnProperty("data")) {
        let data = response.data;
        if (data.hasOwnProperty("Message")) {
          return { status: false, message: data.Message };
        } else if (data.hasOwnProperty("message")) {
          return { status: false, message: data.message };
        } else if (data.hasOwnProperty("data")) {
          return { status: false, message: data.data };
        }
      }
    } else if (err.request) {
      return { status: false, message: "error in request" };
    } else {
      return { status: false, message: "error occured" };
    }
    // return Promise.reject(error);
  }
);
export default instance;

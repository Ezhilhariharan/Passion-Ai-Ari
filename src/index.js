import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// axios.defaults.baseURL = 'http://122.165.104.197:7000/api/'
// axios.defaults.baseURL = "http://192.168.0.143:8000/api/";
axios.defaults.baseURL = "https://passionaiari.com/api/";
axios.defaults.withCredentials = true;
// courseURL.defaults.withCredentials = true
if (localStorage.hasOwnProperty("passion_token")) {
  axios.defaults.headers.common["Authorization"] =
    "Token " + localStorage.getItem("passion_token");
  // courseURL.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('passion_token')
}
ReactDOM.render(
  <CookiesProvider>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </CookiesProvider>,
  document.getElementById("root")
);
reportWebVitals();

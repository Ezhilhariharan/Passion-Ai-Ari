import React from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notification from "./Notification";
const ReactNotificationComponent = ({ title, body }) => {
  let hideNotif = title === "";  
  if (!hideNotif) {
    toast(<Notification body={body} title={title}/>, { toastId: body });
  }
  return (
    <ToastContainer
      autoClose={2000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
    />
  );
};
ReactNotificationComponent.defaultProps = {
  title: "This is title",
  body: "Some body",
};
ReactNotificationComponent.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
};
export default ReactNotificationComponent;

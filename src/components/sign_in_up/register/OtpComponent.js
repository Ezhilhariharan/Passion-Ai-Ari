import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API } from "./api/api";
import { registerText } from "./Registerconst";
function OtpComponent(props) {
  let history = useHistory();
  const [counter, setCounter] = useState(60);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resendmsg, setResendmsg] = useState(false);
  const [inputdisable, setInputdisable] = useState(false);
  const [errormessage, setErrormessage] = useState("");
  const [openmodal, setOpenmodal] = useState(false);
  const [modalError, setModalError] = useState("");
  let { userid, email, closemodal, successToast, loading, otpErrormodal } =
    props;
  let signinAPI = new API();
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };
  const verifyotp = () => {
    setOpenmodal(true);
    let otpverify = otp.join("");
    if (otpverify.length < 6) {
      setErrormessage("Enter OTP");
    } else {
      loading();
      let formData = new FormData();
      formData.append("otp", otpverify);
      formData.append("user_id", userid);
      signinAPI.verifyOtp(formData).then((res) => {
        loading();
        if (res.status) {
          closemodal();
          successToast();
          history.push("/login");
        } else {         
          if (res.message) {
            if (typeof res.message === "object") {
              let value = Object.values(res.message);            
              otpErrormodal(true, value[0]);
            } else {              
              otpErrormodal(true, res.message);
            }
          } else {        
            otpErrormodal(true, "Something Went Wrong");
          }
        }
      });
    }
  };
  const resendotp = () => {
    if (counter <= 0) {
      setCounter(60);
      setInputdisable(false);
      setOtp([...otp.map((v) => "")]);
      setResendmsg(true);
      setErrormessage("");
      let data = {
        email: email,
        user_id: userid,
      };
      let formData = new FormData();
      formData.append("email", email);
      formData.append("user_id", userid);
      signinAPI.resendOtp(formData).then((res) => {
      });
    }
  };
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    counter === 0 ? setInputdisable(true) : setInputdisable(false);
    return () => clearInterval(timer);
  }, [counter]);
  const notify = () => {
    toast("Sucessfully registered plz wait for admin approval", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
    });
  };
  return (
    <div className="otp-component">
      <div className="otp-field w-100 d-flex flex-row justify-content-center">
        {otp.map((data, index) => {
          return (
            <input
              className="otp-fieldsetting"
              type="text"
              name="otp"
              maxLength="1"
              key={index}
              value={data}
              disabled={inputdisable}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          );
        })}
      </div>
      <div className="d-flex flex-row">
        <div
          className={
            counter <= 0
              ? "resend-otpsetting ms-5 ps-4"
              : "resend-otpsetting-disable ms-5 ps-4"
          }
          onClick={resendotp}
        >
          {registerText.Resend}
        </div>
        <div className="otp-countersetting ms-auto me-5 pe-4">
          {" "}
          00:{counter}
        </div>
      </div>
      {resendmsg ? (
        <div className="d-flex flex-row justify-content-center mt-3">
          <h5>
            {registerText.OTPhasbeen} <b>{registerText.Resend}</b>{" "}
            {registerText.toyour} <b>{registerText.emailid}</b>
          </h5>
        </div>
      ) : null}
      <div className="w-100 d-flex flex-row justify-content-center mb-4">
        <div>
          <button
            data-dismiss="modal"
            aria-label="Close"
            className="btn-yellow w-50 mb-2 px-3 mt-3 mb-3"
            onClick={verifyotp}
            type="button"
          >
            {registerText.VerifyOTPCreateAccount}
          </button>
          <center>
            <div style={{ color: "red" }}>{errormessage}</div>
          </center>
        </div>
      </div>
      {/* <ErrorModal message={modalError} value={openmodal} /> */}
    </div>
  );
}
export default OtpComponent;

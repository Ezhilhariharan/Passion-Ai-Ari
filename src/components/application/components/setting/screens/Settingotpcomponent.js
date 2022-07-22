import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SettingTexts } from "../const/Const_settings";
import { SettingAPI } from "../api/Api";
import ErrorModal from "../../../../common_Components/popup/ErrorModalpoup";
function Settingotpcomponent(props) {
  const { show, logoutfunc, exitModal } = props;
  const [counter, setCounter] = useState(60);
  const [inputdisable, setInputdisable] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resendmsg, setResendmsg] = useState(false);
  const [errormodal, setErrormodal] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [errormessage, setErrormessage] = useState("");
  let API = new SettingAPI();
  const handleChange = (element, index, e) => {    
    if (isNaN(element.value) && element.value === null && element.value === "")
      return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && (e.keyCode ? e.keyCode : e.which) !== 8) {
      element.nextSibling.focus();
    }
  };
  const handleReturn = (element, index, e) => {
    if ((e.keyCode ? e.keyCode : e.which) === 8) {
      if (element.previousSibling) {
        element.previousSibling.focus();
      }
    }
  };
  const verifyotp = () => {
    let otpverify = otp.join("");
    if (otpverify.length < 6) {
      setErrormessage("Enter OTP");
    } else {
      let data = {
        otp: otpverify,
      };
      API.PostOtpSettings(data).then((res) => {
        if (res.status) {
          show();
          exitModal();
          logoutfunc();
        } else {
          if (res.message) {
            if (typeof res.message === "object") {
              let value = Object.values(res.message);
              setErrormodal(true);
              setErrormsg(value[0]);
            } else {
              setErrormodal(true);
              setErrormsg(res.message);
            }
          } else {
            setErrormodal(true);
            setErrormsg("Something Went Wrong");
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
      API.PostResendOtp()
        .then((res) => {
        })
        .catch((err) => {
        });
    }
  };
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    counter === 0 ? setInputdisable(true) : setInputdisable(false);
    return () => clearInterval(timer);
  }, [counter]);
  const closeErrorModal = () => {
    setErrormodal(false);
  };
  return (
    <div>
      <div className="d-flex flex-row justify-content-center mt-5">
        <span className="otp-content ">{SettingTexts.Wesenta}</span>
      </div>
      <div className="d-flex flex-row justify-content-center ">
        {otp.map((data, index) => {
          return (
            <input
              className="otp-fieldsetting mt-4"
              type="text"
              name="otp"
              maxLength="1"
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index, e)}
              onKeyUp={(e) => handleReturn(e.target, index, e)}
              disabled={inputdisable}
              onFocus={(e) => e.target.select()}
            />
          );
        })}
      </div>
      <div className="d-flex flex-row justify-content-center mt-3">
        <div
          className={
            counter <= 0
              ? "resend-otpsetting ms-5 ps-4"
              : "resend-otpsetting-disable ms-5 ps-4"
          }
          onClick={resendotp}
        >
          {SettingTexts.ResendOTP}
        </div>
        <span className="otp-countersetting ms-auto me-5 pe-4">
          {" "}
          {SettingTexts.NUmberCount}
          {counter}
        </span>
      </div>
      {resendmsg ? (
        <div className="d-flex flex-row  mt-3">
          <h5>
            {SettingTexts.OTPhasbeen} <b>{SettingTexts.Resend}</b>{" "}
            {SettingTexts.toyour} <b>{SettingTexts.Phoneno}</b>
          </h5>
        </div>
      ) : null}
      <div className="d-flex flex-row justify-content-center mt-5">
        <button
          className="btn-yellow mb-3 w-25"
          onClick={verifyotp}
          type="button"
        >
          {SettingTexts.VerifyOTP}
        </button>
      </div>
      <center className="mb-4 ">
        <div style={{ color: "red" }}>{errormessage}</div>
      </center>
      {/* <Modal
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                show={errormodal}
                onHide={() => setErrormodal(false)}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="w-100">
                        <center className="mt-5 mb-3">
                            <h4>
                                <b>{errormsg}</b>
                            </h4>
                        </center>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex flex-row justify-content-center w-100">
                        <button
                            className="btn-blue mt-4 mb-5 w-50"
                            onClick={() => setErrormodal(false)}
                        >
                            OK
                        </button>
                    </div>
                </Modal.Footer>
            </Modal> */}
      <ErrorModal
        message={errormsg}
        value={errormodal}
        closeModal={closeErrorModal}
      />
    </div>
  );
}
export default Settingotpcomponent;

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { registerText } from "../LeftLayoutConst";
function Signup_layout(props) {
  const { layoutnum, username } = props;
  const [active, setActive] = useState(1);
  let history = useHistory();
  useEffect(() => {
    setActive(layoutnum);
  }, [layoutnum]);
  // 
  return (
    <div className="page-left">
      <div className="login-logo d-flex flex-row ps-xl-3 ps-xxl-3 pt-5 ps-lg-0 ps-md-0">
        {/* dark-theme-Passionlogo */}
        {/* <img
                    src="/image/passionlogo.png"
                    alt=""
                    className="img-fluid my-auto ms-1"
                    onClick={() => history.push("/")}
                /> */}
        <img
          src="/image/dark-theme-Passionlogo.png"
          alt=""
          className="img-fluid  ms-4 mb-4 "
          onClick={() => history.push("/")}
        />
      </div>
      {/* <div className="pageleft-progreejs ">
                <div className="bar  mx-auto">
                    {layoutnum == null ? (
                        <div className="">
                            <img
                                src="/image/signup.webp"
                                alt=""
                                className="img-fluid layout-signup "
                            />
                            <div className="pending-circle-yellow"></div>
                            <p className="content-signup-active ms-2">
                                {registerText.barlineTitle1}
                            </p>
                        </div>
                    ) : (
                        <div className="finished-tick">
                            <i className="fa-light fa-check"></i>
                        </div>
                    )}
                    <div
                        className={
                            layoutnum === 2
                                ? "bar-line-finished"
                                : layoutnum == null
                                ? "bar-line"
                                : "bar-line-active"
                        }
                    ></div>
                    {layoutnum < 2 ? (
                        <div className="">
                            {active === 1 ? (
                                <img
                                    src="/image/department.png"
                                    alt=""
                                    className="img-fluid layout-department"
                                />
                            ) : null}
                            <div
                                className={
                                    active === 1
                                        ? "pending-circle-yellow"
                                        : "pending-circle "
                                }
                            ></div>
                            <p
                                className={
                                    active === 1
                                        ? "content-signup-active"
                                        : "content-signup"
                                }
                            >
                                {registerText.barlineTitle2}
                            </p>
                        </div>
                    ) : (
                        <div className="finished-tick">
                            <i class="fa-light fa-check"></i>
                        </div>
                    )}
                    <div
                        className={
                            layoutnum < 2 ? "bar-line" : "bar-line-active"
                        }
                    ></div>
                    <div className="">
                        {active === 2 ? (
                            <img
                                src="/image/email.webp"
                                alt=""
                                className="img-fluid layout-email "
                            />
                        ) : null}
                        <div
                            className={
                                active === 2
                                    ? "pending-circle-yellow"
                                    : "pending-circle "
                            }
                        ></div>
                        <p
                            className={
                                active === 2
                                    ? "content-signup-active ms-1"
                                    : "content-signup ms-1"
                            }
                        >
                            {registerText.barlineTitle3}
                        </p>
                    </div>
                </div>
            </div> */}
      <div className="pageleft-middle-signup mt-5 ms-2 ps-lg-0 ps-md-0 ps-xl-5 ps-xxl-5 pe-xl-5 pe-xxl-5">
        {layoutnum == null && (
          <div>
            <h1 className="mt-5  ">{registerText.title}</h1>
            <h2 className="mt-3 ms-5 ">{registerText.contentOne}</h2>
          </div>
        )}
        {active === 1 && (
          <h2 className="mt-5  ">
            <span className="app-name-yellow">{username},</span>
            {registerText.contentTwo}
          </h2>
        )}
        {active === 2 && (
          <h2 className="mt-5  ">
            {registerText.contentThree}
            <span className="app-name-yellow">{username}</span>
          </h2>
        )}
      </div>
      <div className="pageleft-fotter-signup mt-auto d-flex flex-row ps-5">
        {/* <img
                    src="/image/signup_left.png"
                    alt=""
                    className="img-fluid"
                /> */}
        {layoutnum == null && (
          <img src="/image/signup_left_1.png" alt="" className="img-fluid" />
        )}
        {active === 1 && (
          <img src="/image/signup_left_1.png" alt="" className="img-fluid" />
        )}
        {active === 2 && (
          <img src="/image/signup_left_2.png" alt="" className="img-fluid" />
        )}
      </div>
    </div>
  );
}
export default Signup_layout;

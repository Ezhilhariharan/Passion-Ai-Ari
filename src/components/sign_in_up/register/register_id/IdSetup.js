import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { withRouter } from "react-router-dom";
import * as Yup from "yup";
import { registerText } from "../../register/Registerconst";
const MobileNumberSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid email").required("Email Required"),
  password: Yup.string()
    .required("Password Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters,1 Uppercase,1 Lowercase,1 Number and 1 special case Character"
    ),
  ConfirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});
class MobileNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHidePassword: false,
      showHideconfirmPassword: false,
      email: "",
      readonly: false,
    };
    this.changepage = this.props.changepage.bind(this);
    this.signupdata = this.props.signupdata.bind(this);
  }
  componentDidMount() {
    if (this.props.OauthEmail === undefined || this.props.OauthEmail === "") {
      this.setState({ email: "", readonly: false });
    } else {
      this.setState({ email: this.props.OauthEmail, readonly: true });
    }
  }
  render() {
    return (
      <div className="w-100">
        {/* <div className="back-icon ms-auto mb-5 " onClick={() => this.changepage(1)}>
          <i className="fa-solid fa-chevron-left "></i>
        </div> */}
        <Formik
          initialValues={{
            email: this.state.email,
            password: "",
            ConfirmPassword: "",
          }}
          onSubmit={(values) => {
            let data = values;
            data["email"] = values.email;
            data["password"] = values.password;
            this.signupdata(data);
            // 
          }}
          validationSchema={MobileNumberSchema}
        >
          {({ values }) => (
            <Form className="customForm mx-auto  pb-5 pt-2">
              <div
                className="back-icon ms-auto  me-3 "
                onClick={() => this.changepage(1)}
              >
                <i className="fa-solid fa-chevron-left "></i>
              </div>
              <h1 className="login-txt mb-5 mx-auto pt-3">
                {registerText.cardThirdTitle}
              </h1>
              <div className="form-group mt-5">
                <label className="label" htmlFor="name">
                  {registerText.email}*
                </label>
                <Field
                  name="email"
                  type="text"
                  className="input d-flex flex-row mb-2"
                  readOnly={this.state.readonly}
                />
                <ErrorMessage name="email" className="ms-5">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </div>
              <div className="form-group mt-2">
                <label className="label" htmlFor="password">
                  {registerText.password} *
                </label>
                <div className="password-eye d-flex flex-row">
                  <Field
                    id="password"
                    name="password"
                    type={this.state.showHidePassword ? "text" : "password"}
                    className="input mb-2 "
                  />
                  {values.password !== "" && (
                    <i
                      class={
                        this.state.showHidePassword
                          ? "fa-solid fa-eye eye-icon"
                          : "fa-solid fa-eye-slash eye-icon"
                      }
                      onClick={() =>
                        this.setState({
                          showHidePassword: !this.state.showHidePassword,
                        })
                      }
                    ></i>
                  )}
                </div>
                <div>
                  <ErrorMessage name="password">
                    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                  </ErrorMessage>
                </div>
              </div>
              <div className="form-group mt-2">
                <label className="label" htmlFor="number">
                  {registerText.confirmpassword}
                </label>
                <div className="d-flex">
                  <Field
                    id="ConfirmPassword"
                    name="ConfirmPassword"
                    type={
                      this.state.showHideconfirmPassword ? "text" : "password"
                    }
                    className="input mb-2"
                  />
                  {values.ConfirmPassword !== "" && (
                    <i
                      class={
                        this.state.showHideconfirmPassword
                          ? "fa-solid fa-eye eye-icon"
                          : "fa-solid fa-eye-slash eye-icon"
                      }
                      onClick={() =>
                        this.setState({
                          showHideconfirmPassword:
                            !this.state.showHideconfirmPassword,
                        })
                      }
                    ></i>
                  )}
                </div>
                <ErrorMessage name="ConfirmPassword">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </div>
              <div className=" w-100 d-flex flex-row justify-content-center mb-3">
                <button type="submit" className="btn-blue mx-auto mt-5">
                  {registerText.submit}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
export default withRouter(MobileNumber);

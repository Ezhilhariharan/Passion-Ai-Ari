import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { withRouter } from "react-router-dom";
import * as Yup from "yup";
import "./PersonalDetails.scss";
import { CountryService } from "../CountryService";
import { registerText } from "../../register/Registerconst";
import { Modal } from "react-bootstrap";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const PersonalDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Too Short!")
    .max(40, "name is too Long!")
    .matches(/^[aA-zZ\s]+$/, "Please enter valid name")
    .required("Name Required"),
  country: Yup.string().required("Country  Required"),
  mobile: Yup.string()
    .min(10, "Too Short!")
    .max(10, "Phone number is too Long!")
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Please enter mobile number"),
});
class PersonalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHidePassword: false,
      countries: [],
      name: "",
      country: "",
      mobile: "",
      touchpic: false,
      profilepicupload: "",
      inputtouch: false,
      profileImage: props.profileimg,
      readonly: false,
    };
    this.countryservice = new CountryService();
    this.showpicture = React.createRef();
    this.Openpicture = this.Openpicture.bind(this);
    // this.getdata = this.props.getdata.bind(this);
    // this.emaildatatoregister = this.props.emaildatatoregister.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    if (state.name.length === 0 && props.name.length !== 0) {
      return {
        ...props,
        ...state,
        name: props.name,
      };
    }
  }
  componentDidMount() {
    let getCountryList = [{ code: "", name: "" }];
    this.countryservice.getCountries().then((data) => {
      for (let i of data) {
        getCountryList.push({ code: i.code, name: i.name });
      }
      this.setState({ countries: getCountryList });
    });
    if (this.props.OauthName === undefined || this.props.OauthName === "") {
      this.setState({ name: "", readonly: false });
    } else {
      this.setState({ name: this.props.OauthName, readonly: true });
    }
  }
  componentClicked = () => {
  };
  login = (res) => {
    this.setState({ name: res.yu.qf });
    this.props.emaildatatoregister(res.yu.nv);
  };
  login_loader = () => {
    console.clear();
    // 
  };
  update = (res) => {
    // 
  };
  failure = (res) => {
    // 
  };
  responseFacebook(response) {
    this.setState({ name: response.name });
    this.props.emaildatatoregister(response.email);
  }
  fileChangedHandler = (event) => {
    // document.getElementById("profile_preview").src = ""
    const file = event.target.files[0];
    this.setState({ touchpic: true });
    if (file) {
      if (file.size < 2097152) {
        this.setState({ profilepicupload: file });
        if (this.state.profileImage) {
          this.setState({ profileImage: this.state.profileImage });
        } else {
          this.setState({ profileImage: file });
        }
        let reader = new FileReader();
        reader.onload = function () {
          document.getElementById("profile_preview").src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        document.getElementById("profile_preview").src = "";
        this.setState({
          message: "Size Limit Exceeds",
          show: true,
        });
      }
    }
  };
  Openpicture() {
    this.showpicture.current.click();
  }
  render() {
    // 
    return (
      <div className="w-100">
        <Formik
          initialValues={{
            name: this.state.name,
            country: this.props.country,
            mobile: this.props.mobilenum,
          }}
          enableReinitialize={true}
          onSubmit={(values) => {
            let data = values;
            data["country"] = values.country;
            data["mobile"] = values.mobile;
            data["name"] = values.name;
            data["profileShow"] =
              document.getElementById("profile_preview").src;
            this.state.touchpic
              ? (data["profile_image"] = this.state.profilepicupload)
              : (data[
                  "profile_image"
                ] = `https://avatars.dicebear.com/api/initials/${values.name}.png`);
            this.props.getdata(data, 1, 1);
          }}
          validationSchema={PersonalDetailsSchema}
        >
          {({ values }) => (
            <Form className="customForm mx-auto  pt-2 mt-5">
              <div
                className="back-icon ms-auto  me-3 "
                onClick={() => this.props.history.push("/login")}
              >
                <i className="fa-solid fa-chevron-left "></i>
              </div>
              <div className="login-txt  mx-auto ">
                {registerText.cardFirstTitle}
              </div>
              <div className="form-group mt-3">
                <label className="label" htmlFor="name">
                  {registerText.name} *
                </label>
                <Field
                  name="name"
                  type="text"
                  maxlength={25}
                  className="input mb-2"
                  readOnly={this.state.readonly}
                />
                <ErrorMessage name="name">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </div>
              <div className="form-group mt-2">
                <label className="label" htmlFor="mobile">
                  {registerText.mobile}
                </label>
                <Field name="mobile" type="text" className="input mb-2" />
                <ErrorMessage name="mobile">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </div>
              <div className="form-group mt-2">
                <label className="label" htmlFor="mobile">
                  {registerText.country}
                </label>
                <Field
                  name="country"
                  id="domain"
                  render={({ field }) => (
                    <select {...field} className="custom-select-country mb-2">
                      {this.state.countries.map((option, index) => (
                        <option value={option.name} key={index}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <ErrorMessage name="country">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </div>
              <div className="form-group mt-2">
                <label className="label" htmlFor="mobile">
                  {registerText.profilepicture}
                </label>
                <div className=" hide-position d-flex flex-row">
                  <div className=" reg-img d-flex mt-3">
                    <label className="cursor-pointer" htmlFor="logo">
                      <img
                        src={
                          this.state.profileImage
                            ? this.state.profileImage
                            : values.name === ""
                            ? "/image/reg_addimage.png"
                            : `https://avatars.dicebear.com/api/initials/${values.name}.svg`
                        }
                        id="profile_preview"
                        alt=""
                      />
                      <div className="icon">
                        <i class="fa-solid fa-pen-circle"></i>
                      </div>
                    </label>
                  </div>
                  <Field
                    id="logo"
                    type="file"
                    name="logo"
                    className=" hide-inputfile mt-5"
                    onChange={this.fileChangedHandler}
                    style={{ display: "none" }}
                    accept=".png, .jpg, .jpeg"
                  />
                </div>
              </div>
              <div className=" w-100 d-flex flex-row justify-content-center ">
                <button type="submit" className="btn-blue mx-auto mt-3 mb-3">
                  {" "}
                  {registerText.nextbutton}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.modal}
          onHide={() => this.setState({ modal: false })}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="register-modal">
              <div className="d-flex flex-row justify-content-center mt-3">
                <p>
                  {registerText.Wevesent}
                  <b>{registerText.emailid}</b>
                </p>
              </div>
              <center className="mt-3 mb-3">
                <h4>
                  {registerText.email} : {this.state.emailcustom}
                </h4>
              </center>
              <button
                data-dismiss="modal"
                aria-label="Close"
                className="btn-yellow w-50 mb-4 px-3 mt-3"
                onClick={() => this.setState({ modal: false })}
                type="button"
              >
                {registerText.VerifyOTPCreateAccount}
              </button>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
        <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="">
              <center className="mt-3 mb-3">
                <h2>{this.state.message}</h2>
              </center>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={() => this.setState({ show: false })}
              className="btn-blue mx-auto mt-5 mb-5 w-50"
            >
              Ok
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default withRouter(PersonalDetails);

import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { postAPI } from "../api/Post";
import ErrorModal from "../../../../common_Components/popup/ErrorModalpoup";
const addDepertmentSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Enter a valid email").required("Required"),
  password: Yup.string()
    .required("Password Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters,1 Uppercase,1 Lowercase,1 Number and 1 special case Character"
    ),
});
export default class CreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showmodal: false,
      show: false,
      message: "",
      showHidePassword: false,
      showHideconfirmPassword: false,
    };
    this.closeModal = this.closeModal.bind(this);
    this.openmodal = this.openmodal.bind(this);
    this.adddepartmentAPI = new postAPI();
  }
  openmodal() {
    this.setState({ showmodal: true });
  }
  closeModal() {
    this.setState({ showmodal: false });
    this.props.close(false);
  }
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  render() {
    return (
      <div>
        {" "}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          show={this.state.showmodal}
          onHide={() => this.setState({ showmodal: false })}
          className={this.props.theme ? "themeblack_modal" : "themewhite_modal"}
        >
          <Modal.Header>
            <div className="d-flex flex-row justify-content-end w-100">
              <i
                class="fa-regular fa-circle-xmark  ms-auto"
                onClick={this.closeModal}
              ></i>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-row ms-2">
              <div className=" create-feed-profile d-flex  ms-2">
                <img
                  src={this.props.user.profile_image}
                  alt=""
                  className="profile-imgin"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/image/errorprofileimg.webp";
                  }}
                />
              </div>
              <h5 className="my-auto ms-3 modal-username">
                {this.props.user.username}
              </h5>
            </div>
            <Formik
              initialValues={{
                departmentname: "",
                email: "",
                password: "",
              }}
              onSubmit={(values, onSubmitProps) => {
                this.adddepartmentAPI.addDepartment(values).then((res) => {
                  if (res.status) {
                    onSubmitProps.resetForm();
                    this.props.update();
                    this.props.alertToaste();
                    this.closeModal();
                  } else {
                    if (res.message) {
                      if (typeof res.message === "object") {
                        let value = Object.values(res.message);
                        this.setState({ message: value[0], show: true });
                      } else {
                        this.setState({ message: res.message, show: true });
                      }
                    } else {
                      this.setState({
                        message: "Something Went Wrong",
                        show: true,
                      });
                    }
                  }
                });
              }}
              validationSchema={addDepertmentSchema}
            >
              <Form className="customFormAdmin px-3 mt-4">
                <div className="form-group">
                  <label className="label" htmlFor="name">
                    Department name
                  </label>
                  <Field id="name" name="name" type="text" className="input" />
                  <ErrorMessage name="name">
                    {(msg) => <div>{msg}</div>}
                  </ErrorMessage>
                </div>
                <div className="form-group">
                  <label className="label" htmlFor="email">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="text"
                    className="input"
                  />
                  <ErrorMessage name="email">
                    {(msg) => <div>{msg}</div>}
                  </ErrorMessage>
                </div>
                <div className="form-group ">
                  <label className="label" htmlFor="password">
                    Password{" "}
                  </label>
                  <div className="d-flex flex-row">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className="input mb-3 "
                    />
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
                  </div>
                  <div>
                    <ErrorMessage name="password">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-center mt-4 mb-4">
                  <button type="submit" className="btn-yellow w-25">
                    save
                  </button>
                </div>
              </Form>
            </Formik>
          </Modal.Body>
        </Modal>
        {/* <Modal
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
                </Modal> */}
        <ErrorModal
          message={this.state.errorMessage}
          value={this.state.showError}
          closeModal={this.closeErrorModal}
        />
      </div>
    );
  }
}

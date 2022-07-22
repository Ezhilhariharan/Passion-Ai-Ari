import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { postAPI } from "../api/Post";
import { Department_text } from "../const/Department_const_text";
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
export class Department_Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showmodal: false,
      show: false,
      message: "",
      showHidePassword: false,
      showHideconfirmPassword: false,
      errorMessage: "",
      showError: false,
    };
    this.closeModal = this.closeModal.bind(this);
    this.openmodal = this.openmodal.bind(this);
    this.adddepartmentAPI = new postAPI();
  }
  componentDidMount() {
    this.setState({ showmodal: this.props.show });
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
    // 
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
          className={
            this.props.theme.is_dark ? "themeblack_modal" : "themewhite_modal"
          }
        >
          <Modal.Header>
            <div className="d-flex flex-row  w-100">
              <h3 className="ms-auto ps-3">
                {Department_text.Create_Department}
              </h3>
              <i
                class="fa-regular fa-circle-xmark  ms-auto"
                onClick={this.closeModal}
              ></i>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{
                name: "",
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
                        this.setState({ errorMessage: value[0], showError: true });
                      } else {
                        this.setState({ errorMessage: res.message, showError: true });
                      }
                    } else {
                      this.setState({
                        errorMessage: "Something Went Wrong",
                        showError: true,
                      });
                    }
                  }
                });
              }}
              validationSchema={addDepertmentSchema}
            >
              {({ values }) => (
                <Form className="customFormAdmin px-3 mt-4">
                  <div className="form-group">
                    <label className="label" htmlFor="name">
                      {Department_text.Departmentname}
                    </label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      className="input"
                      maxlength="25"
                    />
                    <ErrorMessage name="name">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor="email">
                      {Department_text.Email}
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="text"
                      className="input"
                    />
                    <ErrorMessage name="email">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="form-group ">
                    <label className="label" htmlFor="password">
                      {Department_text.Password}{" "}
                    </label>
                    <div className="d-flex flex-row">
                      <Field
                        id="password"
                        name="password"
                        type={this.state.showHidePassword ? "text" : "password"}
                        className="input mb-3 "
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
                  <Modal.Footer>
                    <div className="d-flex flex-row justify-content-center mt-4 mb-4 w-100">
                      <button type="submit" className="btn-blue ">
                        {Department_text.save}
                      </button>
                    </div>
                  </Modal.Footer>
                </Form>
              )}
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
                            {Department_text.ok}
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
export default Department_Create;

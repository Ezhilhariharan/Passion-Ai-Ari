import React, { Component } from "react";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { API } from "./utils/API";
import "../homePageContent/styles/HomePageContent.scss";
import Modal from "react-bootstrap/Modal";
import { cmsText } from "../../Const_CMS";
const addQuestion = Yup.object().shape({
  content: Yup.string().required("Required"),
});
class AddQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPreview: false,
      showEditPreview: false,
      editImage: "",
      errorMessage: "",
      showMessage: "",
      allowPost: false,
      showmodal: false,
      openmodal: false,
      modalmessage: "",
      id: "",
      industry_value: 1,
      showbtn: false,
      topiclearntId: "",
      renderQuestionModal: false,
    };
    this.closeModal = this.closeModal.bind(this);
    this.openmodal = this.openmodal.bind(this);
    this.Configurereport = new API();
  }
  openmodal() {
    this.setState({ showmodal: true });
  }
  closeModal() {
    this.setState({ showmodal: false });
    this.props.closefeed(false);
  }
  closeErrorModal = () => {
    this.setState({ errorMessage: "", showError: false });
  };
  render() {
    return (
      <div>
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
            <h4 className="ms-auto ps-3">{cmsText.addquestion}</h4>
            <i
              class="fa-regular fa-circle-xmark  ms-auto"
              onClick={this.closeModal}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <div className="form-wrapper-2 ">
              <Formik
                initialValues={{
                  content: "",
                }}
                onSubmit={(values, onSubmitProps) => {
                  this.props.loading();
                  let formData = new FormData();
                  formData.append("question", values.content);
                  formData.append("industry_id", this.props.industry_id);
                  formData.append("question_type", "text");
                  this.Configurereport.addQuestion(formData)
                    .then((res) => {
                      this.props.loading();
                      if (res.status) {
                        this.closeModal();
                        this.props.QuestionList(this.props.industry_id);
                      } else {
                        if (res.message) {
                          if (typeof res.message === "object") {
                            let value = Object.values(res.message);
                            this.setState({
                              errorMessage: value[0],
                              showError: true,
                            });
                          } else {
                            this.setState({
                              errorMessage: res.message,
                              showError: true,
                            });
                          }
                        } else {
                          this.setState({
                            errorMessage: "Something Went Wrong",
                            showError: true,
                          });
                        }
                      }
                      // 
                    })
                    .catch((err) => {
                    });
                }}
                validationSchema={addQuestion}
              >
                <Form className="customFormAdmin px-3 mt-4">
                  <div className="form-group">
                    <label className="label" htmlFor="question">
                      {cmsText.question}
                    </label>
                    <Field
                      id="content"
                      name="content"
                      as="textarea"
                      className="input-cms"
                      maxlength="100"
                    />
                    <ErrorMessage name="content">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <Modal.Footer>
                    <div className="d-flex flex-row justify-content-center mt-3 mb-4 w-100">
                      <button type="submit" className="btn-blue ">
                        {cmsText.addquestion}
                      </button>
                    </div>
                  </Modal.Footer>
                </Form>
              </Formik>
            </div>
          </Modal.Body>
        </Modal>
        <ErrorModal
          message={this.state.errorMessage}
          value={this.state.showError}
          closeModal={this.closeErrorModal}
        />
      </div>
    );
  }
}
export default AddQuestion;

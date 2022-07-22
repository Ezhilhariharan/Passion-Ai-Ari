import React, { Component } from "react";
import ErrorModal from "../../../../../common_Components/popup/ErrorModalpoup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { API } from "./utils/API";
import "../homePageContent/styles/HomePageContent.scss";
import Modal from "react-bootstrap/Modal";
import { cmsText } from "../../Const_CMS";
const addTopicLearned = Yup.object().shape({
  content: Yup.string().required("Required"),
});
export default class AddTopicLearned extends Component {
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
            <h4 className="ms-auto ps-3">
              {cmsText.addtopiclearnt}            
            </h4>
            <i
              class="fa-regular fa-circle-xmark  ms-auto"
              onClick={this.closeModal}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <div className="form-wrapper-2">
              <Formik
                initialValues={{
                  content: "",
                }}
                onSubmit={(values, onSubmitProps) => {
                  this.props.loading();
                  let formData = new FormData();
                  formData.append("content", values.content);
                  formData.append("industry_id", this.props.industry_id);
                  this.Configurereport.createTopicLearned(formData).then(
                    (res) => {
                      if (res.status) {
                        this.props.loading();
                        this.closeModal();
                        this.props.QuestionList(this.props.industry_id);
                      } else {
                        this.setState({
                          errorMessage: res.message,
                          showError: true,
                        });
                        this.props.loading();
                      }
                    }
                  );
                }}
                validationSchema={addTopicLearned}
              >
                <Form className="customFormAdmin px-3 mt-4">
                  <div className="form-group">
                    <label className="label" htmlFor="question">
                      {cmsText.topiclearnt}
                    </label>
                    <Field
                      id="question"
                      name="content"
                      as="textarea"
                      className="input-cms"
                    />
                    <ErrorMessage name="content">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <Modal.Footer>
                    <div className="d-flex flex-row justify-content-center mt-3 mb-4 w-100">
                      <button type="submit" className="btn-blue ">
                        {cmsText.add}
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
        />
      </div>
    );
  }
}

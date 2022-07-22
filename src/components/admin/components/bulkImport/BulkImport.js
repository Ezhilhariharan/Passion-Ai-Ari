import React, { Component } from "react";
import { withRouter } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Header from "../../../navbar/header/Header";
import "./styles/BulkImport.scss";
import { postAPI } from "./utils/Post";
import { connect } from "react-redux";
import { BulkText } from "./const/Const_Bulk_text";
import { Modal } from "bootstrap";
const bulkuploadSchema = Yup.object().shape({
  updated_by: Yup.string().required("Required"),
});
let documentorpdf;
class BulkImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      down_url:
        axios.defaults.baseURL +
        "admin/admin_site_config/user_bulkupload_sample_files/",
      profilepicupload: "",
      show: false,
      message: "",
      documentname: "",
      showException: false,
      ExceptionList:  [],
    };
    this.bulkuploadapi = new postAPI();
    this.changeImage = this.changeImage.bind(this);
    this.editpicture = React.createRef();
    this.errormsg = React.createRef();
    this.Openprofilepicture = this.Openprofilepicture.bind(this);
    this.showLoading = this.showLoading.bind(this);
    this.webinarList = React.createRef();
  }
  Openprofilepicture() {
    this.editpicture.current.click();
  }
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  Toast = () => {
    this.props.showtoast({
      text: "Uploded Successfully ",
      time: new Date().getTime(),
    });
  };
  selectFile = () => {
    documentorpdf = document.getElementById("contract_doc").files[0];
    if (documentorpdf != null) {
      this.documentToast();
      this.setState({ documentname: documentorpdf.name });
    }
  };
  documentToast = () => {
    this.props.showtoast({
      text: "Document Uploaded Successfully ",
      time: new Date().getTime(),
    });
  };
  changeImage = (event) => {
    const file = event.target.files[0];
    this.setState({ profilepicupload: file });
    if (file) {
      if (file.size < 2097152) {
        let reader = new FileReader();
        reader.onload = function () {
          document.getElementById("profile_preview").src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
      }
    }
  };
  hideWebinarModal = () => {
    const modalEle = this.webinarList.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  showWebinarViewModal = () => {
    
    const modalEle = this.webinarList.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideerrormsg = () => {
    const modalEle = this.errormsg.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  showerrormsg = () => {
    const modalEle = this.errormsg.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  render() {
    return (
      <div className="bulkimport">
        <div className="studenthomepage-header d-flex flex-row">
          <Header />
        </div>
        <div className="form-wrapper-bulk  px-4">
          <Formik
            initialValues={{
              updated_by: "",
            }}
            onSubmit={(values, onSubmitProps) => {
              // 
              if (documentorpdf) {
                let formDatapicture = new FormData();
                formDatapicture.append("file", documentorpdf);
                formDatapicture.append("updated_by", values.updated_by);
                this.showLoading();
                this.bulkuploadapi.bulkupload(formDatapicture).then((res) => {
                  this.showLoading();
                  console.log("bulkuploadapi", res)
                  if (res.status) {
                    console.log("true", res)
                    if (res.data.hasOwnProperty("Message")) {
                      this.Toast();
                      onSubmitProps.resetForm();
                    }
                    if (res.hasOwnProperty("data")) {
                      if (res.data.hasOwnProperty("invalid_fields"))
                        this.setState(
                          { ExceptionList: res.data.invalid_fields },
                          () => {
                            this.showWebinarViewModal();
                          }
                        );
                    }
                  } else {
                    console.log("false", res.message,res.message.hasOwnProperty("invalid_fields"))
                    if (res.hasOwnProperty('message')) {
                      if (res.message.hasOwnProperty("invalid_fields")){
                        console.log("im in",res.message.invalid_fields)
                        this.setState(
                          { ExceptionList: res.message.invalid_fields },
                          () => {
                            this.showWebinarViewModal();
                          }
                        );
                      }else{
                        if (res.message) {
                          if (typeof res.message === "object") {
                            let value = Object.values(res.message);
                            this.setState({ message: value[0] });
                            this.showerrormsg();
                          } else {
                            this.setState({ message: res.message });
                            this.showerrormsg();
                          }
                        } else {
                          this.setState({
                            message: "Something Went Wrong",
                            // show: true,
                          });
                          this.showerrormsg();
                        }
                      }                                
                    }        
                  }
                });
              } else {
                this.setState({ show: true, message: "Add Contract Document" });
              }
            }}
            validationSchema={bulkuploadSchema}
          >
            <Form className="customFormAdmin">
              <div className="row col-12 py-4">
                <div className="information">
                  <h1 onClick={this.showWebinarViewModal}>
                    {BulkText.Information}
                  </h1>
                  <p>{BulkText.Loremipsumconsectetur}</p>
                  <p> {BulkText.consectetur}</p>
                </div>
                <div className="d-flex flex-row mt-4">
                  <label className="btn-yellow " htmlFor="contract_doc">
                    {BulkText.upload}
                  </label>
                  <span className="text-muted info-text document_name ms-2">
                    {this.state.documentname !== ""
                      ? this.state.documentname
                      : BulkText.sizelimit}
                  </span>
                  <Field
                    id="contract_doc"
                    name="contract_doc"
                    type="file"
                    accept=".csv"
                    className="d-none"
                    onChange={this.selectFile}
                  />
                  <div className="download-button ms-auto">
                    <a href={this.state.down_url} download>
                      {BulkText.sample}
                    </a>{" "}
                    <i class="fa-solid fa-cloud-arrow-down ms-2"></i>
                  </div>
                </div>
                {/* <div className="form-group d-flex flex-row align-items-center mt-2 col-12">
                                    <div className="video_upload py-1">
                                        <div
                                            className="add_video_icon"
                                            id="profile_preview"
                                            onClick={this.Openprofilepicture}
                                        >
                                            <i class="fa-solid fa-plus "></i>
                                        </div>
                                        <div className="p">
                                            {BulkText.ClickVideotoupload}
                                        </div>
                                        <span>{BulkText.Acceptfile}</span>
                                    </div>
                                </div> */}
                <div className="col-12  mt-4">
                  <div className="form-group">
                    <label className="label" htmlFor="name">
                      {BulkText.Uploadedby}
                    </label>
                    <Field
                      id="name"
                      name="updated_by"
                      type="text"
                      className="input"
                    />
                    <ErrorMessage name="updated_by">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                  {/* <input
                                        type="file"
                                        name="photo1"
                                        id="file"
                                        style={{ display: "none" }}
                                        onChange={this.changeImage}
                                        ref={this.editpicture}
                                    /> */}
                </div>
              </div>
              <div className="d-flex flex-row justify-content-center">
                <button type="submit" className="btn-yellow w-25">
                  {BulkText.Submit}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
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
                            {BulkText.ok}
                        </button>
                    </Modal.Footer>
                </Modal> */}
        <div className="modal fade " id="webinarslist" ref={this.errormsg}>
          <div class="modal-dialog modal-dialog-centered 	modal-lg  modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">              
              </div>
              <div class="modal-body">
                <div className="">
                  <center className="mt-3 mb-3">
                    <h2>{this.state.message}</h2>
                  </center>
                </div>
                <center>
                <button
                  onClick={this.hideerrormsg}
                  className="btn-blue mx-auto mt-5 mb-5 "
                >
                  {BulkText.ok}
                </button>
                </center>               
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade " id="webinarslist" ref={this.webinarList}>
          <div class="modal-dialog modal-dialog-centered 	modal-lg  modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h4 className="mx-auto ps-3">Exception List</h4>
              </div>
              <div class="modal-body">
                <div className="mx-auto">
                  <div className="ExceptionList-heading w-100 d-flex flex-row">
                    <div className="col-4 my-auto center">Name</div>
                    <div className="col-4 my-auto center">Mobile No</div>
                    <div className="col-4 my-auto center">Email</div>
                  </div>
                  {this.state.ExceptionList.map((data,index) => (
                    <div className="ExceptionList d-flex flex-row my-3" key={index}>
                      <div
                        className={
                          data.name.length > 25
                            ? "error col-4 my-auto px-2"
                            : "content col-4 my-auto px-2"
                        }
                      >
                        {data.name}
                      </div>
                      <div
                        className={
                          data.mobile_no.length == 10 
                            ? "error col-4 my-auto px-2"
                            : "content col-4 my-auto px-2"
                        }
                      >
                        {data.mobile_no}
                      </div>
                      <div
                        className={
                          data.email_error
                            ? "error col-4 my-auto px-2"
                            : "content col-4 my-auto px-2"
                        }
                      >
                        {data.email}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-100">
                  <button
                    onClick={this.hideWebinarModal}
                    className="btn-yellow mx-auto mt-5 mb-4 "
                  >
                    {BulkText.underStood}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    toast: state.toast,
    theme: state.theme,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    showtoast: (data) => {
      dispatch({ type: "ShowToast", value: data });
    },
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BulkImport));
// export default withRouter(BulkImport);

import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { withRouter } from "react-router";
import instruction from "../../assets/careerimages/instruction.webp";
import congratus from "../../assets/careerimages/congratus.webp";
import "./styles/Careerpathvideo.scss";
import { carrerSelectionText } from "./const/Const_Carrerselection";
function Careerpathvideo(props) {
  const [show, setShow] = useState(true);
  let videos = () => {
    props.playvideo();
  };
  const handleClose = () => {
    setShow(false);
    videos();
  };
  const handleShow = () => setShow(true);
  return (
    <div className="sample_pop_up">
      <div div className="pop_ups">
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          id="modals_show"
          className=""
          centered
        >
          <div className="career-header">
            <Modal.Header>
              <Modal.Title className="instructions mt-2 mb-3">
                {carrerSelectionText.firstModalTitle}
              </Modal.Title>
            </Modal.Header>
          </div>
          <div className="career-body">
            <Modal.Body className="slicks">
              <div
                id="carouselExampleInterval"
                class="carousel slide w-100"
                data-bs-ride="carousel"
              >
                {/* <div class="carousel-indicators">
                                    <button
                                        type="button"
                                        data-bs-target="#carouselExampleCaptions"
                                        data-bs-slide-to="0"
                                        class="active"
                                        aria-current="true"
                                        aria-label="Slide 1"
                                    ></button>
                                    <button
                                        type="button"
                                        data-bs-target="#carouselExampleCaptions"
                                        data-bs-slide-to="1"
                                        aria-label="Slide 2"
                                    ></button>
                                </div> */}
                <div class="carousel-inner">
                  <div class="carousel-item active ">
                    <div className="w-100">
                      <img src={instruction} className="img-instruction mb-5" />
                      <h3 className="mt-5 mb-3 px-3 loreams">
                        {carrerSelectionText.modalSliderContent}
                      </h3>
                    </div>
                  </div>
                  <div class="carousel-item ">
                    <div className="w-100">
                      <img src={congratus} className="img-instructions" />
                      <h3 className="mt-5 mb-3 px-3 loreams">
                        {carrerSelectionText.modalSliderContent}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </div>
          <div className="career-footer mb-4">
            <Modal.Footer style={{ margin: "0 auto" }} className="mb-5">
              <div className="buttonsed">
                <button
                  onClick={() => handleClose()}
                  classname="footer_button mt-5"
                  style={{
                    background:
                      "linear-gradient(24.18deg, #2B2E4A 64.51%, rgba(43, 46, 74, 0) 233.27%)",
                    border: "none",
                    color: "#FF7A00",
                    borderRadius: "54.5px",
                    outLine: "none",
                    padding: "10px 30px",
                    fontWeight: "700",
                  }}
                >
                  {carrerSelectionText.continue}
                </button>
              </div>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
    </div>
  );
}
export default withRouter(Careerpathvideo);

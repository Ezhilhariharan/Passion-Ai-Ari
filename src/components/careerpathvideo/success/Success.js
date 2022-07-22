import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Slider from "react-slick";
import { withRouter } from "react-router";
import "./styles/Success.scss";
import congratus from "../../../assets/careerimages/congratus.webp";
import { carrerSelectionText } from "../const/Const_Carrerselection";
function Success(props) {
  const [show, setShow] = useState(true);
  let videos = () => {
    props.submitsanswer();
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
          // onHide={handleClose}
          backdrop="static"
          keyboard={false}
          id="modals_show"
          className=""
          centered
        >
          <Modal.Header>
            <Modal.Title className="instructions mt-2 mb-3">
              {carrerSelectionText.firstModalTitle}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="slicks">
            <div className="slick">
              <Slider>
                <div>
                  <img src={congratus} className="img-instructions" />
                  <h3 className="mt-5 mb-3 px-3 loreams">
                    {carrerSelectionText.Loremipsumdolorsitamet}
                  </h3>
                </div>
              </Slider>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ margin: "0 auto" }} className="mt-3 mb-3">
            <div className="buttons">
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
        </Modal>
      </div>
    </div>
  );
}
export default withRouter(Success);

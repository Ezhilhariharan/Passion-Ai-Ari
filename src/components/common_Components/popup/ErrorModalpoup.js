import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
function ErrorModalpoup(props) {
  const { message, value, closeModal } = props;
  const [deletemodalshow, setDeletemodalshow] = useState(false);
  useEffect(() => {
    setDeletemodalshow(value);
  }, [value]);
  const modalClose = () => {
    setDeletemodalshow(false);
    closeModal();
  };
  return (
    <div>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        show={deletemodalshow}
        onHide={() => setDeletemodalshow(false)}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-100">
            <center className="mt-5 mb-3">
              <h4>
                <b>{message}</b>
              </h4>
            </center>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex flex-row justify-content-center w-100">
            <button className="btn-blue mt-4 mb-5 w-50" onClick={modalClose}>
              Ok
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default ErrorModalpoup;

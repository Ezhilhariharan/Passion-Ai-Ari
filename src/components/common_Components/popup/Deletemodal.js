import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { feedsText } from "../feeds/const/Const_Feeds";
function Deletemodal(props) {
  const { message, value, id, deletefun } = props;
  const [deletemodalshow, setDeletemodalshow] = useState(false);
  useEffect(() => {
    setDeletemodalshow(value);
  }, [value]);
  return (
    <div className="delete_modal">
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
            <center className=" mb-3">
              <h5>
                <b>{message}</b>
              </h5>
            </center>
            <center>
              {" "}
              <img
                src="/image/delete.png"
                alt=""
                className="delete_img img-fluid  mx-5 ps-3 mt-4 mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/image/errorprofileimg.webp";
                }}
              />
            </center>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex flex-row mx-auto">
            <button
              className="btn-blue  mb-4 me-4"
              onClick={() => deletefun(false, id, "yes")}
            >
              {feedsText.Yes}
            </button>
            <button
              className="btn-blue  mb-4"
              onClick={() => deletefun(false, id, "no")}
            >
              {feedsText.No}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Deletemodal;

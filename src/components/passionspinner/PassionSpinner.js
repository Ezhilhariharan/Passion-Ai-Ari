import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import "./styles/PassionSpinner.scss";
import firstlogo from "./assets/circle_logo.svg";
import secondlogo from "./assets/inside_logo.svg";
function PassionSpinner({ size }) {
  const [imageSize, setImageSize] = useState(size ? size : 180);
  // main_passion
  return (
    <div className="main_passion">
      <div
        className="outside_spinner"
        style={{
          width: imageSize + "px",
          height: imageSize + "px",
        }}
      >
        <img src={firstlogo} alt=""/>
      </div>
      <div
        className="inside_spinner"
        style={{ width: imageSize * 0.15, height: imageSize * 0.15 }}
      >
        <img src={secondlogo} alt=""/>
      </div>
    </div>
  );
}
export default withRouter(PassionSpinner);

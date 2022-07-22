import React from "react";
import "./styles/SlidePreArrow.scss";
function SlidePreArrow(props) {
  const { className, onClick } = props;
  return (
    <div className={`${className} slide-pre`} style={{}} onClick={onClick} />
  );
}
export default SlidePreArrow;

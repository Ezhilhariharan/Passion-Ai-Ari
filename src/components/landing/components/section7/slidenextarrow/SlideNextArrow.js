import React from "react";
import "./styles/SlideNextArrow.scss";
function SlideNextArrow(props) {
  const { className,  onClick } = props;
  return (
    <div className={`${className} slide-next`} style={{}} onClick={onClick} />
  );
}
export default SlideNextArrow;

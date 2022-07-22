import React from "react";
import "./styles/Rightarrow.scss";
function Rightarrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={`${className} slide-nexted`} style={{}} onClick={onClick} />
  );
}
export default Rightarrow;

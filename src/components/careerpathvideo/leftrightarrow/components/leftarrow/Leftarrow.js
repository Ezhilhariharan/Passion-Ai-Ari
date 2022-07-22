import React from "react";
import "./styles/Leftarrow.scss";
function Leftarrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={`${className} slick-arrow`} style={{}} onClick={onClick} />
  );
}
export default Leftarrow;

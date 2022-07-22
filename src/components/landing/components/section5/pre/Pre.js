import React from "react";
import "./styles/Pre.scss";
function Pre(props) {
  const { className,  onClick } = props;
  return (
    <div className={`${className} slide-pre`} style={{}} onClick={onClick} />
  );
}
export default Pre;

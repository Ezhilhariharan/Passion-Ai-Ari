import React from "react";
export default function Notification(props) {
  let { title,body } = props;
  return (
    <div>
      <p className="text-dark">{title}</p>
      <h4 className="text-dark">{body}</h4>
    </div>
  );
}

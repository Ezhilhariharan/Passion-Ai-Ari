import React from "react";
import "../styles/Selection.scss";
function Selection(props) {
  const { items, getselectindustrydata } = props; 
  const selectindustrydata = (data) => {    
    getselectindustrydata(data);
  };
  return (
    <div className="slider-item">
      <div className="selection p-3">
        <div
          className="selection-icon "
          onClick={() => selectindustrydata(items.id)}
        >
          <img src={items.logo} alt="" className="img-fluid" />
          <p className="mt-2">{items.name}</p>
        </div>
      </div>
    </div>
  );
}
export default Selection;

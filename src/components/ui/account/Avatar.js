import React from "react";
import FaBed from "../../../img/FaBed.js";
import FaPlus from "../../../img/FaPlus.js";
import "../../../styles/Avatar.css";

function Avatar(props) {
  const { image, active, className, plus } = props;

  const disabled = active !== undefined && !active;
  const disabledClass = disabled && "avatar-disabled";

  const backgroundStyle = { backgroundImage: `url(${image})` };
  return (
    <div className={`avatar-container ${className || ""}`}>
      <div className="p-2 p-md-3">
        <div className="avatar image-container">
          <div className={`${disabledClass || ""}`}>
            <div className="avatar bg-image grey lighten-2 w-100 p-100"
                style={backgroundStyle} />
          </div>
          { disabled && <FaBed className="avatar overlay-icon" /> }
          { plus && <FaPlus className="avatar overlay-icon" /> }
        </div>
      </div>
    </div>
  );
}

export default Avatar;

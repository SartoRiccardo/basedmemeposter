import React from "react";
// import { MDBIcon } from "mdbreact";
import "../../../styles/Avatar.css";

function Avatar(props) {
  const { image, active, className } = props;

  const disabledClass = active !== undefined && !active ? "avatar-disabled" : null;
  
  const backgroundStyle = { backgroundImage: `url(${image})` };
  return (
    <div className={`avatar-container ${className}`}>
      <div className={`p-2 p-md-3 ${disabledClass}`}>
        <div className="avatar bg-image grey lighten-2 w-100 p-100"
            style={backgroundStyle} />
      </div>
      {/*bedIcon*/}
    </div>
  );
}

export default Avatar;

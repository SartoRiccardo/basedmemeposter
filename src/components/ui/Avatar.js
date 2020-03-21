import React from "react";
// import { MDBIcon } from "mdbreact";
import "../../styles/Avatar.css";

function Avatar(props) {
  const { image, active, className } = props;

  const disabledClass = active !== undefined && !active ? "avatar-disabled" : null;
  // const bedIcon = !active && (
  //   <MDBIcon icon="bed" className="overlay-avatar text-white" />
  // );

  return (
    <div className={`avatar-container ${className}`}>
      <img alt="" src={image}
          className={`avatar p-2 p-md-3 ${disabledClass}`} />
      {/*bedIcon*/}
    </div>
  );
}

export default Avatar;

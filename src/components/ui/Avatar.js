import React from "react";
// import { MDBIcon } from "mdbreact";
import "../../styles/Avatar.css";

function Avatar(props) {
  const { image, active } = props;

  const disabledClass = !active ? "img-disabled" : null;
  // const bedIcon = !active && (
  //   <MDBIcon icon="bed" className="overlay-avatar text-white" />
  // );

  return (
    <div className="avatar-container">
      <img alt="" className={`avatar p-3 p-md-3 ${disabledClass}`} src={image} />
      {/*bedIcon*/}
    </div>
  );
}

export default Avatar;

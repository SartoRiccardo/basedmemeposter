import React from "react";
import { MDBCard, MDBCardBody, MDBIcon } from "mdbreact";

function LogCard(props) {
  const { level, count, onClick, className } = props;

  let icon;
  switch(level.toUpperCase()) {
    case "WARNING":
      icon = (
        <MDBIcon
          className="expandthis amber-text darken-2"
          icon="exclamation-triangle"
        />
      );
      break;

    case "ERROR":
      icon = (
        <MDBIcon
          className="expandthis deep-orange-text accent-4"
          icon="exclamation-circle"
        />
      );
      break;

    default:
      icon = null;
  }

  return (
    <MDBCard onClick={onClick} className={className}>
      <MDBCardBody>
        {icon}<br />
        <p className="mt-3 mb-0">You have {count} errors</p>
      </MDBCardBody>
    </MDBCard>
  );
}

export default LogCard;

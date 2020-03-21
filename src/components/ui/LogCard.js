import React from "react";
import { MDBCard, MDBCardBody, MDBIcon } from "mdbreact";

function LogCard(props) {
  const { level, count, onClick, className } = props;

  let icon, color, text;
  switch(level.toUpperCase()) {
    case "WARNING":
      icon = "exclamation-triangle";
      color = "amber-text darken-2";
      text = `You have ${count} warnings`;
      break;

    case "ERROR":
      icon = "exclamation-circle";
      color = "deep-orange-text accent-4";
      text = `You have ${count} errors`;
      break;

    default:
      icon = null;
  }

  return (
    <MDBCard onClick={onClick} className={className}>
      <MDBCardBody>
        <div className="d-block d-md-none">
          <MDBIcon className={`big-icon ${color}`} icon={icon} /><br />
          <p className="mt-3 mb-0">{text}</p>
        </div>
        <div className="d-none d-md-block">
          <MDBIcon className={`${color}`} icon={icon} pull="left" size="5x" fixed />
          <h5 className="text-left">{text}</h5>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}

export default LogCard;

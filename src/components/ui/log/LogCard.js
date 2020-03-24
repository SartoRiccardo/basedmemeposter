import React from "react";
import { MDBCard, MDBCardBody, MDBIcon } from "mdbreact";

function LogCard(props) {
  const { level, count, onClick, loading, className } = props;

  let icon, color, text;
  switch(level.toUpperCase()) {
    case "WARNING":
      icon = "exclamation-triangle";
      color = "amber-text text-darken-2";
      text = `You have ${count} warnings`;
      break;

    case "ERROR":
      icon = "exclamation-circle";
      color = "deep-orange-text text-accent-4";
      text = `You have ${count} errors`;
      break;

    default:
      icon = null;
  }

  if(loading) {
    text = "Loading...";
  }
  if(loading || count === 0) {
    color = "grey-text text-lighten-3";
  }

  return (
    <MDBCard onClick={onClick} className={className}>
      <MDBCardBody>
        <div className="d-block d-md-none">
          <MDBIcon className={`big-icon ${color}`} icon={icon} /><br />
          <p className={`mt-3 mb-0 ${loading ? "grey-text" : ""}`}>{text}</p>
        </div>
        <div className="d-none d-md-block">
          <MDBIcon className={`${color}`} icon={icon} pull="left" size="5x" fixed />
          <h5 className={`text-left ${loading ? "grey-text" : ""}`}>{text}</h5>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}

export default LogCard;

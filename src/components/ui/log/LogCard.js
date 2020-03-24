import React from "react";
import { MDBCard, MDBCardBody, MDBIcon, MDBBtn } from "mdbreact";
// HOCs and actions
import { connect } from "react-redux";
import { ignoreLogs } from "../../../storage/actions/log";

function LogCard(props) {
  const { level, count, onClick, loading, ignored, className } = props;
  const countWithoutIgnored = count - ignored[level];

  let icon, color, text;
  switch(level.toUpperCase()) {
    case "WARNING":
      icon = "exclamation-triangle";
      color = "amber-text text-darken-2";
      text = `You have ${countWithoutIgnored} warnings`;
      break;

    case "ERROR":
      icon = "exclamation-circle";
      color = "deep-orange-text text-accent-4";
      text = `You have ${countWithoutIgnored} errors`;
      break;

    default:
      icon = null;
  }

  if(loading !== undefined && loading) {
    text = "Loading...";
  }
  if((loading !== undefined && loading) || countWithoutIgnored === 0) {
    color = "grey-text text-lighten-3";
  }

  const ignore = (evt) => {
    props.ignoreLogs(level, count);
    evt.stopPropagation();
  }
  const ignoreBtn = (
      <MDBBtn outline size="sm" color="purple darken-2" onClick={ignore}
          className={countWithoutIgnored > 0 ? "visible" : "invisible"}>
        <MDBIcon icon="eye-slash" className="mr-2" />Dismiss
      </MDBBtn>
  );

  return (
    <MDBCard onClick={onClick} className={`h-100 ${className}`}>
      <MDBCardBody>
        <div className="d-block d-md-none">
          <MDBIcon className={`big-icon ${color}`} icon={icon} /><br />
          <p className={`mt-3 mb-0 ${loading ? "grey-text" : ""}`}>{text}</p>
          {ignoreBtn}
        </div>
        <div className="d-none d-md-block text-left">
          <MDBIcon className={`${color}`} icon={icon} pull="left" size="5x" fixed />
          <h5 className={loading ? "grey-text" : ""}>{text}</h5>
          {ignoreBtn}
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}

function mapStateToProps(state) {
  return {
    ignored: { ...state.log.ignored },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ignoreLogs: (level, amount) => dispatch(ignoreLogs(level, amount)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogCard);

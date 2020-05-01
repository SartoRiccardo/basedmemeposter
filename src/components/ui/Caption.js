import React from "react";
import { MDBRow, MDBCol, MDBIcon } from "mdbreact";

class Caption extends React.Component {
  render() {
    const { caption, className } = this.props;
    return (
      <MDBRow className="my-2 py-2 mx-1 grey lighten-3">
        <MDBCol className="break-word pr-0 text-justify" size="10">
          <p className={className || ""}>{caption.text}</p>
        </MDBCol>

        <MDBCol className="text-right">
          <MDBIcon className="icon-button" icon="pen" fixed /><br />
          <MDBIcon className="icon-button" icon="copy" fixed /><br />
          <MDBIcon className="icon-button" icon="trash" fixed />
        </MDBCol>
      </MDBRow>
    );
  }
}

export default Caption;

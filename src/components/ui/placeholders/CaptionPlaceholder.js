import React from "react";
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";

function CaptionPlaceholder(props) {
  const { className } = props;

  return (
    <MDBCard className={`w-100 my-2 p-0 mx-1 grey lighten-5 ${className}`}>
      <MDBCardBody className="py-3">
        <MDBRow>
          <MDBCol size="10" />

          <MDBCol className="text-right">
            <MDBIcon className="icon-button disabled" icon="pen" fixed /><br />
            <MDBIcon className="icon-button disabled" icon="copy" fixed /><br />
            <MDBIcon className="icon-button disabled" icon="trash" fixed />
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  );
}

export default CaptionPlaceholder;

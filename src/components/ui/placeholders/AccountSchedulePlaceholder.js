import React from "react";
import { MDBCol, MDBCard, MDBCardBody } from "mdbreact";

function AccountSchedulePlaceholder(props) {
  const { display } = props;

  const placeholder = [];
  for(let i = 0; i < display; i++) {
    const cardBody = (
      <div className="d-block d-md-flex">
        <div className="w-100 pt-100 bg-image d-block d-md-none"></div>
        <div className="w-25 pt-25 bg-image d-none d-md-inline-block"></div>
        <div className="mt-3 mt-md-0 ml-0 ml-md-3 flex-md-grow-1"></div>
      </div>
    );

    placeholder.push(
      <MDBCol key={i} size="12" md="6" className="my-2">
        <MDBCard className="grey lighten-3 z-depth-0">
          <MDBCardBody>
            {cardBody}
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
  }

  return placeholder;
}

export default AccountSchedulePlaceholder;

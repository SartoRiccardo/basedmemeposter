import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from "mdbreact";
import "../../styles/Anonymous.css"
// Custom components
import Login from "../forms/Login"

function Anonymous() {
  return (
    <MDBContainer className="h-100">
      <MDBRow className="h-75">
        <MDBCol className="m-auto" xs="12" md="8" lg="6">

          <MDBCard>
            <MDBCardBody>
              <Login />
            </MDBCardBody>
          </MDBCard>

        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Anonymous;

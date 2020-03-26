import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from "mdbreact";
import "../../styles/Anonymous.css"
// Custom components
import Login from "../forms/Login"

function Anonymous(props) {
  const { pathname, search } = props.history.location;
  if(pathname !== "/" || search !== "") {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <MDBContainer className="h-100">
      <MDBRow className="h-100">
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

export default withRouter(Anonymous);

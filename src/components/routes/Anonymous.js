import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from "mdbreact";
import "../../styles/Anonymous.css";
import { compose } from "redux";
import { connect } from "react-redux";
// Custom components
import Login from "../forms/Login";

function Anonymous(props) {
  const { status } = props
  const { pathname, search } = props.history.location;
  if((pathname !== "/" || search !== "") && status.initialized) {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <div className="anonymous-root">
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
    </div>
  );
}

function mapStateToProps(state) {
  return {
    status: state.status.auth,
  };
}

export default compose(connect(mapStateToProps), withRouter)(Anonymous);

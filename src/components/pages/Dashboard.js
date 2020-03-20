import React from "react";
import { MDBContainer } from "mdbreact";

function Dashboard() {
  let lorem = [];
  for(let i = 0; i < 50; i++) {
    lorem.push(
      <div key={i}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim ven
        iam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea com
        modo consequat. Duis aute irure dolor in reprehenderit in voluptate veli
        t esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat c
        upidatat non proident, sunt in culpa qui officia deserunt mollit anim id
        est laborum.
      </div>
    );
  }

  return (
    <MDBContainer>
      {lorem}
    </MDBContainer>
  );
}

export default Dashboard;

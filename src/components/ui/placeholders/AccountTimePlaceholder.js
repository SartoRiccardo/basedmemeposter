import React from "react";
import { MDBCol } from "mdbreact";

function AccountTimeOnline(props) {
  const { className } = props;

  let columns = [];
  for(let i = 0; i < 24; i++) {
    columns.push(
      <MDBCol key={i} className={`px-1 my-1 ${className}`} size="3" sm="2" md="1">
        <div className="grey lighten-3 mb-0 text-center grey-text">
          {i}:00
        </div>
      </MDBCol>
    );
  }

  return (
    <React.Fragment>
      {columns}
    </React.Fragment>
  );
}

export default AccountTimeOnline;

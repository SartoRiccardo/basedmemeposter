import React from "react";
import { MDBCol } from "mdbreact";
import { isInRangeHours } from "../../util/time";

function AccountTimeOnline(props) {
  const { startTime, endTime, className } = props;
  const nowHours = new Date().getHours();

  let columns = [];
  for(let i = 0; i < 24; i++) {
    const active = isInRangeHours(`${i}:00:00`, startTime, endTime);
    let color, textColor;
    if(active) {
      color = nowHours === i ? "indigo lighten-3" : "deep-purple lighten-4";
      textColor = "black-text";
    }
    else {
      color = nowHours === i ? "grey lighten-2" : "grey lighten-3";
      textColor = nowHours === i ? "black-text" : "grey-text";
    }

    columns.push(
      <MDBCol key={i} className="px-1 my-1" size="3" sm="2" md="1">
        <div className={`mb-0 text-center ${color}`}>
          <span className={textColor}>{i}:00</span>
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

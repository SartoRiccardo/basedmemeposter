import React from "react";
import { MDBIcon } from "mdbreact";
import { isInRangeHours } from "../../util/time";

function AccountSummary(props) {
  const { account, className, onClick } = props;

  const now = new Date();
  const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const active = isInRangeHours(time, account.startTime, account.endTime);
  const disabledClass = !active ? "img-disabled" : null;

  return (
    <div className={`text-center ${className}`} onClick={onClick}>
      <img className={`avatar ${disabledClass}`} src={account.avatar} />
      <p className="mt-2 mb-0">{account.startTime}<br />{account.endTime}</p>
    </div>
  );
}

export default AccountSummary;

import React from "react";
import { isInRangeHours } from "../../util/time";
// Custom components
import Avatar from "./Avatar";

function AccountSummary(props) {
  const { account, className, onClick } = props;

  const now = new Date();
  const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const active = isInRangeHours(time, account.startTime, account.endTime);

  return (
    <div className={`border text-center ${className}`} onClick={onClick}>
      <Avatar image={account.avatar} active={active} />
      <p className="my-2 mb-0">{account.startTime}<br />{account.endTime}</p>
    </div>
  );
}

export default AccountSummary;

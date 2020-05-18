import React from "react";
import { isInRangeHours, toUtcTime } from "../../../util/time";
// Custom components
import Avatar from "./Avatar";

function AccountSummary(props) {
  const { account, className, onClick } = props;

  const now = new Date();
  const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const active = isInRangeHours(time, account.startTime, account.endTime);

  return (
    <div onClick={onClick}
        className={`border text-center hover-no-img-padding grey lighten-5 ${className}`}>
      <Avatar image={account.avatar} active={active} />
      <p className="my-2 mb-0">
        {toUtcTime(account.startTime)}<br />
        {toUtcTime(account.endTime)}
      </p>
    </div>
  );
}

export default AccountSummary;

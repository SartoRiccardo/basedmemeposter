import React from "react";
// Custom components
import AvatarPlaceholder from "./AvatarPlaceholder";

function AccountSummaryPlaceholder(props) {
  const { className } = props;

  return (
    <div className={`grey lighten-3 border text-center ${className}`}>
      <AvatarPlaceholder />
      <p className="my-2 mb-0">--:--:--<br />--:--:--</p>
    </div>
  );
}

export default AccountSummaryPlaceholder;

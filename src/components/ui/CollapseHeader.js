import React from "react";

function CollapseHeader(props) {
  const { className, onClick, children } = props;

  return (
    <div className={`c-pointer py-3 text-uppercase text-center z-depth-1
        font-weight-bold ${className}`}
        onClick={() => typeof onClick === "function" && onClick()}>
      {children}
    </div>
  );
}

export default CollapseHeader;

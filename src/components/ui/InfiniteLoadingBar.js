import React from "react";
import "../../styles/InfiniteLoadingBar.css";

function InfiniteLoadingBar(props) {
  const { color, className } = props;

  return (
    <div className={`loading-bar ${className || ""}`}>
      <div className={`bar-background ${color || "blue"} lighten-3`} />
      <div className={`bar ${color || "blue"} darken-2`} />
    </div>
  );
}

export default InfiniteLoadingBar;

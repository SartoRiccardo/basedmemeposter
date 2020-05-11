import React from "react";
import "../../../styles/Avatar.css";

function AvatarPlaceholder(props) {
  const { className } = props;

  return (
    <div className={`avatar-container ${className}`}>
      <div className="grey lighten-2 avatar placeholder p-2 p-md-3">
        <div className="w-100 pt-100" />
      </div>
    </div>
  );
}

export default AvatarPlaceholder;

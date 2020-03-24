import React from "react";

function SingleLogPlaceholder(props) {
  const { className } = props;

  return (
    <div className={`grey lighten-3 rounded-lg mt-1 px-3 py-1 ${className}`}>
      <div className="d-inline-block">
        <br /><br className="d-md-none" />
      </div>
    </div>
  );
}

export default SingleLogPlaceholder;

import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/MobileNavbar.css";

function MobileNavbarTitle(props) {
  const { children, onClose, to } = props;

  return (
    <div className="mobile-navbar navbar-title">
      <span className="text-center">
        <Link to={to || "#"} onClick={onClose}>{children}</Link>
      </span>
    </div>
  );
}

export default MobileNavbarTitle;

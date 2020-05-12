import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/MobileNavbar.css";

function MobileNavbarLink(props) {
  const { children } = props;

  return (
    <div className="mobile-navbar navbar-title">
      <span className="text-center">
        <Link to="/">{children}</Link>
      </span>
    </div>
  );
}

export default MobileNavbarLink;

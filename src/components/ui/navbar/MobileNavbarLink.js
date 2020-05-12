import React from "react";
import { NavLink } from "react-router-dom";
import "../../../styles/MobileNavbar.css";

function MobileNavbarLink(props) {
  const { to, children, onClose } = props;

  return (
    <div className="mobile-navbar navbar-link">
      <NavLink exact to={to} onClick={onClose}>{children}</NavLink>
    </div>
  );
}

export default MobileNavbarLink;

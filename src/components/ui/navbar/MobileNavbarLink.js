import React from "react";
import { NavLink } from "react-router-dom";
import "../../../styles/MobileNavbar.css";

function MobileNavbarLink(props) {
  const { to, children, onClose, className, onClick } = props;

  const handleClick = () => {
    if(onClick) onClick();
    if(onClose) onClose();
  };

  return (
    <div className={`mobile-navbar navbar-link ${className}`}>
      <NavLink exact to={to} onClick={handleClick}>{children}</NavLink>
    </div>
  );
}

export default MobileNavbarLink;

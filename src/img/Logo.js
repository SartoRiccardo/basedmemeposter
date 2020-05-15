import React from "react";

export default function Logo(props) {
  const { className } = props;

  return (
    <div className={className || ""}>
      <svg xmlns="http://www.w3.org/2000/svg" className="logo" viewBox="0 0 512 512" version="1.1">
        <def>
          <g id="logo">
            <polygon points="262,412 262,50 471,50" fill="rgba(0,0,0,0)" strokeWidth="14" stroke="#eeeeee" />
            <circle cx="256" cy="175" r="75" strokeWidth="14" stroke="#eeeeee" fill="#b71c1c" />
            <polygon points="0,0 256,512 256,0" strokeWidth="5" fill="#ff9100" />
          </g>
        </def>

        <use href="#logo" />
      </svg>
    </div>
  );
}

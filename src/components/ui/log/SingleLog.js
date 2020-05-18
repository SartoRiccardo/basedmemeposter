import React from "react";
import { Link } from "react-router-dom";
import { MDBIcon } from "mdbreact";
import moment from "moment";

const levelStyling = {
  debug: {background: "white", icon: "bug", color:"black"},
  info: {background: "teal lighten-5", icon: "info-circle", color:"light-blue"},
  warning: {background: "yellow lighten-4", icon: "exclamation-triangle", color:"amber"},
  error: {background: "deep-orange lighten-4", icon: "exclamation-circle", color:"red"},
  critical: {background: "red lighten-3", icon: "skull", color:"black"},
};

function SingleLog(props) {
  const { message, account, level, date } = props.log;
  const { background, color, icon } = levelStyling[level];

  const dateText = moment(date).fromNow();

  const username = account && (
    <Link to={`/accounts/${account.id}`} className="black-text">
      <u>{account.username}</u>
    </Link>
  );

  return (
    <div className={`${background} rounded-lg mt-1 px-3 py-1 clearfix`}>
      <div className="d-block d-md-inline-block text-left">
        <MDBIcon icon={icon} className={`mr-2 ${color}-text`} fixed />

        <span className="text-uppercase mr-3">
          {username}
        </span>

        <span className="d-inline-block d-md-none float-right">
          {dateText}
        </span>
      </div>

      {message}

      <div className="d-none d-md-inline-block text-right float-md-right">
        {dateText}
      </div>
    </div>
  );
}

export default SingleLog;

import React from "react";
import { Link } from "react-router-dom";
import { MDBIcon } from "mdbreact";
import moment from "moment";

const levelStyling = {
  debug: {background: "grey lighten-4", icon: "bug", color:"black"},
  info: {background: "teal lighten-5", icon: "info", color:"light-blue"},
  warning: {background: "yellow lighten-4", icon: "exclamation-triangle", color:"amber"},
  error: {background: "deep-orange lighten-4", icon: "exclamation-circle", color:"red"},
  critical: {background: "red lighten-3", icon: "skull", color:"black"},
};

function SingleLog(props) {
  const { message, account, level, date } = props.log;
  const { background, color, icon } = levelStyling[level];

  const dateText = moment.utc(date, "YYYY-MM-DD HH:mm:ss").fromNow();

  const username = account && (
    <Link to={`/accounts/${account.id}`} className="black-text text-uppercase">
      <u>{account.username}</u>
    </Link>
  );

  const messageSection = level === "critical" ? (
    <div className="stack-trace">
      <code>
        {message}
      </code>
    </div>
  ) : ( <div>{message}</div> );

  const py = username ? 2 : 1;

  return (
    <div className={`${background} rounded-lg mt-1 px-3 py-${py} clearfix`}>
      <div className="text-left">
        <MDBIcon icon={icon} className={`mr-2 ${color}-text`} fixed />

        <span className="mr-3">
          {username || message}
        </span>

        <span className="float-right">
          {dateText}
        </span>
      </div>

      {username && messageSection}
    </div>
  );
}

export default SingleLog;

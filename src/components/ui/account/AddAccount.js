import React from "react";
import { useHistory } from "react-router-dom";
// Custom components
import Avatar from "./Avatar";

function AddAccount(props) {
  const { className } = props;

  const history = useHistory();
  return (
    <div onClick={() => history.push("/accounts/new")}
        className={`border text-center hover-no-img-padding ${className}`}>
      <Avatar plus />
      <p className="my-2 mb-0"><br/><br/></p>
    </div>
  );
}

export default AddAccount;

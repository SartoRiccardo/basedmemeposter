import React from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
// HOCs and actions
import { connect } from "react-redux";
// Custom components
import LogCard from "../ui/log/LogCard";
import AccountSummary from "../ui/account/AccountSummary";

function Dashboard(props) {
  const { account, log, history } = props;

  let warnings = 0;
  let errors = 0;
  for(const l of log.logs) {
    if(l.level === "warning") {
      warnings++;
    }
    else if(l.level === "warning") {
      errors++;
    }
  }

  let accountsUi = [];
  for(const a of account.accounts) {
    accountsUi.push(
      <MDBCol key={a.id} size="6" sm="4" md="3" lg="2" className="px-1">
        <AccountSummary
          onClick={() => history.push(`/accounts/${a.id}`)}
          className="white rounded-lg mx-1 my-2 p-2 c-pointer"
          account={a}
        />
      </MDBCol>
    );
  }

  return (
    <MDBContainer>
      <MDBRow className="px-3 text-center">
        <MDBCol size="6" className="px-1 my-3">
          <LogCard
            onClick={() => history.push("/logs?levels=warning")}
            className="c-pointer hover-darken"
            level="warning"
            count={warnings}
          />
        </MDBCol>

        <MDBCol size="6" className="px-1 my-3">
          <LogCard
            onClick={() => history.push("/logs?levels=error")}
            className="c-pointer hover-darken"
            level="error"
            count={errors}
          />
        </MDBCol>
      </MDBRow>

      <MDBRow className="mt-3">
        <MDBCol size="12">
          <h2 className="text-center mb-0">Accounts</h2>
          <hr className="mt-0 w-50" />
        </MDBCol>
      </MDBRow>

      <MDBRow className="border account-summaries grey lighten-4 mx-0">
        {accountsUi}
      </MDBRow>
    </MDBContainer>
  );
}

function mapStateToProps(state) {
  const { account, log } = state.status;
  return {
    account: { ...state.account },
    log: { ...state.log },
    status: {
      account,
      log,
    },
  };
}

export default connect(mapStateToProps)(Dashboard);

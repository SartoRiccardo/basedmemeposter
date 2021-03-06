import React from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
// HOCs and actions
import { connect } from "react-redux";
// Custom components
import LogCard from "../ui/log/LogCard";
import AccountSummary from "../ui/account/AccountSummary";
import AddAccount from "../ui/account/AddAccount";
import AccountSummaryPlaceholder from "../ui/placeholders/AccountSummaryPlaceholder";

function Dashboard(props) {
  const { account, log, status, history } = props;
  document.title = `Dashboard - ${process.env.REACT_APP_TITLE}`;

  let accountsUi = [];
  if(status.account.initialized) {
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
  }
  else {
    for(let i = 0; i < 6; i++) {
      const truncateClass = i >= 4 ? "d-block d-md-none d-lg-block" : "";
      accountsUi.push(
        <MDBCol key={i} size="6" sm="4" md="3" lg="2" className={`px-1 ${truncateClass}`}>
          <AccountSummaryPlaceholder
            className="rounded-lg mx-1 my-2 p-2"
          />
        </MDBCol>
      );
    }
  }

  return (
    <MDBContainer>
      <MDBRow className="px-3 text-center">
        <MDBCol size="6" className="px-1 my-3">
          <LogCard
            onClick={() => history.push("/logs?levels=warning")}
            className="c-pointer hover-darken"
            level="warning"
            loading={!status.log.initialized || log.ignored.warning === null}
            count={log.count.warning}
          />
        </MDBCol>

        <MDBCol size="6" className="px-1 my-3">
          <LogCard
            onClick={() => history.push("/logs?levels=error,critical")}
            className="c-pointer hover-darken"
            level="error"
            loading={!status.log.initialized || log.ignored.error === null}
            count={log.count.error}
          />
        </MDBCol>
      </MDBRow>

      <MDBRow className="mt-3">
        <MDBCol size="12">
          <h2 className="text-center mb-0">Accounts</h2>
          <hr className="mt-0 w-50" />
        </MDBCol>
      </MDBRow>

      <MDBRow className="mx-0">
        {accountsUi}

        {
          status.account.initialized &&
          <MDBCol size="6" sm="4" md="3" lg="2" className="px-1">
            <AddAccount className="white rounded-lg mx-1 my-2 p-2 c-pointer" />
          </MDBCol>
        }
      </MDBRow>
    </MDBContainer>
  );
}

function mapStateToProps(state) {
  const { account, log } = state.status;
  return {
    account: state.account,
    log: state.log,
    status: {
      account,
      log,
    },
  };
}

export default connect(mapStateToProps)(Dashboard);

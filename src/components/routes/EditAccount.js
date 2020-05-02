import React from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import AccountForm from "../forms/AccountForm";
import { connect } from "react-redux";
import { updateAccount } from "../../storage/actions/account";
import { strToTime } from "../../util/time";

class EditAccount extends React.Component {
  constructor(props) {
    super(props);

    const { match } = this.props;
    this.titleTemplate = "Edit :accountName - Mastermemed";
    this.state = {
      currentAccount: parseInt(match.params.id),
    };

    this.setDocumentTitle();
  }

  componentDidUpdate(previousProps) {
    const { match, status } = this.props;
    if(parseInt(match.params.id) !== this.state.currentAccount) {
      this.setState({ currentAccount: parseInt(match.params.id) });
    }

    const areUpdatingActions = action => action.type === "UPDATE_ACCOUNT";
    const updatingFinished = !status.actions.some(areUpdatingActions) &&
      previousProps.status.actions.some(areUpdatingActions);
    if(updatingFinished) {
      const { history } = this.props;
      history.push(`/accounts/${parseInt(match.params.id)}`);
    }

    this.setDocumentTitle();
  }

  setDocumentTitle = () => {
    const { match, accounts } = this.props;

    const matchingAccounts = accounts.filter(
      account => account.id === parseInt(match.params.id)
    );
    if(matchingAccounts.length) {
      document.title = this.titleTemplate.replace(":accountName", matchingAccounts[0].username);
    }
  }

  submit = evt => {
    const { updateAccount } = this.props;
    const { startTime, endTime } = evt.account;

    updateAccount(
      this.state.currentAccount,
      {
        ...evt.account,
        startTime: startTime.toString().padStart(2, "0") + ":00:00",
        endTime: endTime.toString().padStart(2, "0") + ":00:00",
      },
      evt.passwordChanged
    );
  }

  render() {
    const { status, accounts } = this.props;

    if(!status.initialized) {
      return null;
    }

    const isModifying = status.actions.some(
      action => action.type === "ADD_ACCOUNT"
    );

    let matchingAccount = null;
    for(const account of accounts) {
      if(account.id === this.state.currentAccount) {
        matchingAccount = {
          ...account,
          startTime: strToTime(account.startTime).hours,
          endTime: strToTime(account.endTime).hours,
        };
        break;
      }
    }

    if(matchingAccount === null) {
      return ( <p>TODO missing</p> );
    }

    return (
      <MDBContainer>
        <MDBRow className="mt-3">
          <MDBCol>
            <h1 className="text-center">Update Account</h1>
            <hr className="mt-0" />
          </MDBCol>
        </MDBRow>

        <AccountForm update onSubmit={this.submit} disabled={isModifying}
          defaultValue={matchingAccount} key={this.state.currentAccount} />
      </MDBContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.account.accounts,
    status: state.status.account,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateAccount: (id, account, passwordChanged) => dispatch(updateAccount(id, account, passwordChanged)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAccount);

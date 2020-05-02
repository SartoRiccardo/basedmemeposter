import React from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import AccountForm from "../forms/AccountForm";
import { connect } from "react-redux";
import { addAccount } from "../../storage/actions/account";
import { getUserAvatar } from "../../util/instagram";

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);

    this.avatarSearch = null;
    this.state = {
      avatar: null,
      lastAvatarSearchId: 0,
    };
    document.title = `New Account - ${process.env.REACT_APP_TITLE}`;
  }

  componentDidUpdate(previousProps) {
    if(this.props.accounts.length > previousProps.accounts.length &&
        previousProps.status.initialized) {
      const { history } = this.props;
      const newAccountId = this.props.accounts[this.props.accounts.length-1].id;
      history.push(`/accounts/${newAccountId}`);
    }
  }

  componentWillUnmount() {
    if(this.avatarSearch) {
      clearTimeout(this.avatarSearch);
    }
  }

  /**
   * This function will remain unused as of now to not waste Instagram's public API's
   * limit rates, as I don't know what they are just yet and I fear of getting
   * IP banned from it permanently.
   */
  previewAvatar = async username => {
    return;

    // eslint-disable-next-line
    const currentAvatarSearchId = Math.random();
    try {
      await this.setState({ lastAvatarSearchId: currentAvatarSearchId });
      this.avatarSearch = setTimeout(
        async () => {
          if(this.state.lastAvatarSearchId !== currentAvatarSearchId) return;

          const avatar = await getUserAvatar(username);
          this.setState(
            state => state.lastAvatarSearchId === currentAvatarSearchId ? { avatar } : {}
          );
        },
        2000,
      );
    }
    // eslint-disable-next-line
    catch(e) {
      this.setState({ avatar: null });
    }
  }

  submit = evt => {
    const { addAccount } = this.props;
    const { username, password, startTime, endTime } = evt.account;

    addAccount({
      username, password,
      startTime: startTime.toString().padStart(2, "0") + ":00:00",
      endTime: endTime.toString().padStart(2, "0") + ":00:00",
    });
  }

  render() {
    const { status } = this.props;

    if(!status.initialized) {
      return null;
    }

    const isAdding = status.actions.some(
      action => action.type === "ADD_ACCOUNT"
    );
    return (
      <MDBContainer>
        <MDBRow className="mt-3">
          <MDBCol>
            <h1 className="text-center">Register Account</h1>
            <hr className="mt-0" />
          </MDBCol>
        </MDBRow>

        <AccountForm onSubmit={this.submit} disabled={isAdding} />
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
    addAccount: (account) => dispatch(addAccount(account)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);

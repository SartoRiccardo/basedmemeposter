import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from "mdbreact";
import { connect } from "react-redux";
import { addAccount } from "../../storage/actions/account";
import { getUserAvatar } from "../../util/instagram";

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      startTime: 0,
      endTime: 0,
      avatar: null,
      lastAvatarSearchId: 0,
    };
  }

  componentDidUpdate(previousProps) {
    if(this.props.accounts.length > previousProps.accounts.length &&
        previousProps.status.initialized) {
      const { history } = this.props;
      const newAccountId = this.props.accounts[this.props.accounts.length-1].id;
      history.push(`/accounts/${newAccountId}`);
    }
  }

  previewAvatar = async username => {
    return;

    // eslint-disable-next-line
    const currentAvatarSearchId = Math.random();
    try {
      await this.setState({ lastAvatarSearchId: currentAvatarSearchId });
      const avatar = getUserAvatar(username);
      this.setState(
        state => state.lastAvatarSearchId === currentAvatarSearchId ? { avatar } : {}
      );
    }
    catch(e) {
      this.setState({ avatar: null });
    }
  }

  updateInputValue = evt => {
    const { name, value } = evt.target;

    const numericValues = [ "startTime", "endTime" ];
    this.setState(
      { [ name ]: numericValues.includes(name) ? parseInt(value) : value },
      () => {
        if(name === "username") this.previewAvatar(value);
      }
    );
  }

  submit = evt => {
    const { addAccount } = this.props;
    const { username, password, startTime, endTime } = this.state;
    evt.preventDefault();

    addAccount({
      username, password,
      startTime: startTime.toString().padStart(2, "0") + ":00:00",
      endTime: endTime.toString().padStart(2, "0") + ":00:00",
    });
  }

  render() {
    const { username, password, startTime, endTime } = this.state;
    const { status } = this.props;

    if(!status.initialized) {
      return null;
    }

    const isAdding = status.actions.some(
      action => action.type === "ADD_ACCOUNT"
    );

    const activeHours = endTime >= startTime ?
        endTime - startTime : (24 - startTime) + endTime;
    return (
      <MDBContainer>
        <MDBRow className="mt-3">
          <MDBCol>
            <h1 className="text-center">Register Account</h1>
            <hr className="mt-0" />
          </MDBCol>
        </MDBRow>

        <form className="text-center" onSubmit={this.submit}>
          <MDBRow>
            <MDBCol md="6" className="order-md-1">
              <div className="no-input-margine">
                <MDBInput name="username" onChange={this.updateInputValue}
                    label="Nome" value={username}
                    className="my-2 my-md-0" disabled={isAdding} />
              </div>
            </MDBCol>

            <MDBCol md="6" className="order-md-3">
              <div className="no-input-margine">
                <MDBInput type="password" name="password" value={password}
                    onChange={this.updateInputValue} label="Password"
                    className="mb-4 my-md-0" disabled={isAdding} />
              </div>
            </MDBCol>

            <MDBCol md="6" className="order-md-2">
              <p className="mb-0 mt-4">
                Start posting at: <b>{startTime < 10 && "0"}{startTime}:00:00</b>
              </p>
              <input type="range" className="custom-range" min="0" max="23" step="1"
                  onChange={this.updateInputValue} value={startTime}
                  name="startTime" disabled={isAdding}/>
            </MDBCol>

            <MDBCol md="6" className="order-md-4">
              <p className="mb-0 mt-4">
                Stop posting at: <b>{endTime < 10 && "0"}{endTime}:00:00</b>
              </p>
              <input type="range" className="custom-range" min="0" max="23" step="1"
                  onChange={this.updateInputValue} value={endTime}
                  name="endTime" disabled={isAdding}/>
              <p>For a total of <b>{activeHours} hours</b></p>
            </MDBCol>

            <MDBCol size="12" className="order-md-last">
              <MDBBtn type="submit" color="purple" disabled={isAdding}>Add</MDBBtn>
            </MDBCol>
          </MDBRow>
        </form>
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

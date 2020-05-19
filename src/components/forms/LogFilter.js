import React from "react";
import { MDBRow, MDBCol, MDBBtn } from "mdbreact";
// HOCs and actions
import { connect } from "react-redux";

class LogFilter extends React.Component {
  constructor(props) {
    super(props);

    const { defaultValue, value } = this.props;
    this.state = {
      accounts: (defaultValue && defaultValue.accounts) ||
          (value && value.accounts) || [],
      levels: (defaultValue && defaultValue.levels) ||
          (value && value.levels) || [],
    };
  }

  changeChecked = (group, id) => {
    return () => {
      const { onChange } = this.props;
      const current = this.state[group];
      const newGroup = current.includes(id) ?
          current.filter((selected) => selected !== id) :
          [...current, id] ;

      this.setState({
        [ group ]: newGroup,
      }, () => {
        onChange && onChange({
          change: {
            group,
            value: id,
            new: !current.includes(id),
          },
          state: this.state,
        });
      });
    };
  }

  render() {
    const { value } = this.props;
    const { levels } = this.props.log;
    const { accounts } = this.props.account;

    const accountCheckboxes = accounts.map(acct => {
      const checked = (value.accounts && value.accounts.includes(acct.id)) ||
          (value.accounts === undefined && this.state.accounts.includes(acct.id));
      return (
        <React.Fragment key={acct.id}>
          <MDBCol className="d-flex px-1" size="12" sm="6" lg="4">
            <MDBBtn className="w-100 my-0 my-sm-2"
                onClick={this.changeChecked("accounts", acct.id)}
                outline={!checked} color="purple">
              {acct.username}
            </MDBBtn>
          </MDBCol>
        </React.Fragment>
      );
    })

    const logLevelButtons = levels.map((level, i) => {
      const checked = (value.levels && value.levels.includes(level)) ||
          (value.levels === undefined && this.state.levels.includes(level));
      const btn = (
        <MDBBtn onClick={this.changeChecked("levels", level)}
            className="w-100 my-0 my-sm-2"
            outline={!checked} color="purple">
          {level}
        </MDBBtn>
      );
      return (
        <React.Fragment key={level}>
          <MDBCol className="d-flex d-md-none px-1" size="12"
              sm={i <= levels.length-3 ? "4" : "6"}>
            {btn}
          </MDBCol>
          <MDBCol className="d-none d-md-flex px-1">
            {btn}
          </MDBCol>
        </React.Fragment>
      );
    })

    return (
      <React.Fragment>
        <h3 className="text-center">Accounts</h3>
        <MDBRow className="text-uppercase mb-3">
          {accountCheckboxes}
        </MDBRow>

        <h3 className="text-center">Levels</h3>
        <MDBRow>
          {logLevelButtons}
        </MDBRow>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    log: { ...state.log },
    account: { ...state.account },
  };
}

export default connect(mapStateToProps)(LogFilter);

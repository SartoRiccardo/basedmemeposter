import React from "react";
import { MDBRow, MDBCol, MDBCollapse, MDBBtn, MDBBtnGroup } from "mdbreact";
// HOCs and actions
import { connect } from "react-redux";
// Custom components
import CollapseHeader from "../ui/CollapseHeader";
import CheckBox from "./CheckBox";

class LogFilter extends React.Component {
  constructor(props) {
    super(props);

    const { defaultValue, value } = this.props;
    this.state = {
      accounts: (defaultValue && defaultValue.accounts) ||
          (value && value.accounts) || [],
      levels: (defaultValue && defaultValue.levels) ||
          (value && value.levels) || [],
      open: null,
    };
  }

  clickedAccordion = (id) => {
    return () => {
      const { open } = this.state;
      this.setState({
        open: open === id ? null : id,
      });
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
    const { open } = this.state;

    // const accountCheckboxes = accounts.map((a) => {
    //   const checked = (value.accounts && value.accounts.includes(a.id)) ||
    //       (value.accounts === undefined && this.state.accounts.includes(a.id));
    //   return (
    //     <MDBCol size="12" md="4" key={a.id}>
    //       <CheckBox
    //         label={a.username}
    //         onChange={this.changeChecked("accounts", a.id)}
    //         checked={checked}
    //       />
    //     </MDBCol>
    //   );
    // });

    const accountCheckboxes = accounts.map(acct => {
        return (
          <React.Fragment key={acct.id}>
            <MDBCol className="d-flex px-1" size="12" sm="6" lg="4">
              <MDBBtn className="w-100 my-0 my-sm-2"
                  onClick={this.changeChecked("accounts", acct.id)}
                  outline={!this.state.accounts.includes(acct.id)} color="purple">
                {acct.username}
              </MDBBtn>
            </MDBCol>
          </React.Fragment>
        );
    })

    const logLevelButtons = levels.map((level, i) => {
      const btn = (
        <MDBBtn onClick={this.changeChecked("levels", level)}
            className="w-100 my-0 my-sm-2"
            outline={!this.state.levels.includes(level)} color="purple">
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

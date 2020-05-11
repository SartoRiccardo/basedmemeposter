import React from "react";
import { MDBRow, MDBCol, MDBCollapse } from "mdbreact";
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

    const accountCheckboxes = accounts.map((a) => {
      const checked = (value.accounts && value.accounts.includes(a.id)) ||
          (value.accounts === undefined && this.state.accounts.includes(a.id));
      return (
        <MDBCol size="12" md="4" key={a.id}>
          <CheckBox
            label={a.username}
            onChange={this.changeChecked("accounts", a.id)}
            checked={checked}
          />
        </MDBCol>
      );
    });
    const logLevelCheckboxes = levels.map((l, i) => {
      const checked = (value.levels && value.levels.includes(l)) ||
          (value.levels === undefined && this.state.levels.includes(l));
      return (
        <MDBCol key={i} size="6" md="4">
          <CheckBox
            label={l}
            onChange={this.changeChecked("levels", l)}
            checked={checked}
          />
        </MDBCol>
      );
    });

    return (
      <React.Fragment>
        <CollapseHeader className="indigo lighten-3" onClick={this.clickedAccordion(0)}>
          <h3 className="mb-0">Accounts</h3>
        </CollapseHeader>
        <MDBCollapse isOpen={open === 0}>
          <MDBRow className="m-3 text-uppercase">
            {accountCheckboxes}
          </MDBRow>
        </MDBCollapse>

        <CollapseHeader className="indigo lighten-3" onClick={this.clickedAccordion(1)}>
          <h3 className="mb-0">Levels</h3>
        </CollapseHeader>
        <MDBCollapse isOpen={open === 1}>
          <MDBRow className="m-3 text-uppercase">
            {logLevelCheckboxes}
          </MDBRow>
        </MDBCollapse>
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

import React from "react";
import { withRouter, Link } from "react-router-dom";
import { MDBIcon, MDBNavbar, MDBNavbarBrand, MDBNavbarNav,
    MDBNavItem, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu,
    MDBDropdownItem, MDBNavLink, MDBCollapse, MDBNavbarToggler } from "mdbreact";
import MobileNavbar from "./navbar/MobileNavbar";
import MobileNavbarLink from "./navbar/MobileNavbarLink";
import MobileNavbarTitle from "./navbar/MobileNavbarTitle";
import MobileNavbarDropdown from "./navbar/MobileNavbarDropdown";
// HOCs and actions
import { compose } from "redux";
import { connect } from "react-redux";
import { logout } from "../../storage/actions/auth";

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  toggleCollapse = () => {
    const { open } = this.state;
    this.setState({
      open: !open,
    });
  }

  performLogout = () => {
    const { logout, history } = this.props;

    logout();
    history.push("/");
  }

  render() {
    const { accounts } = this.props.account;
    const { open } = this.state;

    const dropdownLinks = accounts.map((a) => {
      return (
        <MDBDropdownItem key={a.id}>
          <Link to={`/accounts/${a.id}`}>{a.username}</Link>
        </MDBDropdownItem>
      );
    });

    return (
      <MDBNavbar color="purple darken-2" dark expand="md">
        <MDBNavbarBrand href="/">
          <MDBIcon className="mr-2" fab icon="instagram" />
          {process.env.REACT_APP_TITLE}
        </MDBNavbarBrand>

        <MDBNavbarToggler onClick={this.toggleCollapse} />

        <MDBCollapse navbar>
          <MDBNavbarNav left>
            <MDBNavItem>
              <MDBNavLink to="/">Dashboard</MDBNavLink>
            </MDBNavItem>

            <MDBNavItem>
              <MDBNavLink to="/logs">Logs</MDBNavLink>
            </MDBNavItem>

            <MDBNavItem>
              <MDBNavLink to="/captions">Captions</MDBNavLink>
            </MDBNavItem>

            <MDBNavItem>
              <MDBNavLink to="/sources">Sources</MDBNavLink>
            </MDBNavItem>

            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <span className="mr-2">Accounts</span>
                </MDBDropdownToggle>

                <MDBDropdownMenu>
                  {dropdownLinks}
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem>
          </MDBNavbarNav>

          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <MDBIcon icon="user" />
                </MDBDropdownToggle>

                <MDBDropdownMenu right>
                  <MDBDropdownItem onClick={this.performLogout}>
                    Logout
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>

        <MobileNavbar open={open} onClose={this.toggleCollapse}>
          <MobileNavbarTitle to="/">
            <MDBIcon className="mr-2" fab icon="instagram" />
            {process.env.REACT_APP_TITLE}
          </MobileNavbarTitle>

          <MobileNavbarLink to="/">Dashboard</MobileNavbarLink>
          <MobileNavbarLink to="/logs">Logs</MobileNavbarLink>
          <MobileNavbarLink to="/captions">Captions</MobileNavbarLink>
          <MobileNavbarLink to="/sources">Sources</MobileNavbarLink>
          <MobileNavbarDropdown>
            <MobileNavbarTitle>Accounts</MobileNavbarTitle>
            {
              accounts.map(({ id, username }) =>
                <MobileNavbarLink to={`/accounts/${id}`} key={id}>
                  {username}
                </MobileNavbarLink>
              )
            }
          </MobileNavbarDropdown>
          <MobileNavbarLink to="#" onClick={this.performLogout}>Logout</MobileNavbarLink>
        </MobileNavbar>
      </MDBNavbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.account,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(Navbar);

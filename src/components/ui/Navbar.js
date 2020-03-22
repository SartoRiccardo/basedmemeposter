import React from "react";
import { Link } from "react-router-dom";
import { MDBIcon, MDBNavbar, MDBNavbarBrand, MDBNavbarNav,
    MDBNavItem, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu,
    MDBDropdownItem, MDBNavLink, MDBCollapse, MDBNavbarToggler } from "mdbreact";
// HOCs and actions
import { connect } from "react-redux";

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
          Based Meme Poster
        </MDBNavbarBrand>

        <MDBNavbarToggler onClick={this.toggleCollapse} />

        <MDBCollapse isOpen={open}>
          <MDBNavbarNav left>
            <MDBNavItem>
              <MDBNavLink to="/">Dashboard</MDBNavLink>
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
        </MDBCollapse>
      </MDBNavbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: { ...state.account },
  };
}

export default connect(mapStateToProps)(Navbar);

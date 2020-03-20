import React from "react";
import { Link } from "react-router-dom";
import { MDBIcon, MDBNavbar, MDBNavbarBrand, MDBNavbarNav,
    MDBNavItem, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu,
    MDBDropdownItem, MDBNavLink } from "mdbreact";

class Navbar extends React.Component {
  render() {
    const accounts = [
      {id:1, username: "basedmemeposter"},
      {id:2, username: "siarnaq_rulez"},
      {id:3, username: "yet_another_succcc_clone"},
    ];

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
      </MDBNavbar>
    );
  }
}

export default Navbar

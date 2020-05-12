import React from "react";
import { MDBCollapse, MDBIcon } from "mdbreact";
import MobileNavbarLink from "./MobileNavbarLink";
import MobileNavbarTitle from "./MobileNavbarTitle";

class MobileNavbarDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  toggleCollapse = () => {
    this.setState(state => ({ open: !state.open }))
  }

  render() {
    const { children, onClose } = this.props;

    const links = React.Children.toArray(children)
        .filter(child => child.type === MobileNavbarLink)
        .map(link => React.cloneElement(link, { className: (link.props.className || "") + " collapse-link" }));
    console.log(links);

    const titles = React.Children.toArray(children).filter(child => child.type === MobileNavbarTitle);
    const title = (titles && titles[0].props.children) || null;
    return (
      <div>
        <div className="mobile-navbar navbar-collapse-header" onClick={this.toggleCollapse}>
          <a href="#">
            {title}
            <span className="float-right mr-4">
              <MDBIcon icon={this.state.open ? "caret-up" : "caret-down"} />
            </span>
          </a>
        </div>
        <MDBCollapse isOpen={this.state.open} className="ml-3">
          {links}
        </MDBCollapse>
      </div>
    );
  }
}

export default MobileNavbarDropdown

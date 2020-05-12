import React from "react";
import "../../../styles/MobileNavbar.css";

class MobileNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.lastTransitionId = null;
    this.state = {
      visible: false,
      displayed: false,
    };
  }

  onClose = () => {
    const { onClose } = this.props;
    if(onClose) {
      onClose();
    }
  }

  componentDidUpdate(prevProps) {
    const { open } = this.props;
    const transitionId = Math.random();

    if(open && !prevProps.open) {
      this.lastTransitionId = transitionId
      this.setState({ displayed: true });
      setTimeout(() => {
        if(this.lastTransitionId === transitionId) this.setState({ visible: true });
      }, 20);
    }

    if(!open && prevProps.open) {
      this.lastTransitionId = transitionId
      this.setState({ visible: false });
      setTimeout(() => {
        if(this.lastTransitionId === transitionId) this.setState({ displayed: false });
      }, 500);
    }
  }

  render() {
    const { children, open } = this.props;

    let newChildren = children.map((child, i) => {
      return React.cloneElement(child, { onClose: this.onClose, key: i });
    });

    let backdropClass = "";
    if(this.state.visible) {
      backdropClass += " active";
    }
    if(this.state.displayed) {
      backdropClass += " navbar-visible";
    }

    return (
      <React.Fragment>
        <div className={`mobile-navbar backdrop ${backdropClass}`} onClick={this.onClose} />
        <div className={`mobile-navbar navbar-container purple darken-2 ${open ? "active" : ""}`}>
          {newChildren}
        </div>
      </React.Fragment>
    );
  }
}

export default MobileNavbar;

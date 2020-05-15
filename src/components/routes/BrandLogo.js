import React from "react";
import Logo from "../../img/Logo";
import "../../styles/BrandLogo.css";

class BrandLogo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lowConnection: false,
    };
    document.title = `${process.env.REACT_APP_TITLE}`;
  }

  componentDidMount() {
    this.lowConnectionCountdown = setInterval(
      () => this.setState({ lowConnection: true }),
      10 * 1000,
    );
  }

  componentWillUnmount() {
    clearTimeout(this.lowConnectionCountdown);
  }

  render() {
    const { lowConnection } = this.state;

    return (
      <div className="h-100 purple darken-4">
        <div className="vertical-center horizontal-center">
          <Logo className={`w-75 h-75 ${lowConnection ? "faded" : ""}`} />

          <h2 className={`low-connection-msg ${lowConnection ? "active" : ""}`}>
            <span className="text-uppercase">Slow internet?</span>
            <br />
            Communicating with the server...
          </h2>
        </div>
      </div>
    );
  }
}

export default BrandLogo;

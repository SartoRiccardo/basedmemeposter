import React from "react";

class BrandLogo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lowConnection: false,
    };
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

    const lowConnectionMessage = lowConnection ? (
      <p className="white-text">Could not retrieve data</p>
    ) : null;

    return (
      <div className="h-100 purple darken-4">
        {lowConnectionMessage}
      </div>
    );
  }
}

export default BrandLogo;

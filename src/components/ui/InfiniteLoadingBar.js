import React from "react";
import "../../styles/InfiniteLoadingBar.css";

class InfiniteLoadingBar extends React.Component {
  constructor(props) {
    super(props);

    this.animationProperties = [
      {left: -10, right: 100},
      {left: 50, right: -10},
      {left: 110, right: -10},
      null,
      {left: 0, right: 100},
      {left: 0, right: 50},
      {left: 100, right: -10},
      null,
    ];
    this.state = {
      animation: 0,
    };
  }

  update = (state) => {
    const { animation } = state;

    return {
      animation: (animation+1 < this.animationProperties.length) ? animation+1 : 0,
    }
  }

  componentDidMount() {
    this.animationUpdater = setInterval(
      () => this.setState((state) => this.update(state)),
      500,
    );
  }

  componentWillUnmount() {
    clearInterval(this.animationUpdater);
  }

  render() {
    const { color, className } = this.props;
    const { animation } = this.state;

    let progressCoords;
    if(this.animationProperties[animation]) {
      const { left, right } = this.animationProperties[animation];
      progressCoords = {
        left: `${left}%`,
        right: `${right}%`,
      };
    }
    else {
      progressCoords = {
        left: "0",
        right: "100%",
        visibility: "hidden",
      };
    }

    return (
      <div className={`infinite-loader-container pt-1 ${color}
          lighten-3 ${className}`}>
        <div className={`infinite-loader ${color} darken-2`} style={progressCoords} />
      </div>
    );
  }
}

export default InfiniteLoadingBar;

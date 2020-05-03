import React from "react";
import "../../styles/Notification.css";
// HOCs and actions
import { connect } from "react-redux";

class ErrorNotification extends React.Component {
  constructor(props) {
    super(props);

    this.animationTimeout = null;
    this.state = {
      message: null,
      fading: false,
    };
  }

  componentDidUpdate(previous) {
    const { errors } = this.props;
    if(errors.length > previous.errors.length) {
      const currentLen = errors.length;
      const newError = errors[errors.length-1];

      let message;
      switch(newError) {
        case 401:
          message = "You don't have the necessary permissions";
          break;

        case 403:
          message = "That action is forbidden";
          break;

        default:
          message = newError;
      }

      this.setState({ message, fading: true });
      this.animationTimeout = setTimeout(() => {
        if(this.props.errors.length === currentLen) {
          this.setState({ fading: false });
          this.animationTimeout = setTimeout(() => {
            if(this.props.errors.length === currentLen) {
              this.setState({ message: null });
            }
          }, 1500);
        }
      }, 5000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.animationTimeout);
  }

  render() {
    const { message, fading } = this.state;

    let animationStatus = "";
    if(fading) {
      animationStatus = "active";
    }
    else if(message) {
      animationStatus = "fading";
    }

    return (
      <div className={`notification red accent-4 text-center ${animationStatus}`}>
        <p className="text-white lead m-0 text-uppercase">{message}</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let errors = [];
  for(const [ , config ] of Object.entries(state.status)) {
    errors = [ ...errors, ...config.errors];
  }
  return { errors };
};

export default connect(mapStateToProps)(ErrorNotification);

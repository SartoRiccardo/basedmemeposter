import React from "react";
import { MDBInput, MDBBtn } from "mdbreact";
// HOCs and actions
import { connect } from "react-redux";
import { login } from "../../storage/actions/auth";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
    };
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    if(evt.target.checkValidity()) {
      const { username, password } = this.state;
      this.props.login(username, password);
    }
  }

  handleChange = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  render() {
    const { errors } = this.props.status.auth;
    const { username, password } = this.state;

    const failedAuth = errors.length > 0 && errors[errors.length-1] === 401;
    const failedMessage = failedAuth ? (
      <div className="red-text text-center">
        <p>The credentials you have provided are incorrect</p>
      </div>
    ) : null;

    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <h2 className="text-center">WELCOME BACK</h2>
        <div className="grey-text">
          <MDBInput label="Username" icon="user" name="username"
              value={username} required onChange={this.handleChange} />
          <MDBInput label="Password" icon="lock" type="password" name="password"
              value={password} required onChange={this.handleChange} />
        </div>

        {failedMessage}

        <div className="text-center">
          <MDBBtn type="submit" color="purple">Login</MDBBtn>
        </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.status,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (user, pswd) => dispatch(login(user, pswd)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

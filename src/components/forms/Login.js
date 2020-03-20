import React from "react";
import { MDBInput, MDBBtn } from "mdbreact";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "username": "",
      "password": "",
    };
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    evt.target.className += " was-validated";
  }

  handleChange = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  render() {
    const { username, password } = this.state;

    return (
      <form className="needs-validation"
          onSubmit={this.handleSubmit} noValidate>
        <h2 className="text-center">WELCOME BACK</h2>
        <div className="grey-text">
          <MDBInput label="Username" icon="user" name="username"
              value={username} required onChange={this.handleChange}>
            <div className="invalid-feedback text-center">
              Please state who you are
            </div>
          </MDBInput>

          <MDBInput label="Password" icon="lock" type="password" name="password"
              value={password} required onChange={this.handleChange}>
            <div className="invalid-feedback text-center">
              Please verify who you say you are
            </div>
          </MDBInput>
        </div>

        <div className="text-center">
          <MDBBtn type="submit">Login</MDBBtn>
        </div>
      </form>
    );
  }
}

export default Login;

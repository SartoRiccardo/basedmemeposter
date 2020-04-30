import React from "react";
import { MDBRow, MDBCol, MDBInput, MDBBtn } from "mdbreact";

class AccountForm extends React.Component {
  constructor(props) {
    super(props);

    const { defaultValue } = this.props;
    this.initialState = {
      username: "",
      password: "",
      startTime: 0,
      endTime: 0,
    };
    this.state = {
      username: (defaultValue && defaultValue.username) || "",
      password: (defaultValue && defaultValue.password) || "",
      startTime: (defaultValue && defaultValue.startTime) || 0,
      endTime: (defaultValue && defaultValue.endTime) || 0,
    };
  }

  updateInputValue = evt => {
    const { name, value } = evt.target;

    let trueValue;
    switch(name) {
      case "username":
        trueValue = value.toLowerCase();
        break;

      case "startTime": case "endTime":
        trueValue = parseInt(value);
        break;

      default:
        trueValue = value;
    }

    this.setState(
      { [ name ]: trueValue },
      () => {
        const { onChange } = this.props;
        if(onChange) {
          onChange({
            name,
            value: trueValue,
            account: { ...this.state },
          });
        }
      }
    );
  }

  submit = evt => {
    const { onSubmit } = this.props;
    evt.preventDefault();

    if(onSubmit) {
      const accepted = onSubmit({
        account: { ...this.state },
      });
      if(accepted) {
        this.setState({ ...this.initialState })
      }
    }
  }

  render() {
    const { value, disabled } = this.props;
    const { username, password, startTime, endTime } = value || this.state;

    const activeHours = endTime >= startTime ?
        endTime - startTime : (24 - startTime) + endTime;
    return (
      <form className="text-center" onSubmit={this.submit}>
        <MDBRow>
          <MDBCol md="6" className="order-md-1">
            <div className="no-input-margine">
              <MDBInput name="username" onChange={this.updateInputValue}
                  label="Nome" value={username}
                  className="my-2 my-md-0" disabled={disabled} />
            </div>
          </MDBCol>

          <MDBCol md="6" className="order-md-3">
            <div className="no-input-margine">
              <MDBInput type="password" name="password" value={password}
                  onChange={this.updateInputValue} label="Password"
                  className="mb-4 my-md-0" disabled={disabled} />
            </div>
          </MDBCol>

          <MDBCol md="6" className="order-md-2">
            <p className="mb-0 mt-4">
              Start posting at: <b>{startTime < 10 && "0"}{startTime}:00:00</b>
            </p>
            <input type="range" className="custom-range" min="0" max="23" step="1"
                onChange={this.updateInputValue} value={startTime}
                name="startTime" disabled={disabled}/>
          </MDBCol>

          <MDBCol md="6" className="order-md-4">
            <p className="mb-0 mt-4">
              Stop posting at: <b>{endTime < 10 && "0"}{endTime}:00:00</b>
            </p>
            <input type="range" className="custom-range" min="0" max="23" step="1"
                onChange={this.updateInputValue} value={endTime}
                name="endTime" disabled={disabled}/>
            <p>For a total of <b>{activeHours} hours</b></p>
          </MDBCol>

          <MDBCol size="12" className="order-md-last">
            <MDBBtn type="submit" color="purple" disabled={disabled}>Add</MDBBtn>
          </MDBCol>
        </MDBRow>
      </form>
    );
  }
}

export default AccountForm;

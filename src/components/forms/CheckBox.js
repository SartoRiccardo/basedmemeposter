import React from "react";
import { randomString } from "../../util/random";

class CheckBox extends React.Component {
  constructor(props) {
    super(props);

    const { defaultValue } = this.props;
    this.state = {
      checked: defaultValue === true,
      id: randomString(10),
    };
  }

  onChange = () => {
    const { checked } = this.state;
    this.setState({
      checked: !checked,
    });
  }

  render() {
    const { id } = this.state;
    const { label, checked, onChange, readOnly } = this.props;

    return (
      <div className="custom-control custom-checkbox">
        <input
          id={id}
          type="checkbox"
          className="custom-control-input"
          onChange={onChange && onChange}
          checked={checked || this.state.checked}
          readOnly={readOnly}
        />
        <label htmlFor={id} className="custom-control-label">{label}</label>
      </div>
    );
  }
}

export default CheckBox;

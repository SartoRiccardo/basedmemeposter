import React from "react";
import { MDBRow, MDBCol, MDBInput, MDBBtn } from "mdbreact";
import { platformData } from "../ui/Source";
import { connect } from "react-redux";
import { addSource } from "../../storage/actions/source";

class AddSource extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      platform: Object.keys(platformData)[0],
      name: "",
    }
    this.state = { ...this.initialState };
  }

  submit = evt => {
    evt.preventDefault();
    const { addSource } = this.props;

    addSource({ ...this.state });
    this.setState({ ...this.initialState })
  }

  changeName = evt => {
    if(evt.target.value.includes(" ")) return;
    this.setState({ name: evt.target.value.toUpperCase() });
  }

  render() {
    const { status } = this.props;

    const isDisabled = status.actions.some(
      action => action.type === "ADD_SOURCE"
    );

    const buttons = Object.entries(platformData).map(([ platform ]) => {
      const label = <p className="lead mt-2">{platformData[platform].icon}</p>;
      return platform !== "default" && (
        <MDBInput className="no-glow" gap type="radio" containerClass="px-4"
            label={label} checked={this.state.platform === platform}
            onClick={() => this.setState({ platform })}
            key={platform} disabled={isDisabled} />
      );
    })

    return (
      <form onSubmit={this.submit}>
        <div className="d-flex justify-content-center">
          {buttons}
        </div>

        <MDBRow>
          <MDBCol>
            <MDBInput containerClass="my-1" value={this.state.name}
                onChange={this.changeName} disabled={isDisabled} />
          </MDBCol>

          <MDBCol size="auto">
            <MDBBtn type="submit" color="purple" disabled={isDisabled}>Add</MDBBtn>
          </MDBCol>
        </MDBRow>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.status.source,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addSource: source => dispatch(addSource(source)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSource);

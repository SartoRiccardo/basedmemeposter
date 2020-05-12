import React from "react";
import { MDBRow, MDBCol, MDBInput, MDBBtn } from "mdbreact";
import { platformData } from "../ui/Source";
import { connect } from "react-redux";
import { addSource } from "../../storage/actions/source";

class AddSource extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      platform: Object.keys(platformData)[0],
      name: "",
    };
  }

  submit = evt => {
    evt.preventDefault();
    const { addSource } = this.props;

    addSource({ ...this.state });
    this.setState({ name: "" })
  }

  changeName = evt => {
    if(evt.target.value.includes(" ")) return;
    this.setState({ name: evt.target.value });
  }

  render() {
    const { status } = this.props;

    const isDisabled = status.actions.some(
      action => action.type === "ADD_SOURCE"
    );

    const buttons = Object.entries(platformData).map(([ platform ]) => {
      const label = <p className="lead mt-2">{platformData[platform].icon}</p>;
      return platform !== "default" && (
        <div className="d-inline-block mx-3">
          <input className="no-glow mr-2" type="radio" checked={this.state.platform === platform}
              key={platform} disabled={isDisabled} onChange={() => this.setState({ platform })}/>
          <div className="d-inline-block">{label}</div>
        </div>
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

import React from "react";
import { MDBRow, MDBCol, MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import { deleteCaption } from "../../storage/actions/caption";

class Caption extends React.Component {
  constructor(props) {
    super(props);
  }

  isDisabled = () => {
    const { status } = this.props;
    return status.actions.some(
      action => action.type === "DELETE_CAPTION"
    );
  }

  change = () => {
    if(this.isDisabled()) return;
  }

  copy = () => {
    const { caption } = this.props;
    if(this.isDisabled()) return;

    const textArea = document.getElementById(`caption-${caption.id}-textarea`);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
  }

  delete = () => {
    const { caption, deleteCaption } = this.props;
    if(this.isDisabled()) return;

    deleteCaption(caption.id);
  }

  render() {
    const { caption, className } = this.props;
    const disabled = this.isDisabled();

    return (
      <MDBRow className="my-2 py-2 mx-1 grey lighten-3">
        <MDBCol className="break-word pr-0 text-justify" size="10">
          <textarea id={`caption-${caption.id}-textarea`} className="hidden"
              value={caption.text} readOnly />
          <p id={`caption-${caption.id}`} className={`${className || ""}
              ${disabled && "text-muted text-disabled"}`}>
            {caption.text}
          </p>
        </MDBCol>

        <MDBCol className="text-right">
          <MDBIcon className={`icon-button ${disabled && "disabled"}`} icon="pen"
              onClick={this.change} fixed /><br />
          <MDBIcon className={`icon-button ${disabled && "disabled"}`} icon="copy"
              onClick={this.copy} fixed /><br />
          <MDBIcon className={`icon-button ${disabled && "disabled"}`} icon="trash"
              onClick={this.delete} fixed />
        </MDBCol>
      </MDBRow>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.status.caption,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteCaption: id => dispatch(deleteCaption(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Caption);

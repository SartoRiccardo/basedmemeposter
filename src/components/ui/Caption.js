import React from "react";
import { MDBRow, MDBCol, MDBIcon, MDBCard, MDBCardBody } from "mdbreact";
import { connect } from "react-redux";
import { deleteCaption, changeCaption } from "../../storage/actions/caption";

class Caption extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newText: null,
    }
  }

  isDisabled = () => {
    const { status, caption } = this.props;
    return status.actions.some(
      action => ["DELETE_CAPTION", "CHANGE_CAPTION"].includes(action.type) &&
          action.caption === caption.id
    );
  }

  startChanging = () => {
    const { caption } = this.props;
    if(this.isDisabled()) return;
    this.setState({ newText: caption.text });
  }

  changeCaptionText = evt => {
    if(this.isDisabled()) return;
    this.setState({ newText: evt.target.value });
  }

  submit = () => {
    const { caption, changeCaption } = this.props;
    if(this.isDisabled()) return;

    if(caption.text !== this.state.newText) {
      changeCaption({ ...caption, text: this.state.newText });
    }
    this.setState({ newText: null });
  }

  cancel = () => {
    if(this.isDisabled()) return;
    this.setState({ newText: null });
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

    const cardBody = (
      <MDBRow className="caption-container">
        <MDBCol className="break-word pr-0 text-justify" size="10">
          {
            this.state.newText === null
            ?
            <p id={`caption-${caption.id}`} className={`${className || ""}
                ${disabled && "text-muted text-disabled"}`}>
              {caption.text}
            </p>
            :
            <textarea type="textarea" value={this.state.newText} onChange={this.changeCaptionText}
                className="w-100 form-control no-glow" autoFocus readOnly={disabled} />
          }
        </MDBCol>

        <MDBCol className="text-right">
          {
            this.state.newText === null
            ?
            <React.Fragment>
              <MDBIcon className={`icon-button ${disabled && "disabled"}`} icon="pen"
                  onClick={this.startChanging} fixed /><br />
              <MDBIcon className={`icon-button ${disabled && "disabled"}`} icon="copy"
                  onClick={this.copy} fixed /><br />
              <MDBIcon className={`icon-button ${disabled && "disabled"}`} icon="trash"
                  onClick={this.delete} fixed />
            </React.Fragment>
            :
            <React.Fragment>
              <MDBIcon className={`icon-button ${disabled && "disabled"}`} icon="check"
                  onClick={this.submit} fixed /><br />
              <MDBIcon className={`icon-button ${disabled && "disabled"}`} icon="times"
                  onClick={this.cancel} fixed />
            </React.Fragment>
          }
        </MDBCol>
      </MDBRow>
    );

    return (
      <MDBCard className="w-100 my-2 p-0 mx-1">
        <MDBCardBody className="py-3">
            {cardBody}
        </MDBCardBody>

        <textarea id={`caption-${caption.id}-textarea`} className="hidden"
            value={caption.text} readOnly />
      </MDBCard>
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
    changeCaption: (id, text) => dispatch(changeCaption(id, text)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Caption);

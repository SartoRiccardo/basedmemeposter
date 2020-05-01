import React from "react";
import { MDBRow, MDBCol, MDBIcon } from "mdbreact";

class Caption extends React.Component {
  change = () => {

  }

  copy = () => {
    const { caption } = this.props;
    const textArea = document.getElementById(`caption-${caption.id}-textarea`);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
  }

  delete = () => {

  }

  render() {
    const { caption, className } = this.props;
    return (
      <MDBRow className="my-2 py-2 mx-1 grey lighten-3">
        <MDBCol className="break-word pr-0 text-justify" size="10">
          <textarea id={`caption-${caption.id}-textarea`} className="hidden"
              value={caption.text} readOnly />
          <p id={`caption-${caption.id}`} className={className || ""}>{caption.text}</p>
        </MDBCol>

        <MDBCol className="text-right">
          <MDBIcon className="icon-button" icon="pen" onClick={this.change} fixed /><br />
          <MDBIcon className="icon-button" icon="copy" onClick={this.copy} fixed /><br />
          <MDBIcon className="icon-button" icon="trash" onClick={this.delete} fixed />
        </MDBCol>
      </MDBRow>
    );
  }
}

export default Caption;

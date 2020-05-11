import React from "react";
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import { deleteSource, updateSource } from "../../storage/actions/source";

export const platformData = {
  twitter: {
    icon: <MDBIcon icon="twitter" className="light-blue-text" fixed />,
    hrefTemplate: "https://www.twitter.com/:name",
  },
  reddit: {
    icon: <MDBIcon icon="reddit" className="deep-orange-text" fixed />,
    hrefTemplate: "https://www.reddit.com/r/:name",
  },
  instagram: {
    icon: <MDBIcon icon="instagram" className="pink-text" fixed />,
    hrefTemplate: "https://www.instagram.com/:name",
  },
  default: {
    icon: <MDBIcon icon="instagram" fixed />,
    hrefTemplate: "#",
  }
};

class Source extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newName: null,
    };
  }

  isDisabled = () => {
    const { status, source } = this.props;
    return status.actions.some(
      action => ["DELETE_SOURCE", "UPDATE_SOURCE"].includes(action.type)
          && action.source === source.id
    );
  }

  delete = () => {
    const { deleteSource, source } = this.props;
    if(!this.isDisabled()) {
      deleteSource(source.id);
    }
  }

  startChanging = () => {
    const { source } = this.props;
    if(!this.isDisabled()) {
      this.setState({ newName: source.name });
    }
  }

  changeName = evt => {
    if(evt.target.value.includes(" ")) return;
    this.setState({ newName: evt.target.value });
  }

  submit = evt => {
    if(evt) {
      evt.preventDefault();
    }

    const { updateSource, source } = this.props;
    if(source.name !== this.state.newName) {
      updateSource({
        ...source,
        name: this.state.newName,
      });
    }
    this.setState({ newName: null });
  }

  cancel = () => {
    this.setState({ newName: null });
  }

  render() {
    const { source } = this.props;
    const { icon, hrefTemplate } = platformData[source.platform] || platformData.default;

    const brandIcon = (
      <a href={hrefTemplate.replace(":name", source.name)} target="_blank"
          rel="noopener noreferrer">
        {icon}
      </a>
    );

    return (
      <MDBCard>
        <MDBCardBody className="p-2 px-3">
          {
            this.state.newName === null
            ?
            <p className={`lead text-uppercase mb-0 ${this.isDisabled() && "text-muted"}`}>
              {brandIcon} {source.name}
              <span className="float-right">
                <MDBIcon icon="pen" onClick={this.startChanging} fixed
                    className={`icon-button ${this.isDisabled() && "disabled"}`}/>
                <MDBIcon icon="trash" onClick={this.delete} fixed
                     className={`icon-button ${this.isDisabled() && "disabled"}`}/>
              </span>
            </p>
            :
            <form onSubmit={this.submit}>
              <MDBRow>
                <MDBCol className="no-form-margin">
                  <MDBInput value={this.state.newName} onChange={this.changeName} autoFocus />
                </MDBCol>

                <MDBCol size="auto">
                  <p className="lead mb-0">
                    <MDBIcon icon="check" onClick={this.submit} fixed
                        className={`icon-button ${this.isDisabled() && "disabled"}`}/>
                    <MDBIcon icon="times" onClick={this.cancel} fixed
                         className={`icon-button ${this.isDisabled() && "disabled"}`}/>
                   </p>
                 </MDBCol>
              </MDBRow>
            </form>
          }
        </MDBCardBody>
      </MDBCard>
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
    deleteSource: id => dispatch(deleteSource(id)),
    updateSource: source => dispatch(updateSource(source)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Source);

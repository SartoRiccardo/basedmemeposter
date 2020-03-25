import React from "react";
import { MDBCol, MDBCard, MDBCardBody, MDBIcon, MDBModal, MDBModalHeader,
    MDBModalBody, MDBBtn } from "mdbreact";
import moment from "moment";
// HOCs and actions
import { connect } from "react-redux";
import { cancelScheduledPost } from "../../../storage/actions/schedule";
import InfiniteLoadingBar from "../InfiniteLoadingBar";

class ScheduledPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deleting: false,
    };
  }

  openDeleteModal = (evt) => {
    this.setState({ deleting: true });

    evt.stopPropagation();
    evt.preventDefault();
  }

  closeDeleteModal = () => {
    if(!this.isBeingDeleted()) {
      this.setState({ deleting: false });
    }
  }

  confirmDeletion = () => {
    const { cancelScheduledPost, schedule } = this.props;
    if(!this.isBeingDeleted()) {
      cancelScheduledPost(schedule.id);
    }
  }

  isBeingDeleted = () => {
    const { status } = this.props;
    for(const action of status.schedule.actions) {
      if(action.type === "DELETE_SCHEDULE") {
        return true;
      }
    }
    return false;
  }

  render() {
    const { schedule, status } = this.props;
    const { id, date, post } = schedule;
    const { deleting } = this.state;

    const dateText = moment(new Date(Date.parse(date))).fromNow();
    const takenSince = moment(new Date(Date.parse(post.dateAdded))).fromNow();

    const cardText = (
      <React.Fragment>
        <h5 className="h5-responsive">
          Posting {dateText}
          <MDBIcon icon="trash" className="mx-2 float-right icon-button trash"
              onClick={this.openDeleteModal} fixed />
        </h5>
        <p>
          Platform:
          <span className="text-capitalize ml-1">
            {post.platform.toLowerCase()}<br />
          </span>
          Post registered {takenSince}
        </p>
      </React.Fragment>
    );

    const backgroundImageStyle = {
      backgroundImage: `url(${post.thumbnail})`,
    };
    const cardBody = (
      <div className="d-block d-md-flex">
        <div
          className="w-100 pt-100 grey lighten-2 bg-image d-block d-md-none"
          style={backgroundImageStyle}
        />
        <div
          className="w-25 pt-25 grey lighten-2 bg-image d-none d-md-inline-block"
          style={backgroundImageStyle}
        />

        <div className="mt-3 mt-md-0 ml-0 ml-md-3 flex-md-grow-1">
          {cardText}
        </div>
      </div>
    );

    const deleteModal = (
      <MDBModal isOpen={deleting} toggle={this.closeDeleteModal} centered size="sm">
        <MDBModalHeader className="d-flex justify-content-center">
          Eliminare il post?
        </MDBModalHeader>
        <MDBModalBody>
          {
            this.isBeingDeleted() ?
            <InfiniteLoadingBar color="red" className="mb-2" /> :
            null
          }
          <MDBBtn className="float-left" outline color="blue-grey"
              onClick={this.closeDeleteModal}>
            Annulla
          </MDBBtn>
          <MDBBtn className="float-right" color="red"
              onClick={this.confirmDeletion}>
            Elimina
          </MDBBtn>
        </MDBModalBody>
      </MDBModal>
    );

    return (
      <MDBCol key={id} size="12" md="6" className="my-2">
        <a href={post.originalLink} target="_blank" rel="noopener noreferrer">
          <MDBCard className="hover-darken c-pointer black-text">
            <MDBCardBody>
              {cardBody}
            </MDBCardBody>
          </MDBCard>
        </a>

        {deleteModal}
      </MDBCol>
    );
  }
}

function mapStateToProps(state) {
  const { schedule } = state.status;
  return {
    status: { schedule },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cancelScheduledPost: (id) => dispatch(cancelScheduledPost(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledPost);

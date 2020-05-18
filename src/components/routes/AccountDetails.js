import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBIcon, MDBBtn,
    MDBModalHeader, MDBModal, MDBModalBody } from "mdbreact";
// HOCs and actions
import { connect } from "react-redux";
import { loadScheduleFor } from "../../storage/actions/schedule";
import { deleteAccount } from "../../storage/actions/account";
// Custom components
import Avatar from "../ui/account/Avatar";
import AvatarPlaceholder from "../ui/placeholders/AvatarPlaceholder";
import AccountTimeOnline from "../ui/account/AccountTimeOnline";
import ScheduledPost from "../ui/account/ScheduledPost";
import AccountSchedulePlaceholder from "../ui/placeholders/AccountSchedulePlaceholder";
import AccountTimePlaceholder from "../ui/placeholders/AccountTimePlaceholder";
import InfiniteLoadingBar from "../ui/InfiniteLoadingBar";

class AccountDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deleting: false,
    }
    this.titleTemplate = `:accountName - ${process.env.REACT_APP_TITLE}`;
    this.setDocumentTitle();
  }

  componentDidMount() {
    this.reloadScheduleIfNecessary();
  }

  componentDidUpdate() {
    const { match } = this.props;
    const { account } = this.props.schedule;

    this.reloadScheduleIfNecessary();
    this.setDocumentTitle();

    if(this.state.deleting && account !== parseInt(match.params.id)) {
      this.setState({ deleting: false });
    }
  }

  setDocumentTitle = () => {
    const { match } = this.props;
    const { accounts } = this.props.account;

    const accountExists = accounts.some(
      account => account.id === parseInt(match.params.id)
    );
    if(accountExists) {
      const matchingAccount = accounts.filter(
        account => account.id === parseInt(match.params.id)
      )[0];
      document.title = this.titleTemplate.replace(":accountName", matchingAccount.username);
    }
  }

  reloadScheduleIfNecessary = () => {
    const { match, status, loadScheduleFor, resetSchedule } = this.props;
    const { account } = this.props.schedule;

    let isLoading = false;
    for(const action of status.schedule.actions) {
      if(action.type === "SET_SCHEDULES") {
        isLoading = true;
        break;
      }
    }

    if(!isLoading && account !== parseInt(match.params.id)) {
      resetSchedule();
      loadScheduleFor(parseInt(match.params.id));
    }
  }

  openDeleteModal = () => {
    this.setState({ deleting: true });
  }

  closeDeleteModal = () => {
    this.setState({ deleting: false });
  }

  render() {
    const { history, match, status } = this.props;
    const { accounts } = this.props.account;
    const { schedule } = this.props.schedule;

    const accountExists = accounts.some(
      ({ id }) => id === parseInt(match.params.id)
    );

    if(status.account.initialized && !accountExists) {
      return (
        <div className="text-center my-4">
          <h1>Sorry!</h1>
          <p className="lead">There is no account here</p>
        </div>
      );
    }

    let matchingAccount = null;
    for(const a of accounts) {
      if(a.id === parseInt(match.params.id)) {
        matchingAccount = a;
        break;
      }
    }

    const accountSchedule = schedule.sort((a, b) => {
        a = Date.parse(a.date);
        b = Date.parse(b.date);
        if(a === b) return 0;
        if(a > b) return 1;
        return -1;
      })
      .map((s) => {
        return (
          <ScheduledPost key={s.id} schedule={s} />
        );
      });

    const breakpoint = "sm";
    let accountHeader, accountActivity, deleteModal;
    if(matchingAccount) {
      const { id, username, avatar, startTime, endTime } = matchingAccount;
      const logsLink = `/logs?accounts=${id}`;

      accountHeader = (
        <React.Fragment>
          <MDBRow className={`mt-3 d-flex d-${breakpoint}-none
              justify-content-center`}>
            <MDBCol size="6">
              {
                matchingAccount ?
                <Avatar image={avatar} /> :
                <AvatarPlaceholder />
              }
            </MDBCol>
          </MDBRow>

          <MDBRow className={`mt-${breakpoint}-3`}>
            <MDBCol sm="2" className={`d-none d-${breakpoint}-block`}>
              {
                matchingAccount ?
                <Avatar className="my-auto" image={avatar} /> :
                <AvatarPlaceholder />
              }
            </MDBCol>

            <MDBCol className={`text-uppercase my-auto text-center
                text-${breakpoint}-left`}>
              <h3 className="h3-responsive">
                {username}
                <a target="_blank" rel="noopener noreferrer"
                    href={`https://www.instagram.com/${username}`}>
                  <MDBIcon className="mx-2" icon="external-link-alt" />
                </a>
              </h3>

              <MDBBtn
                outline
                color="purple darken-2"
                size="sm"
                className="z-depth-1"
                onClick={() => history.push(logsLink)}
              >
                Check logs
              </MDBBtn>

              <MDBBtn
                outline
                color="purple darken-2"
                size="sm"
                className="z-depth-1"
                onClick={() => history.push(`${history.location.pathname}/edit`)}
              >
                Edit
              </MDBBtn>

              <MDBBtn
                outline
                color="red darken-2"
                size="sm"
                className="z-depth-1"
                onClick={this.openDeleteModal}
              >
                Delete
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </React.Fragment>
      );

      accountActivity = (
        <AccountTimeOnline startTime={startTime} endTime={endTime} />
      );

      deleteModal = (
        <MDBModal isOpen={this.state.deleting} toggle={this.closeDeleteModal} centered size="md">
          <MDBModalHeader className="d-flex justify-content-center">
            Do you want to delete the account <b>{username}</b>?
          </MDBModalHeader>
          <MDBModalBody>
            {
              status.account.actions.some(({ type }) => type === "DELETE_ACCOUNT")
              && <InfiniteLoadingBar color="red" className="mb-2" />
            }
            <MDBBtn className="float-left" outline color="blue-grey"
                onClick={this.closeDeleteModal}>
              Cancel
            </MDBBtn>
            <MDBBtn className="float-right" color="red"
                onClick={() => this.props.deleteAccount(id)}>
              Delete
            </MDBBtn>
          </MDBModalBody>
        </MDBModal>
      );
    }
    else {
      accountHeader = (
        <React.Fragment>
          <MDBRow className={`mt-3 d-flex d-${breakpoint}-none
              justify-content-center`}>
            <MDBCol size="6">
              <AvatarPlaceholder />
            </MDBCol>
          </MDBRow>

          <MDBRow className={`mt-${breakpoint}-3`}>
            <MDBCol sm="2" className={`d-none d-${breakpoint}-block`}>
              <AvatarPlaceholder />
            </MDBCol>
          </MDBRow>
        </React.Fragment>
      );
      accountActivity = (
        <AccountTimePlaceholder />
      );
    }

    return (
      <MDBContainer>

        {accountHeader}

        <MDBRow className="my-3">
          <MDBCol size="12">
            <h2 className="text-center mb-0">Activity</h2>
            <hr className="mt-0 w-50" />
          </MDBCol>

          {accountActivity}
        </MDBRow>

        <MDBRow className="mt-4">
          <MDBCol size="12">
            <h2 className="text-center mb-0">Schedule</h2>
            <hr className="mt-0 w-50" />
          </MDBCol>

          {
            status.schedule.initialized ?
            accountSchedule :
            <AccountSchedulePlaceholder display={6} />
          }
        </MDBRow>

        {deleteModal}
      </MDBContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.account,
    schedule: state.schedule,
    status: state.status,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadScheduleFor: (user) => dispatch(loadScheduleFor(user)),
    resetSchedule: () => dispatch({ type: "RESET_SCHEDULES" }),
    deleteAccount: id => dispatch(deleteAccount(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetails);

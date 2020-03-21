import React from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
// HOCs and actions
import { connect } from "react-redux";
// Custom components
import Avatar from "../ui/Avatar";
import AccountTimeOnline from "../ui/AccountTimeOnline";

class AccountDetails extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { params } = this.props.match;
    const { accounts } = this.props.account;

    let matchingAccount = null;
    for(const a of accounts) {
      if(a.id === parseInt(params.id)) {
        matchingAccount = a;
        break;
      }
    }

    const { id, username, avatar, startTime, endTime } = matchingAccount;
    const breakpoint = "sm"

    return (
      <MDBContainer>
        <MDBRow className={`mt-3 d-flex d-${breakpoint}-none justify-content-center`}>
          <MDBCol size="6">
            <Avatar image={avatar} />
          </MDBCol>
        </MDBRow>

        <MDBRow className={`mt-${breakpoint}-3`}>
          <MDBCol sm="2" className={`d-none d-${breakpoint}-flex`}>
            <Avatar className="my-auto" image={avatar} />
          </MDBCol>

          <MDBCol className="text-uppercase my-auto">
            <h3 className={`h3-responsive
                  text-center text-${breakpoint}-left`}>
              {username}
            </h3>
          </MDBCol>
        </MDBRow>

        <MDBRow className="my-3">
          <MDBCol size="12">
            <h2 className="text-center mb-0">Activity</h2>
            <hr className="mt-0 w-50" />
          </MDBCol>

          <AccountTimeOnline
            startTime={startTime}
            endTime={endTime}
          />
        </MDBRow>
      </MDBContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: { ...state.account },
  };
}

export default connect(mapStateToProps)(AccountDetails);

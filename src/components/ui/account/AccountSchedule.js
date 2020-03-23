import React from "react";
import { MDBCol, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import moment from "moment";

function AccountSchedule(props) {
  const { schedule } = props;

  const scheduleUi = schedule.map((s) => {
    const { id, date, post } = s;

    const dateText = moment(new Date(Date.parse(date))).fromNow();
    const takenSince = moment(new Date(Date.parse(post.dateAdded))).fromNow();

    const cardText = (
      <React.Fragment>
        <h5 className="h5-responsive">
          Posting {dateText}
          <MDBIcon icon="trash" className="mx-2 float-right icon-button trash" fixed />
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
          className="w-100 pt-100 bg-image d-block d-md-none"
          style={backgroundImageStyle}
        ></div>
        <div
          className="w-25 pt-25 bg-image d-none d-md-inline-block"
          style={backgroundImageStyle}
        ></div>

        <div className="mt-3 mt-md-0 ml-0 ml-md-3 flex-md-grow-1">
          {cardText}
        </div>
      </div>
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
      </MDBCol>
    );
  });

  return (
    <React.Fragment>
      {scheduleUi}
    </React.Fragment>
  );
}

export default AccountSchedule;

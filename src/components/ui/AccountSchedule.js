import React from "react";
import { MDBCol, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import moment from "moment";

function AccountSchedule(props) {
  const { schedule } = props;

  const scheduleUi = schedule.map((s) => {
    const { id, date, post } = s;

    const convertedDate = new Date(Date.parse(date));
    const dateText = moment(convertedDate).fromNow();

    const backgroundImageStyle = {
      backgroundImage: `url(${post.thumbnail})`,
    };
    const cardBody = (
      <React.Fragment>
        <div className="d-block d-md-none">
          <div className="w-100 pt-100 bg-image" style={backgroundImageStyle}></div>
          <div className="mt-3 text-center">
            <h5 className="h5-responsive">Posting {dateText}</h5>
            <p className="text-capitalize">
              Platform: {post.platform.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="d-none d-md-flex">
          <div className="w-25 pt-25 bg-image" style={backgroundImageStyle}></div>
          <div className="ml-3">
            <h5 className="h5-responsive mb-0">
              Posting {dateText}
              <MDBIcon icon="trash" className="mx-3" fixed />
            </h5>
            <p className="text-capitalize">
              Platform: {post.platform.toLowerCase()}
            </p>
          </div>
        </div>
      </React.Fragment>
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

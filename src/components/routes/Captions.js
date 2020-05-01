import React from "react";
import querystring from "querystring";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import Caption from "../ui/Caption";
import { connect } from "react-redux";
import { fetchCaptions } from "../../storage/actions/caption.js";

class Captions extends React.Component {
  constructor(props) {
    super(props);

    const { page, location, fetchCaptions, status } = this.props;
    const currentPage = querystring.parse(location.search.substring(1)).page || 0;
    if(page !== currentPage || !status.initialized) {
      fetchCaptions(currentPage);
    }

    this.reloadTimeout = null;
    this.reloadTime = 5;
    this.state = {
      timesReloaded: 0,
    }
  }

  componentDidUpdate(prevProps) {
    const { page, captions, location, fetchCaptions, status } = this.props;

    const hasUpdatedSignificantly = page !== prevProps.page ||
        captions.length !== prevProps.captions.length ||
        status.actions.length !== prevProps.status.actions.length;

    const currentPage = querystring.parse(location.search.substring(1)).page || 0;
    const isLoading = status.actions.some(action => action.type === "SET_CAPTIONS");
    if(hasUpdatedSignificantly && !isLoading &&
        (page !== currentPage || !status.initialized)) {
      this.reloadTimeout = setTimeout(
        () => {
          fetchCaptions(currentPage);
          this.setState(state => ({ timesReloaded: state.timesReloaded+1 }));
        },
        this.reloadTime * this.state.timesReloaded * 1000
      );
    }

    if(!isLoading && page === currentPage && status.initialized && this.state.timesReloaded > 0) {
      this.setState({ timesReloaded: 0 });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.reloadTimeout);
  }

  render() {
    const { status, captions } = this.props;

    if(!status.initialized) {
      return "TODO Placeholder";
    }

    const captionBlocks = captions.map(caption =>
      <MDBCol className="px-1 h-100" xs="12" md="6" lg="4" key={caption.id}>
        <Caption caption={caption} />
      </MDBCol>
    );

    return (
      <MDBContainer>
        <MDBRow>
          <MDBCol>
            <h1 className="mb-1 mt-3 text-center">Captions</h1>
            <hr className="mt-0" />
          </MDBCol>
        </MDBRow>

        <MDBRow>
          {captionBlocks}
        </MDBRow>
      </MDBContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.caption,
    status: state.status.caption,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCaptions: page => dispatch(fetchCaptions(page)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Captions);

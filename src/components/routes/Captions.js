import React from "react";
import querystring from "querystring";
import { MDBContainer, MDBRow, MDBCol} from "mdbreact";
import CaptionPlaceholder from "../ui/placeholders/CaptionPlaceholder";
import Caption from "../ui/Caption";
import Pagination from "../forms/Pagination";
import { connect } from "react-redux";
import { fetchCaptions } from "../../storage/actions/caption.js";

class Captions extends React.Component {
  constructor(props) {
    super(props);

    const { page, location, fetchCaptions, status } = this.props;
    const currentPage = querystring.parse(location.search.substring(1)).page || 1;
    if(page !== currentPage || !status.initialized) {
      fetchCaptions(currentPage);
    }

    this.titleTemplate = `Captions (Page :pageNumber) - ${process.env.REACT_APP_TITLE}`;
    document.title = this.titleTemplate.replace(":pageNumber", currentPage);
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
        status.actions.length !== prevProps.status.actions.length ||
        location.search !== prevProps.location.search;

    const currentPage = querystring.parse(location.search.substring(1)).page || 1;
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

    if(location.search !== prevProps.location.search) {
      document.title = this.titleTemplate.replace(":pageNumber", currentPage);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.reloadTimeout);
  }

  changePage = evt => {
    const { newPage } = evt;
    const { history } = this.props;
    history.push(`/captions?page=${encodeURIComponent(newPage)}`)
  }

  render() {
    const { status, captions, count, location } = this.props;
    const isLoading = status.actions.some(action => action.type === "SET_CAPTIONS");
    const currentPage = querystring.parse(location.search.substring(1)).page || 1;

    const captionsPerPage = 60;
    let captionBlocks;
    if(!status.initialized || isLoading) {
      captionBlocks = [];
      for(let i = 0; i < captionsPerPage; i++) {
        captionBlocks.push(
          <MDBCol className="px-1 h-100" xs="12" md="6" lg="4" key={i}>
            <CaptionPlaceholder />
          </MDBCol>
        );
      }
    }
    else {
      captionBlocks = captions.map(caption =>
        <MDBCol className="px-1 h-100" xs="12" md="6" lg="4" key={caption.id}>
          <Caption caption={caption} />
        </MDBCol>
      );
    }

    const paginationNeeded = status.initialized && count/captionsPerPage > 1;
    const pagination = (
      <MDBRow>
        <MDBCol className="d-flex justify-content-center">
          <Pagination totalCount={count} itemsPerPage={captionsPerPage}
              currentPage={parseInt(currentPage)} onChange={this.changePage} />
        </MDBCol>
      </MDBRow>
    );

    return (
      <MDBContainer>
        <MDBRow>
          <MDBCol>
            <h1 className="mb-1 mt-3 text-center">Captions</h1>
            <hr className="mt-0" />
          </MDBCol>
        </MDBRow>

        {paginationNeeded && pagination}

        <MDBRow>
          {captionBlocks}
        </MDBRow>

        {paginationNeeded && pagination}
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

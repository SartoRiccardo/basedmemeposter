import React from "react";
import { MDBPagination, MDBPageItem, MDBPageNav } from "mdbreact";
// HOCs and actions
import { connect } from "react-redux";
import { fetchLogs } from "../../storage/actions/log";

class LogPagination extends React.Component {
  changeHandler = (evt) => {
    const { page, onChange } = this.props;

    let newPage = 1;
    if(evt.target.name === "next") {
      newPage = page+1;
    }
    else if(evt.target.name === "previous") {
      newPage = page-1;
    }
    else {
      newPage = parseInt(evt.target.name);
    }

    if(onChange) onChange(newPage);
  }

  render() {
    const { page, log, className } = this.props;
    const logsPerPage = 8;

    const renderRangeMd = 3;
    const renderRangeXs = 1;

    const pages = [];
    for(let i = 0; i*logsPerPage < log.filtered; i++) {
      const pageNum = i+1;

      let visibleClass = "";
      if(pageNum >= page-renderRangeMd && pageNum <= page+renderRangeMd) {
        visibleClass = "d-md-block";
        if(pageNum < page-renderRangeXs || pageNum > page+renderRangeXs) {
          visibleClass += " d-none"
        }
      }

      if(visibleClass.length > 0) {
        pages.push(
          <MDBPageItem key={i} className={visibleClass} active={page === pageNum}>
            <MDBPageNav name={pageNum}>{pageNum}</MDBPageNav>
          </MDBPageItem>
        );
      }
    }

    return (
      <MDBPagination className={className} onClick={this.changeHandler}>
        <MDBPageItem>
          <MDBPageNav name="previous">&laquo;</MDBPageNav>
        </MDBPageItem>

        {pages}

        <MDBPageItem>
          <MDBPageNav name="next">&raquo;</MDBPageNav>
        </MDBPageItem>
      </MDBPagination>
    );
  }
}

function mapStateToProps(state) {
  return {
    log: { ...state.log },
    status: { ...state.status },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchLogs: (params) => dispatch(fetchLogs(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogPagination);

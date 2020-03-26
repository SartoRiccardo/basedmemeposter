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
    const logsPerPage = 100;
    const totalPages = Math.floor(log.filtered/logsPerPage);

    const renderRangeMd = 5;
    const renderRangeXs = 2;
    const render = {
      forward: {
        md: renderRangeMd +
            (page-1-renderRangeMd < 0 ?
                Math.abs(page-1-renderRangeMd) : 0),
        xs: renderRangeXs +
            (page-1-renderRangeXs < 0 ?
                Math.abs(page-1-renderRangeXs) : 0),
      },
      backward: {
        md: renderRangeMd +
            (page-1+renderRangeMd > totalPages ?
                Math.abs(page-1+renderRangeMd-totalPages) : 0),
        xs: renderRangeXs +
            (page-1+renderRangeXs > totalPages ?
                Math.abs(page-1+renderRangeXs-totalPages) : 0),
      }
    }

    const pages = [];
    for(let i = 0; i*logsPerPage < log.filtered; i++) {
      const pageNum = i+1;

      let visibleClass = "";
      if(pageNum >= page-render.backward.md &&
          pageNum <= page+render.forward.md) {
        visibleClass = "d-md-block";
        if(pageNum < page-render.backward.xs ||
            pageNum > page+render.forward.xs) {
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

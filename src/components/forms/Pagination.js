import React from "react";
import { MDBPagination, MDBPageItem, MDBPageNav } from "mdbreact";

class Pagination extends React.Component {
  changePage = evt => {
    const { totalCount, itemsPerPage, currentPage, onChange } = this.props;
    const totalPages = Math.floor(totalCount / itemsPerPage);
    let newPage = currentPage;

    switch(evt.target.name) {
      case "previous":
        if(currentPage > 1) newPage = currentPage - 1;
        break;

      case "next":
        if(currentPage <= totalPages) newPage = currentPage + 1;
        break;

      default:
        newPage = parseInt(evt.target.name);
    }

    if(newPage !== currentPage && onChange) {
      onChange({ newPage });
    }
  }

  render() {
    const { totalCount, currentPage, itemsPerPage, className, disabled,
        md, xs } = this.props;
    const totalPages = Math.floor(totalCount / itemsPerPage);

    const renderRangeMd = md || 5;
    const renderRangeXs = xs || 2;
    const render = {
      forward: {
        md: renderRangeMd +
            (currentPage-1-renderRangeMd < 0 ?
                Math.abs(currentPage-1-renderRangeMd) : 0),
        xs: renderRangeXs +
            (currentPage-1-renderRangeXs < 0 ?
                Math.abs(currentPage-1-renderRangeXs) : 0),
      },
      backward: {
        md: renderRangeMd +
            (currentPage-1+renderRangeMd > totalPages ?
                Math.abs(currentPage-1+renderRangeMd-totalPages) : 0),
        xs: renderRangeXs +
            (currentPage-1+renderRangeXs > totalPages ?
                Math.abs(currentPage-1+renderRangeXs-totalPages) : 0),
      }
    }

    const pages = [];
    for(let i = 0; i*itemsPerPage < totalCount; i++) {
      const pageNum = i+1;

      let visibleClass = "";
      if(pageNum >= currentPage-render.backward.md && pageNum <= currentPage+render.forward.md) {
        visibleClass = "d-md-block";
        if(pageNum < currentPage-render.backward.xs || pageNum > currentPage+render.forward.xs) {
          visibleClass += " d-none"
        }
      }

      if(visibleClass.length > 0) {
        pages.push(
          <MDBPageItem key={i} className={visibleClass} disabled={disabled}
              active={currentPage === pageNum} onClick={this.changePage}>
            <MDBPageNav name={pageNum}>{pageNum}</MDBPageNav>
          </MDBPageItem>
        );
      }
    }

    return (
      <MDBPagination className={className}>
        <MDBPageItem disabled={disabled} onClick={this.changePage}>
          <MDBPageNav name="previous">&laquo;</MDBPageNav>
        </MDBPageItem>

        {pages}

        <MDBPageItem disabled={disabled} onClick={this.changePage}>
          <MDBPageNav name="next">&raquo;</MDBPageNav>
        </MDBPageItem>
      </MDBPagination>
    );
  }
}

export default Pagination;

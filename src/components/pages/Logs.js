import React from "react";
import querystring from "querystring";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
// Custom components
import LogFilter from "../forms/LogFilter";
import SingleLog from "../ui/log/SingleLog";
import SingleLogPlaceholder from "../ui/placeholders/SingleLogPlaceholder";
// HOCs and actions
import { connect } from "react-redux";

class Logs extends React.Component {
  parseQueryParams(url) {
    let params = querystring.parse(url.substring(1));

    for(const [ key, value ] of Object.entries(params)) {
      params[key] = value.split(",");
    }

    if(params.accounts) {
      params.accounts = params.accounts.map((id) => parseInt(id));
    }

    return params;
  }

  encodeState(params) {
    let urlParams = [];
    for(const [ key, values ] of Object.entries(params)) {
      if(values.length === 0) {
        continue;
      }
      const urlValues = values.map((v) => encodeURIComponent(v));
      urlParams.push(`${key}=${urlValues.join()}`);
    }
    return `?${urlParams.join("&")}`;
  }

  updateUrl = (evt) => {
    const { history } = this.props;
    const { change } = evt;

    let params = this.parseQueryParams(history.location.search);
    if(!params[change.group]) {
      params[change.group] = [];
    }

    if(change.new) {
      params[change.group].push(change.value);
    }
    else {
      params[change.group] = params[change.group].filter((param) => param !== change.value);
    }

    const urlParams = this.encodeState(params);
    history.push(`${history.location.pathname}${urlParams}`);
  }

  render() {
    const { history, status } = this.props;
    const { logs } = this.props.log;
    const params = this.parseQueryParams(history.location.search);

    let logsUi;
    if(status.log.initialized) {
      logsUi = logs.map((l) => {
        return (
          <SingleLog log={l} key={l.id} />
        );
      });
    }
    else {
      logsUi = [];
      for(let i = 0; i < 10; i++) {
        logsUi.push(
          <SingleLogPlaceholder key={i} />
        );
      }
    }

    return (
      <MDBContainer>
        <MDBRow className="mt-3">
          <MDBCol>
            <h2 className="text-center">Filters</h2>
            <hr className="mt-0 w-50" />
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol>
            <LogFilter value={params} onChange={this.updateUrl} />
          </MDBCol>
        </MDBRow>

        <MDBRow className="mt-3">
          <MDBCol>
            <h2 className="text-center">Logs</h2>
            <hr className="mt-0 w-50" />
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol>

            {logsUi}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    log: { ...state.log },
    status: { ...state.status },
  };
}

export default connect(mapStateToProps)(Logs);

import React from "react";
import querystring from "querystring";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
// Custom components
import LogFilter from "../forms/LogFilter";
// HOCs and actions
import { connect } from "react-redux";

class Logs extends React.Component {
  parseQueryParams(url) {
    let params = querystring.parse(url.substring(1));

    for(const [ key, value ] of Object.entries(params)) {
      if(typeof params[key] !== "object") {
        params[key] = [params[key]];
      }
    }

    if(params.account) {
      params.account = params.account.map((id) => parseInt(id));
    }

    return params;
  }

  encodeState(params) {
    let urlParams = [];
    for(const [ key, values ] of Object.entries(params)) {
      for(const v of values) {
        urlParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
      }
    }
    return `?${urlParams.join("&")}`;
  }

  updateUrl = (evt) => {
    const { history } = this.props;
    const { change } = evt;

    const groupKeyMatch = {
      accounts: "account",
      levels: "level",
    };
    const keyMatch = groupKeyMatch[change.group];

    let params = this.parseQueryParams(history.location.search);
    if(!params[keyMatch]) {
      params[keyMatch] = [];
    }

    if(change.new) {
      params[keyMatch].push(change.value);
    }
    else {
      params[keyMatch] = params[keyMatch].filter((param) => param !== change.value);
    }

    const urlParams = this.encodeState(params);
    history.push(`${history.location.pathname}${urlParams}`);
  }

  render() {
    const { history } = this.props;
    const { logs } = this.props.log;
    const params = this.parseQueryParams(history.location.search);

    const filters = {
      accounts: params.account || [],
      levels: params.level || [],
    };

    return (
      <MDBContainer>
        <MDBRow className="mt-3">
          <MDBCol>
            <h2 className="text-center">Logs</h2>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol>
            <LogFilter value={filters} onChange={this.updateUrl} />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    log: { ...state.log },
  };
}

export default connect(mapStateToProps)(Logs);

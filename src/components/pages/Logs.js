import React from "react";
import querystring from "querystring";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
// Custom components
import LogFilter from "../forms/LogFilter";
// HOCs and actions
import { connect } from "react-redux";

class Logs extends React.Component {
  constructor(props) {
    super(props);

    const { search } = this.props.location;
    let params = this.parseQueryParams(search);

    this.state = {
      params: {
        account: params.account || [],
        level: params.level || [],
      },
    };
  }

  parseQueryParams(url) {
    let params = querystring.parse(url.substring(1));

    for(const [ key, value ] of Object.entries(params)) {
      if(typeof params[key] !== "array") {
        params[key] = [params[key]];
      }
    }

    return params;
  }

  encodeState = () => {
    const { params } = this.state;

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
    const { params } = this.state;
    const { change } = evt;

    const groupKeyMatch = {
      accounts: "account",
      levels: "level",
    };
    const keyMatch = groupKeyMatch[change.group];

    let newParams;
    if(change.new) {
      newParams = {
        ...params,
        [ keyMatch ]: [ ...params[keyMatch], change.value ]
      };
    }
    else {
      newParams = {
        ...params,
        [ keyMatch ]: params[keyMatch].filter((param) => param !== change.value),
      };
    }

    this.setState({
      params: newParams,
    }, this.updateUrlCallback);
  }

  updateUrlCallback = () => {
    const { history } = this.props;
    const params = this.encodeState();

    history.push(`${history.location.pathname}${params}`);
  }

  render() {
    const { logs } = this.props.log;

    return (
      <MDBContainer>
        <MDBRow className="mt-3">
          <MDBCol>
            <h2 className="text-center">Logs</h2>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol>
            <LogFilter onChange={this.updateUrl} />
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

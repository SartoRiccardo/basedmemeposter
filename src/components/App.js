import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { getToken } from "../storage/session";
// HOCs and actions
import { connect } from "react-redux";
import { fetchLogs, initIgnoredLogs } from "../storage/actions/log";
import { fetchAccounts } from "../storage/actions/account";
import { tokenAuth } from "../storage/actions/auth";
// Custom components
import Navbar from "./ui/Navbar";
import Logs from "./pages/Logs";
import AccountDetails from "./pages/AccountDetails";
import Dashboard from "./pages/Dashboard";
import Anonymous from "./pages/Anonymous";
import BrandLogo from "./pages/BrandLogo";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reloadingAuth: false,
      reloadingNecessary: false,
    };
  }

  componentDidMount() {
    const { initAuth } = this.props;

    initAuth();
  }

  componentDidUpdate(previous) {
    const { auth, status, initLogs, initAccounts, initIgnoredLogs,
        initAuth } = this.props;

    if(previous.auth.token && !auth.token) {
      // Log out
    }
    else if(!previous.auth.token && auth.token) {
      initLogs();
      initAccounts();
      initIgnoredLogs();
    }

    const { errors } = status.auth;
    if(previous.status.auth.errors.length < errors.length && getToken()) {
      const newError = errors[errors.length-1];
      if(newError === "Network Error") {
        this.setState({ reloadingAuth: true });
        setTimeout(() => {
          initAuth();
          this.setState((state)=> ({ reloadingAuth: false }));
        }, 5000);
      }
    }
  }

  generateBody = () => {
    const { auth, status } = this.props;
    const { reloadingAuth } =this.state;
    const routeData = [
      {path: "/logs", exact: true, component: Logs},
      {path: "/accounts/:id", exact: true, component: AccountDetails},
      {path: "/", component: Dashboard},
    ];

    const isFetchingToken = status.auth.actions.some(
      (a) => a.type === "SET_AUTH_INIT"
    );
    if(isFetchingToken || reloadingAuth) {
      return (
        <BrandLogo />
      );
    }

    if(!auth.token) {
      return (
        <Anonymous />
      );
    }

    const routes = routeData.map((rd, i) => {
      return (
        <Route key={i} path={rd.path} component={rd.component} exact={rd.exact} />
      );
    });

    return (
      <React.Fragment>
        <Navbar />
        <Switch>
          {routes}
        </Switch>
      </React.Fragment>
    );
  }

  render() {
    return (
      <BrowserRouter>
        {this.generateBody()}
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.status,
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initLogs: () => dispatch(fetchLogs()),
    initAccounts: () => dispatch(fetchAccounts()),
    initIgnoredLogs: () => dispatch(initIgnoredLogs()),
    initAuth: () => dispatch(tokenAuth()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

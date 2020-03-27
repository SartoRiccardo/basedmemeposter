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
    const { auth, status, initAuth } = this.props;
    const { reloadingNecessary } = this.state;

    if(!previous.auth.token && auth.token) {
      this.loadNecessary();
    }

    const { errors } = status.auth;
    if(previous.status.auth.errors.length < errors.length && getToken()) {
      const newError = errors[errors.length-1];
      if(newError === "Network Error") {
        this.setState({ reloadingAuth: true });
        setTimeout(() => {
          initAuth();
          this.setState((state) => ({ reloadingAuth: false }));
        }, 5 * 1000);
      }
    }

    if(auth.token && !this.areNecessaryLoaded() &&
        !this.areNecessaryBeingLoaded() && !reloadingNecessary) {
      this.setState((state) => ({ reloadingNecessary: true }));
      setTimeout(() => {
        if(!this.areNecessaryLoaded()) {
          this.loadNecessary();
        }
        this.setState((state) => ({ reloadingNecessary: false }));
      }, 5 * 1000);
    }
  }

  loadNecessary = () => {
    const { initLogs, initAccounts, initIgnoredLogs } = this.props;
    initLogs();
    initAccounts();
    initIgnoredLogs();
  }

  areNecessaryLoaded = () => {
    const { status, ignored } = this.props;

    const necessary = ["log", "account"];
    let areAllLoaded = necessary.every((n) => status[n].initialized);
    areAllLoaded = areAllLoaded && Object.entries(ignored).every(
      ([ level, count ]) => count !== null
    );

    return areAllLoaded;
  }

  areNecessaryBeingLoaded = () => {
    const { status } = this.props;

    const necessary = ["log", "account"];
    let areBeingLoaded = necessary.some(
      (n) => status[n].actions.some(
        (act) => act.type === `SET_${n.toUpperCase()}S`
      )
    );
    areBeingLoaded = areBeingLoaded ||
        status.log.actions.some((act) => act.type === "GET_IGNORED_LOGS");

    return areBeingLoaded;
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
    ignored: state.log.ignored,
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

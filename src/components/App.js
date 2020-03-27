import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
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

class App extends React.Component {
  componentDidMount() {
    const { initAuth } = this.props;

    initAuth();
  }

  componentDidUpdate(previous) {
    const { auth, initLogs, initAccounts, initIgnoredLogs } = this.props;
    if(previous.auth.token && !auth.token) {
      // Log out
    }
    else if(!previous.auth.token && auth.token) {
      initLogs();
      initAccounts();
      initIgnoredLogs();
    }
  }

  generateBody = () => {
    const { auth, status } = this.props;
    const routeData = [
      {path: "/logs", exact: true, component: Logs},
      {path: "/accounts/:id", exact: true, component: AccountDetails},
      {path: "/", component: Dashboard},
    ];

    const isFetchingToken = status.auth.actions.some(
      (a) => a.type === "SET_LOGIN"
    );
    if(isFetchingToken) {
      return null;
      // return (
      //   <BrandLogo />
      // );
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
    status: { ...state.status },
    auth: { ...state.auth },
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

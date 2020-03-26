import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
// HOCs and actions
import { connect } from "react-redux";
import { fetchLogs, initIgnoredLogs } from "../storage/actions/log";
import { fetchAccounts } from "../storage/actions/account";
// Custom components
import Navbar from "./ui/Navbar";
import Logs from "./pages/Logs";
import AccountDetails from "./pages/AccountDetails";
import Dashboard from "./pages/Dashboard";
import Anonymous from "./pages/Anonymous";

class App extends React.Component {
  componentDidMount() {
    const { fetchLogs, fetchAccounts, initIgnoredLogs } = this.props;

    initIgnoredLogs();
    fetchAccounts();
    fetchLogs();
  }

  generateBody = () => {
    const routeData = [
      {path: "/logs", exact: true, component: Logs},
      {path: "/accounts/:id", exact: true, component: AccountDetails},
      {path: "/", component: Dashboard},
    ];

    if(true) {
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchLogs: () => dispatch(fetchLogs()),
    fetchAccounts: () => dispatch(fetchAccounts()),
    initIgnoredLogs: () => dispatch(initIgnoredLogs()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

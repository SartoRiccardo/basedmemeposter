import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
// HOCs and actions
import { connect } from "react-redux";
import { fetchLogs } from "../storage/actions/log";
import { fetchAccounts } from "../storage/actions/account";
// Custom components
import Navbar from "./ui/Navbar";
import Logs from "./pages/Logs";
import AccountDetails from "./pages/AccountDetails";
import Dashboard from "./pages/Dashboard";
import Anonymous from "./pages/Anonymous";

class App extends React.Component {
  componentDidMount() {
    const { fetchLogs, fetchAccounts } = this.props;

    fetchAccounts();
    fetchLogs();
  }

  render() {
    const { status } = this.props;
    if(!(status.log.initialized)) return null;

    if(false) {
      return (
        <Anonymous />
      );
    }

    const routeData = [
      {path: "/logs", exact: true, component: Logs},
      {path: "/accounts/:id", exact: true, component: AccountDetails},
      {path: "/", component: Dashboard},
    ];

    const routes = routeData.map((rd, i) => {
      return (
        <Route key={i} path={rd.path} component={rd.component} exact={rd.exact} />
      );
    });

    return (
      <BrowserRouter>
        <Navbar />

          <Switch>
            {routes}
          </Switch>
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
// Custom components
import Navbar from "./ui/Navbar";
import AccountLogs from "./pages/AccountLogs";
import AccountDetails from "./pages/AccountDetails";
import Dashboard from "./pages/Dashboard";
import Anonymous from "./pages/Anonymous";

function App() {
  if(false) {
    return (
      <Anonymous />
    );
  }

  const routeData = [
    {path: "/accounts/:id/logs", exact: true, component: AccountLogs},
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

export default App;

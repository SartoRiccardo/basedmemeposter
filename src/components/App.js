import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
// Custom components
import Navbar from "./ui/Navbar";
import AccountSchedule from "./pages/AccountSchedule";
import AccountDetails from "./pages/AccountDetails";
import Accounts from "./pages/Accounts";
import Dashboard from "./pages/Dashboard";
import Anonymous from "./pages/Anonymous";

function App() {
  if(false) {
    return (
      <Anonymous />
    );
  }

  const routeData = [
    {path: "/accounts/:id/schedule", component: AccountSchedule},
    {path: "/accounts/:id", component: AccountDetails},
    {path: "/accounts", component: Accounts},
    {path: "/", component: Dashboard},
  ];

  const routes = routeData.map((rd, i) => {
    return (
      <Route key={i} path={rd.path} component={rd.component} />
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

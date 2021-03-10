import { Login } from "./login";
import { Createaccount } from "./create_account";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Resetpass } from "./resetpass";

function Authentification() {
  return (
    <>
      <Router>
        <Switch>
          <Route path={["/", "/login"]} exact>
            <Login />
          </Route>
          <Route path="/createaccount" exact>
            <Createaccount />
          </Route>
          <Route path="/resetpass" exact>
            <Resetpass />
          </Route>
          <Route path="*">
            <Redirect from="*" to="/login" />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export { Authentification };

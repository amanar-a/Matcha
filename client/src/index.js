import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import "./css/index.css";
import "./css/animation.css";
import { Information } from "./Component/info1.js";
import { Dashboard } from "./Component/Dashboard";
import { Authentification } from "./Component/userAuthentification";
import { React, useContext } from "react";
import AppContext, { DataContext } from "./Context/AppContext";

function App() {
  const ctx = useContext(DataContext);
  if (ctx.isLogin === "Not login") return <Authentification />;
  else if (ctx.isLogin === "Step") return <Information />;
  else if (ctx.isLogin === "Login") return <Dashboard ChangeIsLogin={ctx.changeIsLogin} />;
  else return "";
}
function AppContainer() {
  return (
    <AppContext>
      <Router>
        <Switch>
          <App />
        </Switch>
      </Router>
    </AppContext>
  );
}
// ========================================

ReactDOM.render(<AppContainer />, document.getElementById("root"));

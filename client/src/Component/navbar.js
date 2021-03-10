import "../css/index.css";
import { Link } from "react-router-dom";

function Sign(props) {
  return (
    <p className="sign_p" onClick={props.click}>
      {props.value}
    </p>
  );
}
function Navbar() {
  return (
    <>
      <div className="navbarr">
        <span className="logo">{"Matcha"}</span>
        <div className="sign">
          <Link to="/login">
            <Sign value="Sign in" />
          </Link>
          <Link to="/createaccount">
            <Sign value="Sign up" />
          </Link>
        </div>
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <p className="cloud-text cloud-title">{"Welcome to matcha"}</p>
      </div>
    </>
  );
}

export { Navbar };

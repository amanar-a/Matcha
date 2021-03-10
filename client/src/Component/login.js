import React, { useState, useContext, useEffect } from "react";
import { ReactComponent as Log } from "../Images/login.svg";
import "../css/register_login.css";
import messages from "./messagess.js";
import TextField from "@material-ui/core/TextField";
import { MsgAlert } from "./alert.js";
import { Sendmail, change } from "./sendmail";
import { checkIfAllow } from "./checkIfAllow";
import { firstTime } from "./firstTimeload";
import axios from "axios";
import { DataContext } from "../Context/AppContext";
import { Navbar } from "./navbar";

function Login() {
  const ctx = useContext(DataContext);
  const [msgAlert, changeMsg] = useState({
    state: false,
    type: "error",
    msg: "",
  });
  const [error, changeError] = useState({
    Username: false,
    password: false,
  });

  useEffect(() => {
    firstTime(changeMsg);
    // eslint-disable-next-line
  }, []);
  let remove_error = (str) => {
    changeError((oldValue) => ({ ...oldValue, [str]: false }));
  };

  let handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    changeMsg((oldValue) => ({ ...oldValue, state: false }));
  };

  let sendInfo = () => {
    var input_ = document.querySelectorAll("input");

    for (let i = 0; i < 2; i++) {
      if (input_[i].value === "") changeError((oldValue) => ({ ...oldValue, [input_[i].id]: true }));
    }
    if (input_[0].value !== "" && input_[1].value !== "") {
      axios.post("/Authentication/login", { Username: input_[0].value, Password: input_[1].value }).then((res) => {
        if (res.data === 0)
          changeMsg({
            state: true,
            type: "error",
            msg: "Username or Password Incorect",
          });
        else if (res.data === 2)
          changeMsg({
            state: true,
            type: "error",
            msg: "Please Verify your email!",
          });
        else {
          localStorage.setItem("token", res.data.token);
          ctx.ref.reconfigAxios();
          checkIfAllow().then((res) => {
            if (res === "Allow1") ctx.changeIsLogin("Step");
            else if (res === "Allow2") ctx.changeIsLogin("Login");
          });
        }
      });
    } else {
      changeMsg({
        state: true,
        type: "error",
        msg: "Please Fill all the zones!",
      });
    }
  };

  return (
    <div style={{ overflowY: "scroll", height: "100%" }}>
      <Navbar />
      <div>
        <div className="creatacc">
          <Log className="img_createacc" />
          <div className="div_creatacc">
            <p>{messages["login_msgup"]}</p>
            <div>
              <TextField error={error.Username} type="Username" id="Username" className="one_row" label="Username" onChange={() => remove_error("Username")} />
            </div>
            <br />
            <div>
              <TextField
                error={error.password}
                type="password"
                id="password"
                className="one_row"
                label="Password"
                variant="filled"
                onChange={() => remove_error("password")}
              />
            </div>
            <div>
              <p className="link" onClick={() => change()}>
                {messages["resetpass"]}
              </p>
            </div>
            <br />
            <button className="signup" onClick={() => sendInfo()}>
              Sign In
            </button>
          </div>
          <div className="opacity"></div>
          <Sendmail style={{ display: "none" }} />
        </div>
        <MsgAlert error={msgAlert.type} msg={msgAlert.msg} op={msgAlert.state} onClose={() => handleClose()} />
      </div>
    </div>
  );
}

export { Login };

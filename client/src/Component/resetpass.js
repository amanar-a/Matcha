import React, { useState, useEffect } from "react";
import "../css/register_login.css";
import TextField from "@material-ui/core/TextField";
import { ReactComponent as Forgotpass } from "../Images/forgotpass.svg";
import { MsgAlert } from "./alert.js";
import { useHistory } from "react-router-dom";
import axios from "axios";

const urlParams = new URLSearchParams(window.location.search);

let checkpass = (changeError) => {
  let input_ = document.querySelectorAll("input");
  let state = 0;

  if (!/^[ -~]{8,30}$/g.test(input_[0].value)) {
    state = 1;
    changeError((oldValues) => ({ ...oldValues, pass1: true }));
  } else if (input_[0].value !== input_[1].value) {
    state = 2;
    changeError((oldValues) => ({ ...oldValues, pass1: true }));
    changeError((oldValues) => ({ ...oldValues, pass2: true }));
  } else {
    state = 0;
    changeError((oldValues) => ({ ...oldValues, pass1: false }));
    changeError((oldValues) => ({ ...oldValues, pass2: false }));
  }
  return state;
};

let Remove = (str, changeError) => {
  changeError((oldValue) => ({ ...oldValue, [str]: false }));
};

let checkinfo = (changeError, changeMsg, history) => {
  let input_ = document.querySelectorAll("input");

  for (let i = 0; i < 2; i++) {
    if (input_[i].value === "") {
      changeError((oldValue) => ({ ...oldValue, [input_[i].id]: true }));
    }
  }
  if (input_[0].value === "" || input_[1].value === "") {
    changeMsg({
      state: true,
      type: "error",
      msg: "Please Fill all the zones",
    });
  } else {
    let i = checkpass(changeError);
    if (i === 1)
      changeMsg({
        state: true,
        type: "error",
        msg: "password must have atleast 1 number and 1 char and 8-30 char",
      });
    else if (i === 2)
      changeMsg({
        state: true,
        type: "error",
        msg: "the two Passwords doesn't match!",
      });
    else {
      axios.post("/Authentication/resetpass", { pass1: input_[0].value, pass2: input_[1].value, token: urlParams.get("token") }).then((res) => {
        if (res.data === "success") history.push("/?token=" + urlParams.get("token"));
      });
    }
  }
};

function Resetpass() {
  let history = useHistory();
  const [msgAlert, changeMsg] = useState({
    state: false,
    type: "error",
    msg: "",
  });
  const [error, changeError] = useState({
    pass1: false,
    pass2: false,
  });

  let handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    changeMsg((oldValue) => ({ ...oldValue, state: false }));
  };

  useEffect(() => {
    let unmount = false;

    axios.get(`/resetpass?token=${urlParams.get("token")}`).then((res) => {
      if (!unmount) {
        if (res.data === 0) history.push("/login");
        else history.push("/resetpass?token=" + urlParams.get("token"));
      }
    });
    return () => (unmount = true); // eslint-disable-next-line
  }, []);

  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <p className="cloud-text cloud-title">{"Change your Password"}</p>
      </div>
      <div style={{ marginTop: "100px" }}>
        <div className="creatacc">
          <Forgotpass className="img_createacc" />
          <div className="div_creatacc">
            <p>{"Enter Your new password"}</p>
            <div>
              <TextField
                error={error.pass1}
                type="password"
                id="pass1"
                className="one_row"
                label="New Password"
                variant="filled"
                onChange={() => Remove("pass1", changeError)}
              />
            </div>
            <br />
            <div>
              <TextField
                error={error.pass2}
                type="password"
                id="pass2"
                className="one_row"
                label="Repeat New Password"
                variant="filled"
                onChange={() => Remove("pass2", changeError)}
              />
            </div>
            <br />
            <button className="signup" onClick={() => checkinfo(changeError, changeMsg, history)}>
              Reset Password
            </button>
          </div>
        </div>
        <MsgAlert error={msgAlert.type} msg={msgAlert.msg} op={msgAlert.state} onClose={() => handleClose()} />
      </div>
    </>
  );
}

export { Resetpass };

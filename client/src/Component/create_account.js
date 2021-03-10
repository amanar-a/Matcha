import React, { useState } from "react";
import { ReactComponent as Signin } from "../Images/signin.svg";
import "../css/register_login.css";
import messages from "./messagess.js";
import TextField from "@material-ui/core/TextField";
import { Navbar } from "./navbar";
import { MsgAlert } from "./alert.js";
import { useHistory } from "react-router-dom";
import axios from "axios";

var check = require("./checkinfo_compte");

function Createaccount() {
  let history = useHistory();
  let nb;
  const [error, changeError] = useState({
    firstName: false,
    lastName: false,
    userName: false,
    email: false,
    pass1: false,
    pass2: false,
  });
  const [msg, changeMsg] = useState({
    string: "",
    type: "error",
    open: false,
  });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    changeMsg((oldValue) => ({ ...oldValue, open: false }));
  };
  let checkinfo = () => {
    var input_ = document.querySelectorAll("input");

    for (let i = 0; i < 6; i++) {
      if (input_[i].value === "") {
        changeError((oldValue) => ({ ...oldValue, [input_[i].id]: true }));
      }
    }
    if (
      input_[0].value !== "" &&
      input_[1].value !== "" &&
      input_[2].value !== "" &&
      input_[3].value !== "" &&
      input_[4].value !== "" &&
      input_[5].value !== ""
    ) {
      nb = check.Valide(changeError);
      if (nb.length === 0) {
        axios
          .post("/Authentication/createaccount", {
            firstName: input_[0].value,
            lastName: input_[1].value,
            userName: input_[2].value,
            email: input_[3].value,
            pass1: input_[4].value,
            pass2: input_[5].value,
          })
          .then((res) => {
            if (res.data !== "email" && res.data !== "username" && res.data !== "KO") {
              history.push("/?act=" + res.data);
            } else if (res.data === "KO")
              changeMsg({
                string: "Something is wrong plz try again",
                type: "error",
                open: true,
              });
            else
              changeMsg({
                string: res.data + ": Already exist!",
                type: "error",
                open: true,
              });
          });
      } else changeMsg({ string: nb, type: "error", open: true });
    } else
      changeMsg({
        string: "Please Fill all the zones!",
        type: "error",
        open: true,
      });
  };

  let Remove = (str) => {
    changeError((oldValue) => ({ ...oldValue, [str]: false }));
  };

  return (
    <div style={{ overflowY: "scroll", height: "100%" }}>
      <Navbar />
      <>
        <div className="creatacc">
          <Signin className="img_createacc" />
          <div className="div_creatacc">
            <p>{messages["creatacc_msgup1"]}</p>
            <div className="div_2input">
              <TextField error={error.firstName} type="text" id="firstName" className="two_row1" label="First Name" onChange={() => Remove("firstName")} />
              <TextField error={error.lastName} type="text" id="lastName" className="two_row1" label="Last Name" onChange={() => Remove("lastName")} />
            </div>
            <br />
            <div>
              <TextField error={error.userName} type="text" id="userName" className="one_row" label="Username" onChange={() => Remove("userName")} />
            </div>
            <br />
            <div>
              <TextField error={error.email} type="email" id="email" className="one_row" label="Email" onChange={() => Remove("email")} />
            </div>
            <br />
            <div className="div_2input">
              <TextField
                error={error.pass1}
                type="password"
                id="pass1"
                className="two_row1"
                variant="filled"
                label="Password"
                onChange={() => Remove("pass1")}
              />
              <TextField
                error={error.pass2}
                type="password"
                id="pass2"
                className="two_row1"
                variant="filled"
                label="Repeat Password"
                onChange={() => Remove("pass2")}
              />
            </div>
            <br />
            <br />
            <button className="signup" onClick={() => checkinfo()}>
              Sign up
            </button>
          </div>
        </div>
        <div className="div_error"></div>
        <MsgAlert error={msg.type} msg={msg.string} op={msg.open} onClose={() => handleClose()} />
      </>
    </div>
  );
}

export { Createaccount };

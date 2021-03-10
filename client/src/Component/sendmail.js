import React, { useState } from "react";
import "../css/register_login.css";
import messages from "./messagess.js";
import TextField from "@material-ui/core/TextField";
import { MsgAlert } from "./alert.js";
import axios from "axios";

let change = () => {
  var sendmail = document.querySelector("#sendmail");
  var opacity = document.querySelector(".opacity");

  if (sendmail.style.display === "block") {
    sendmail.style.display = "none";
    opacity.style.display = "none";
  } else {
    sendmail.childNodes[1].childNodes[0].classList.remove("shakeanim");
    sendmail.style.display = "block";
    opacity.style.display = "block";
  }
};

function Sendmail(props) {
  const [msgAlert, changeMsg] = useState({
    state: false,
    type: "error",
    msg: "",
  });
  const [error, changeError] = useState(false);
  let remove_error = () => {
    changeError(false);
  };

  let handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    changeMsg((oldValue) => ({ ...oldValue, state: false }));
  };

  let checkinfo_ = () => {
    var input_ = document.querySelectorAll("input");

    if (input_[2].value === "") {
      changeError(true);
      changeMsg({
        state: true,
        type: "error",
        msg: "Please fill all the zones",
      });
    } else {
      axios.post("Authentication/sendResetPass", { Email: input_[2].value }).then((res) => {
        if (res.data === "OK") {
          let div = document.querySelector(".sendmail");
          var opacity = document.querySelector(".opacity");
          opacity.style.display = "none";
          div.style.display = "none";
          changeMsg({
            state: true,
            type: "success",
            msg: "Email has been send",
          });
        } else
          changeMsg({
            state: true,
            type: "error",
            msg: res.data,
          });
      });
    }
  };

  return (
    <span>
      <div id="sendmail" className="sendmail" style={props.style}>
        <p>{messages["login_resetpass"]}</p>
        <div className="center">
          <TextField error={error} type="email" id="sendemail" className="one_row" label="Email" onChange={() => remove_error()} />
        </div>
        <br />
        <div className="center">
          <button className="signup" onClick={() => change()}>
            Cancel
          </button>
          <button className="signup" onClick={() => checkinfo_()}>
            Submit
          </button>
        </div>
      </div>
      <MsgAlert error={msgAlert.type} msg={msgAlert.msg} op={msgAlert.state} onClose={() => handleClose()} />
    </span>
  );
}

export { Sendmail, change };

import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { MsgAlert } from "./alert";
import axios from "axios";
import { Validate } from "./checkinfo_compte";

export default function FormDialog(props) {
  const [open, setOpen] = useState(false);
  const [msg, changeMsg] = useState({
    string: "",
    type: "error",
    open: false,
  });

  const changePassword = () => {
    let values = document.querySelectorAll("input[type=password]");

    if (values[0].value !== "" && values[1].value !== "" && values[2].value !== "") {
      if (Validate("Password", values[1].value)) {
        if (values[1].value === values[2].value) {
          axios.post("/Authentication/updatepassword", { oldPass: values[0].value, newPass1: values[1].value, newPass2: values[2].value }).then((res) => {
            if (res.data === "oldPass") {
              changeMsg({ type: "error", open: true, string: "The Old Password Is Incorrect" });
            } else if (res.data === "error") {
              changeMsg({ type: "error", open: true, string: "Something Is Worng Please try Again!" });
            } else {
              props.changeMsg({ type: "success", open: true, string: "Password has been updated" });
              setOpen(false);
            }
          });
        } else changeMsg({ type: "error", open: true, string: "The two new Password doesn't Match!" });
      } else changeMsg({ type: "error", open: true, string: "Password Invalid!" });
    } else changeMsg({ type: "error", open: true, string: "Please Fill All The Zones!" });
  };

  const Close = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    changeMsg((oldValue) => ({ ...oldValue, open: false }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Edit Password
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Password</DialogTitle>
        <DialogContent className="Password">
          <DialogContentText>Password must have atleast one uppercase one lowercase one number and between 8 and 30 charactere</DialogContentText>
          <TextField margin="normal" variant="outlined" id="Oldpassword" label="Old password" type="password" fullWidth />
          <TextField margin="normal" variant="outlined" id="Newpassword1" label="New password" type="password" fullWidth />
          <TextField margin="normal" variant="outlined" id="newpassword2" label="Repeat new password" type="password" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={changePassword} color="primary">
            Edit
          </Button>
          <MsgAlert error={msg.type} msg={msg.string} op={msg.open} onClose={() => Close()} />
        </DialogActions>
      </Dialog>
    </>
  );
}

export { FormDialog };

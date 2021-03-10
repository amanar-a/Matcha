import React, { useState, useContext, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Images } from "./upload_comp.js";
import { MsgAlert } from "./alert.js";
import "../css/information.css";
import { Select } from "./Select";
import { Description } from "./description";
import { check } from "./checkinformation";
import { Gender } from "./genders";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { DataContext } from "../Context/AppContext";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import listInterest from "../interests.json";

function Info1() {
  const ctx = useContext(DataContext);
  const [waiting, changeWaiting] = useState("none");
  const [interest, changeInterest] = useState([]);
  const [defau, changeDefault] = useState(-1);
  const [unmout, changeUnmount] = useState(false);
  const [msgAlert, changeMsg] = useState({
    state: false,
    type: "error",
    msg: "",
  });
  const [geo, changeGeo] = useState(null);

  let handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    changeMsg((oldValue) => ({ ...oldValue, state: false }));
  };

  function showPosition(position) {
    if (!unmout) changeGeo(position.coords);
  }

  function getCurrentPosition(state) {
    if (!unmout)
      if (state === "granted" || state === "prompt") navigator.geolocation.getCurrentPosition((position) => showPosition(position));
      else changeGeo(null);
  }

  useEffect(() => {
    navigator.permissions
      .query({
        name: "geolocation",
      })
      .then(function (result) {
        getCurrentPosition(result.state);
        result.onchange = function () {
          getCurrentPosition(result.state);
        };
      });
    return () => changeUnmount(true); // eslint-disable-next-line
  }, []);
  let next1 = () => {
    check(changeMsg, interest, defau, ctx, changeWaiting, geo);
  };
  return (
    <div style={{ height: "100%", overflowY: "scroll" }}>
      <div className="upperdiv">
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <p style={{ fontSize: "40px" }} className="cloud-text cloud-title">
            {"Finish creation account"}
          </p>
        </div>
      </div>
      <div className="info_div">
        <div className="lot_div">
          <p className="info_p">BirthDay: </p>
          <TextField id="date" type="date" variant="outlined" />
        </div>

        <Gender list={["Male", "Female", "other"]} para="Gender:" />
        <Gender list={["Male", "Female", "both"]} para="Looking For:" />
        <div className="lot_div">
          <p className="info_p">Description:</p>
          <Description />
        </div>
        <div className="lot_div">
          <p className="info_p">Interest:</p>
          <Select
            list={listInterest.data}
            active={interest}
            max="5"
            change={(newString) => {
              changeInterest([...newString]);
            }}
          />
        </div>
        <div className="lot_div">
          <p className="info_p">Upload Images:(you can upload 5 images) </p>
          <div className="info_image">
            <Images defau={defau} change={changeDefault} msg={changeMsg} />
          </div>
        </div>
        <div className="info_next">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              axios.get("/Authentication/Logout").then((res) => {
                if (res.data === "You're now logout") {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userInfo");
                  ctx.changeIsLogin("Not login");
                }
              });
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={() => next1()}>
            Finish
          </Button>
        </div>
      </div>
      <MsgAlert error={msgAlert.type} msg={msgAlert.msg} op={msgAlert.state} onClose={() => handleClose()} />
      <div className="waitingScreen" style={{ display: waiting }}>
        <div className="waitingEcon">
          <CircularProgress size="8rem" />
        </div>
      </div>
    </div>
  );
}

function Information() {
  return (
    <Router>
      <Switch>
        <Route path="/finishAccount" exact>
          <Info1 />
        </Route>
        <Route path="*">
          <Redirect from="*" to="/finishAccount" />
        </Route>
      </Switch>
    </Router>
  );
}
export { Information };

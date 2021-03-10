import Rating from "@material-ui/lab/Rating";
import Button from "@material-ui/core/Button";
import { useContext } from "react";
import axios from "axios";
import { DataContext } from "../Context/AppContext";
import { useHistory } from "react-router-dom";
import RoomIcon from "@material-ui/icons/Room";

function ActionButtons(props) {
  let history = useHistory();
  const ctx = useContext(DataContext);
  function addFriend(UserName) {
    axios
      .post("/Friends/Invite", { UserName })
      .then((data) => {
        if (data.data !== "You Need At lest One Image to do This Action")
          props.info.match === 0
            ? props.ChangeInformation((oldvalue) => ({ ...oldvalue, match: 1 }))
            : props.ChangeInformation((oldvalue) => ({ ...oldvalue, match: 0 }));
        if (data.data !== "You Need At lest One Image to do This Action") {
          ctx.ref.removeFriend(UserName);
        } else props.changeMsg({ string: data.data, type: "warning", open: true });
      })
      .catch((err) => 0);
  }
  function clickRating(value, usernameReceiver) {
    axios
      .post("Rating", {
        usernameReceiver,
        RatingValue: parseFloat(value).toFixed(1),
      })
      .then((data) => {
        if (data.data === "You Need At lest One Image to do This Action") props.changeMsg({ string: data.data, type: "warning", open: true });
        if (data.data instanceof Object && parseFloat(data.data.AVG) >= 0 && parseFloat(data.data.AVG) <= 5) {
          props.changeRatingValue(() => ({
            userValue: value,
            avg: parseFloat(data.data.AVG).toFixed(1),
          }));
        }
      });
  }
  function blockUser(userName) {
    axios.get(`Profile/BlockUser/${userName}`).then((res) => {
      if (res.data === "User Has Been Blocked") {
        ctx.ref.removeFriend(userName);
        history.push("/");
      }
    });
  }
  function reportUser(userName) {
    axios.get(`Profile/Report/${userName}`).then((res) => {
      if (res.data === "User has been reported") props.ChangeInformation((oldvalues) => ({ ...oldvalues, reported: 1 }));
    });
  }
  function sendToGoogleMap() {
    window.open(`https://www.google.com/maps/dir//${props.info.latitude},${props.info.longitude}/@${props.info.latitude},${props.info.longitude},8z`);
  }
  return (
    <>
      <Rating
        name={"Rating"}
        defaultValue={0}
        value={props.ratingValue.userValue}
        max={5}
        precision={0.5}
        onChange={(event, value) => clickRating(value, props.info.userName)}
      />
      <hr style={{ width: "250px" }} />
      <div style={{ display: "flex", marginBottom: "5px", alignItems: "center" }}>
        {props.info.Online === "1" ? (
          <>
            <div style={{ width: "10px", height: "10px", backgroundColor: "lime", borderRadius: "50%" }}></div>
            <p className="history_p" style={{ color: "lime", fontSize: "24px", marginLeft: "10px" }}>
              Online
            </p>
          </>
        ) : (
          <>
            <div style={{ width: "10px", height: "10px", backgroundColor: "black", borderRadius: "50%" }}></div>
            <p className="history_p" style={{ color: "black", fontSize: "24px", marginLeft: "10px" }}>
              Offline: <span style={{ fontSize: "15px" }}>{ctx.ref.ConvertDate(props.info.Online) + " Ago"}</span>
            </p>
          </>
        )}
      </div>
      <div style={{ display: "flex", marginBottom: "5px", alignItems: "center" }}>
        <RoomIcon fontSize="large" style={{ cursor: "pointer", color: "#308fb4" }} onClick={() => sendToGoogleMap()} />
        <p className="history_p">
          <span>{props.info.Distance.toFixed(2)}</span> KM
        </p>
      </div>
      <div className="actionButtons">
        <Button
          className="AddFriend"
          variant="contained"
          onClick={() => {
            addFriend(props.info.userName);
          }}
        >
          {props.info.match === 1 ? "Unlike" : "Like"}
        </Button>
        {props.info.reported === 0 ? (
          <Button variant="contained" color="primary" onClick={() => reportUser(props.info.userName)}>
            Report
          </Button>
        ) : (
          ""
        )}
        <Button variant="contained" color="secondary" onClick={() => blockUser(props.info.userName)}>
          Block
        </Button>
      </div>
    </>
  );
}

export { ActionButtons };

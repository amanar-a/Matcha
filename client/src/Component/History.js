import React, { useEffect, useState, useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FavoriteIcon from "@material-ui/icons/Favorite";
import GradeIcon from "@material-ui/icons/Grade";
import ReportIcon from "@material-ui/icons/Report";
import "../css/History.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { DataContext } from "../Context/AppContext";
import Button from "@material-ui/core/Button";
import { NoImages } from "./noImages";
import { IconUnlike } from "./Icons";

function Action(props) {
  return (
    <>
      {props.action.indexOf("Like") > -1 ? (
        <span style={{ marginLeft: "8px", color: "#ff0000bd" }}>
          <FavoriteIcon fontSize="small" />
          {" Liked "}
        </span>
      ) : props.action.indexOf("View") > -1 ? (
        <span style={{ marginLeft: "8px", color: "#00e800db" }}>
          <VisibilityIcon fontSize="small" />
          {" Visited "}
        </span>
      ) : props.action.indexOf("Rate") > -1 ? (
        <span style={{ marginLeft: "8px", color: "orange" }}>
          <GradeIcon fontSize="small" />
          {" Rated "}
        </span>
      ) : props.action.indexOf("Report") > -1 ? (
        <span style={{ marginLeft: "8px", color: "#1919f08f" }}>
          <ReportIcon fontSize="small" />
          {" Reported "}
        </span>
      ) : props.action.indexOf("Unlike") > -1 ? (
        <span style={{ marginLeft: "8px", color: "black" }}>
          <IconUnlike width="20" height="20" fontSize="small" />
          {" Unlike "}
        </span>
      ) : (
        ""
      )}
    </>
  );
}

function MyActions(props) {
  const history = useHistory();
  const ctx = useContext(DataContext);
  return (
    <>
      {props.data.map((value, index) => (
        <div className="history_blok" style={{ width: "100%", display: "flex", marginTop: "8px" }} key={index}>
          {value.Image ? (
            <img
              src={value.Image.split("/")[0] === "https:" ? value.Image : `http://${window.location.href.split("/")[2].split(":")[0]}:5000${value.Image}`}
              alt="..."
              className="history_img"
            />
          ) : (
            <NoImages width="66px" height="60px" fontSize="20px" username={value.actionOwner} />
          )}
          <div className="history_information">
            <p className="history_p">
              {"You "}
              <Action action={value.Content} />
              <span
                className="history_profile"
                onClick={() => {
                  history.push(`/Profile/${value.actionOwner}`);
                }}
              >
                {value.actionOwner}
              </span>
            </p>
            <p className="history_p" style={{ marginRight: "22px" }}>
              {ctx.ref.ConvertDate(value.date) + " Ago"}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
function BlockedUsers(props) {
  function unBlock(index, userName) {
    axios.get(`/Profile/unBlock/${userName}`).then((res) => {
      if (res.data === "User UnBlocked") {
        let newArray = [...props.data];
        newArray.splice(index, 1);
        props.changeData((oldValue) => ({ ...oldValue, blacklist: newArray }));
      }
    });
  }
  return (
    <>
      {props.data.map((value, index) => (
        <div className="history_blok" style={{ width: "100%", display: "flex", marginTop: "8px" }} key={index}>
          {value.Image ? (
            <img
              src={value.Image.split("/")[0] === "https:" ? value.Image : `http://${window.location.href.split("/")[2].split(":")[0]}:5000${value.Image}`}
              alt="..."
              className="history_img"
            />
          ) : (
            <NoImages width="50px" height="50px" fontSize="20px" username={value.blockedUser} />
          )}
          <div className="history_information">
            <p className="history_p">{value.blockedUser}</p>
            <Button variant="contained" color="primary" onClick={() => unBlock(index, value.blockedUser)}>
              Unblock
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}

function TabPanel(props) {
  const { children, value, index } = props;

  return <div>{value === index && <Box>{children}</Box>}</div>;
}

export default function History() {
  const [value, setValue] = React.useState(0);
  const [infoHistory, changeData] = useState({
    history: [],
    blacklist: [],
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    let unmount = false;
    axios.post("/history").then((res) => {
      if (!unmount) {
        changeData(res.data);
      }
    });
    return () => (unmount = true); // eslint-disable-next-line
  }, []);
  return (
    <div className="history">
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="History" />
          <Tab label="Bloked Users" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <div className="actions_div">
          <MyActions data={infoHistory.history} />
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="actions_div">
          <BlockedUsers data={infoHistory.blacklist} changeData={changeData} />
        </div>
      </TabPanel>
    </div>
  );
}

export { History };

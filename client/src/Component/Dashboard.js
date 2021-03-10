import React, { useState, useEffect } from "react"; // eslint-disable-next-line
import { Nav } from "./Nav";
import { QuickActions } from "./QuickActions";
import "../css/Dashboard.css";
import { DashboardBody } from "./DashboardBody"; // eslint-disable-next-line
import { useWindowSize } from "./UseWindowSize";
import axios from "axios";

function Layout(props) {
  const [active, changeActive] = useState("Menu");
  function switchActive(value) {
    changeActive((oldValue) => (oldValue === value ? oldValue : oldValue === "Menu" ? "QuickActions" : "Menu"));
  }
  return (
    <div
      className="Layout"
      style={{
        ...props.style,
        transform: active === "Menu" ? "translateX(0px)" : "translateX(-285px)",
      }}
    >
      <div
        className="LayoutSwitch"
        style={{
          transform: active === "Menu" ? "translateX(0px)" : "translateX(295px)",
        }}
      >
        <div className="LayoutSwitchActive" style={active === "Menu" ? { left: "6px" } : { left: "134px" }}></div>
        <div className={active === "Menu" ? "LayoutSwitchItem LayoutSwitchItemActive" : "LayoutSwitchItem"} onClick={() => switchActive("Menu")}>
          Menu
        </div>
        <div
          className={active === "QuickActions" ? "LayoutSwitchItem LayoutSwitchItemActive" : "LayoutSwitchItem"}
          onClick={() => switchActive("QuickActions")}
        >
          QuickActions
        </div>
      </div>
      <div className="LayoutSelected">
        <Nav user={props.user} />
        <QuickActions />
      </div>
    </div>
  );
}
function Dashboard(props) {
  const [user, changeUser] = useState({
    UserName: "",
    FirstName: "",
    LastName: "",
    Image: "",
  });
  const width = useWindowSize();
  const [LayoutHide, changeLayoutHide] = useState(true);
  useEffect(() => {
    let unmount = false;
    let newArray = [];

    axios.post("/Profile/getInfoUser").then((res) => {
      if (!unmount) {
        changeUser(res.data);
        if (res.data.Image !== "[]") {
          if (res.data.Image.indexOf("http") > -1) newArray = [res.data.Image];
          else newArray = [`http://${window.location.href.split("/")[2].split(":")[0]}:5000${res.data.Image}`];
          changeUser((oldvalue) => ({ ...oldvalue, Image: newArray }));
        }
      }
    });
    return () => (unmount = true); // eslint-disable-next-line
  }, []);
  useEffect(() => {
    let unmount = false;
    if (width >= 1240 && !LayoutHide && !unmount) changeLayoutHide(true);
    return () => (unmount = true); // eslint-disable-next-line
  }, [width]);
  return (
    <div className="Dashboard">
      {width <= 1600 ? (
        <Layout
          style={{
            width: LayoutHide ? "285px" : "0px",
            minWidth: LayoutHide ? "285px" : "0px",
            overflow: LayoutHide ? "inherit" : "hidden",
          }}
          user={user}
        />
      ) : null}
      {width > 1600 ? <Nav user={user} /> : null}
      <DashboardBody
        style={{ zIndex: 7 }}
        changeLayoutHide={() => changeLayoutHide((oldValue) => !oldValue)}
        width={width}
        user={user}
        changeUser={changeUser}
        ChangeIsLogin={props.ChangeIsLogin}
      />
      {width > 1600 ? <QuickActions /> : null}
    </div>
  );
}
export { Dashboard, Layout };

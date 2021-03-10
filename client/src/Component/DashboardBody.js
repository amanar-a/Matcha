import React, { useState, useEffect } from "react";
import "../css/DashboardBody.css";
import { ChangeMenu } from "./Icons";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { Users } from "./Users";
import { Filter } from "./Filter";
import { Profile } from "./profile";
import History from "./History";
import FilterListIcon from "@material-ui/icons/FilterList";
import { NoImages } from "./noImages";

function IconComponent(props) {
  // eslint-disable-next-line
  useEffect(() => props.changeLayoutHide(), []);
  return (
    <div>
      <ChangeMenu fill="black" onClick={() => props.changeLayoutHide()} />
    </div>
  );
}
function DashboardBody(props) {
  let location = useLocation();
  const [hideFilter, changeHideFilter] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (location.pathname !== "/") changeHideFilter(true);
  }, [location]);
  function Error404() {
    useEffect(() => {
      history.push("/");
    }, []);
    return <div></div>;
  }
  return (
    <div className="DashboardBody" style={props.style ? props.style : {}}>
      <div className="DashboardBodyHeader">
        <div>
          {props.width <= 1240 ? <IconComponent changeLayoutHide={props.changeLayoutHide} /> : null}
          <div className="DashboardBodyHeaderProfile">
            {props.user.Image !== "[]" ? (
              <img src={props.user.Image} alt="profileImage" className="DashboardBodyHeaderProfileImage" />
            ) : (
              <NoImages width="35px" height="35px" fontSize="15px" username={props.user.UserName} />
            )}
            <span>{`${props.user.FirstName} ${props.user.LastName}`}</span>
          </div>
          <div className="DashboardBodyHeaderSettings">
            {/* <IconSettings width={19} height={19} fill='#a5a5a5' /> */}
            {location.pathname === "/" ? (
              <FilterListIcon
                onClick={() => changeHideFilter((oldValue) => !oldValue)}
                style={{ width: "24px", height: "28px", color: "black", marginRight: "9px", cursor: "pointer" }}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        {!hideFilter ? <Filter /> : null}
      </div>

      <div className="DashboardBodyContent">
        <Switch>
          <Route exact path="/">
            <Users user={props.user} />
          </Route>
          <Route path="/profile/:userName" exact>
            <Profile user={props.user} changeUser={props.changeUser} />
          </Route>
          <Route path="/history">
            <History />
          </Route>
          <Route path="*">
            <Error404 />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
export { DashboardBody };

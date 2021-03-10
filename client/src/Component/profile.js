import { useState, useEffect } from "react";
import "../css/profile.css";
import { GenderProfile } from "./genders";
import { Description } from "./description";
import { Select } from "./Select";
import { Slider } from "./silder_image";
import { TextFieldProfile } from "./textfieldProfile";
import Button from "@material-ui/core/Button";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import { send } from "./information_profile";
import { FormDialog } from "./updatepassword_profile";
import { MsgAlert } from "./alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ReactComponent as NotFound } from "../Images/profile.svg";
import { useLocation } from "react-router-dom";
import Chip from "@material-ui/core/Chip";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import { ActionButtons } from "./actionButtons";
import { NoImages } from "./noImages";
import { Citys } from "./City";
import cityname from "../city.json";
import listInterest from "../interests.json";

function Profile(props) {
  const location = useLocation();
  const [ratingValue, changeRatingValue] = useState({ avg: 0, userValue: 0 });
  const [style, changeStyle] = useState({
    text: true,
  });
  const [waiting, changeWaiting] = useState("none");
  const [msg, changeMsg] = useState({
    string: "",
    type: "error",
    open: false,
  });
  const [info, ChangeInformation] = useState({});

  useEffect(() => {
    let unmount = false;
    let profile = window.location.href.split("/")[4];
    axios.get(`/Profile/checkProfile/${profile}`).then((res) => {
      if (!unmount) {
        let newArray = [];
        ChangeInformation(res.data);
        if (res.data.state !== null) {
          changeRatingValue({ avg: res.data.RatingAvg, userValue: res.data.RatingValue });
          res.data.images.forEach((element) => {
            if (element.indexOf("https") === -1) newArray.push(`http://${window.location.href.split("/")[2].split(":")[0]}:5000${element}`);
            else newArray.push(element);
          });
          res.data.permis !== 1 ? changeStyle({ text: true }) : changeStyle({ text: false });
          ChangeInformation((oldvalue) => ({ ...oldvalue, images: newArray }));
        }
      }
    });
    return () => (unmount = true); // eslint-disable-next-line
  }, [location]);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    changeMsg((oldValue) => ({ ...oldValue, open: false }));
  };

  let remove = (id) => {
    let newArr = [...info.images];

    if (props.defau === id) ChangeInformation(-1);
    newArr.splice(id, 1);
    ChangeInformation((oldvalues) => ({ ...oldvalues, images: newArr }));
  };

  return (
    <>
      {Object.values(info).length > 0 ? (
        <div style={{ width: "100%", paddingTop: "40px" }}>
          <div className="profileUpperDiv">
            {info.state !== null ? (
              <>
                <div>
                  <span style={{ fontSize: "max(2vw,22px)", letterSpacing: "1.5px", color: "#898a8abf" }}>{"Personal Information"}</span>
                  {info.reported === 1 ? (
                    <ReportProblemIcon style={{ float: "right" }} fontSize="large" color="primary" titleAccess="You have reported this user" />
                  ) : (
                    ""
                  )}
                </div>
                <hr style={{ width: "98%" }} />
                <div>
                  <div className="profileImgDiv">
                    {info.images.length > 0 ? (
                      <div style={{ position: "relative" }}>
                        <img className="profileImage userImages" src={info.images[0]} alt="..." />
                        {info.permis === 1 ? <DeleteIcon fontSize="default" color="secondary" className="deletIcon" onClick={() => remove(0)} /> : ""}
                      </div>
                    ) : (
                      <NoImages width="140px" height="140px" fontSize="30px" username={info.userName} />
                    )}
                    <div style={{ display: "flex", marginRight: "33px" }}>
                      <div className="matchrating_Div" style={{ marginRight: "12%" }}>
                        <p className="matchrating_p">{info.friends}</p>
                        <p className="matchrating_p" style={{ fontSize: "25px", fontWeight: "lighter", color: "#ff0000ad" }}>
                          {"Match"}
                        </p>
                      </div>
                      <hr style={{ height: "40px" }} />
                      <div className="matchrating_Div" style={{ marginLeft: "10%" }}>
                        <p className="matchrating_p"> {ratingValue.avg}</p>
                        <p className="matchrating_p" style={{ fontSize: "25px", fontWeight: "lighter", color: "#ffc864e3" }}>
                          {"Rating"}
                        </p>
                      </div>
                    </div>
                    {info.permis !== 1 ? (
                      <ActionButtons
                        info={info}
                        ChangeInformation={ChangeInformation}
                        userName={window.location.href.split("/")[4]}
                        changeRatingValue={changeRatingValue}
                        ratingValue={ratingValue}
                        changeMsg={changeMsg}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="textFieldsDiv">
                    <div className="firstHalf">
                      <div className="nameDiv">
                        <TextFieldProfile
                          display={style.text}
                          type="text"
                          class="name"
                          label="First name"
                          value={info.firstName}
                          change={(value) => {
                            ChangeInformation({ ...info, firstName: value });
                          }}
                        />
                        <TextFieldProfile
                          display={style.text}
                          type="text"
                          class="name"
                          label="Last name"
                          value={info.lastName}
                          change={(value) => {
                            ChangeInformation({ ...info, lastName: value });
                          }}
                        />
                      </div>
                      <TextFieldProfile
                        display={style.text}
                        type="text"
                        label="userName"
                        class=""
                        value={info.userName}
                        change={(value) => {
                          ChangeInformation({ ...info, userName: value });
                        }}
                      />
                      <TextFieldProfile
                        display={style.text}
                        type="text"
                        class=""
                        label={info.permis === 1 ? "email" : "City"}
                        value={info.permis ? info.email : info.City}
                        change={(value) => {
                          ChangeInformation({ ...info, email: value });
                        }}
                      />
                      <TextFieldProfile
                        display={style.text}
                        type="date"
                        class=""
                        label="birthDay"
                        value={info.birthDay}
                        change={(value) => {
                          ChangeInformation({ ...info, birthDay: value });
                        }}
                      />
                      <div className="padd">
                        <p className="profile_p">{"Gender:"}</p>
                        <GenderProfile
                          display={style.text}
                          list={["Male", "Female", "other"]}
                          value={info.gender}
                          type="string"
                          change={(value) => {
                            ChangeInformation({ ...info, gender: value });
                          }}
                        />
                      </div>
                      <div className="padd">
                        <p className="profile_p">{"Lookin For:"}</p>
                        <GenderProfile
                          display={style.text}
                          list={["Male", "Female", "both"]}
                          value={info.lookinFor}
                          type="array"
                          change={(value) => {
                            ChangeInformation({ ...info, lookinFor: value });
                          }}
                        />
                      </div>
                      {info.permis === 1 ? (
                        <div className="padd">
                          <p className="profile_p">{"City:"}</p>
                          <Citys
                            city={cityname}
                            cityOwner={cityname.indexOf(info.City)}
                            change={(value) => {
                              ChangeInformation({ ...info, City: value });
                            }}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="secondetHalf">
                      <div className="padd">
                        <p className="profile_p">{"Description:"}</p>
                        <Description
                          display={style.text}
                          value={info.description}
                          change={(value) => {
                            ChangeInformation({ ...info, description: value });
                          }}
                        />
                      </div>
                      <div className="padd">
                        <p className="profile_p">{"Interest:"}</p>
                        {info.permis === 1 ? (
                          <Select
                            list={listInterest.data}
                            active={info.interest}
                            max="5"
                            change={(value) => {
                              ChangeInformation({ ...info, interest: value });
                            }}
                          />
                        ) : (
                          <div>
                            {info.interest.map((value, key) => (
                              <Chip variant="outlined" label={value} key={key} color="primary" className="chip" />
                            ))}
                          </div>
                        )}
                      </div>
                      <Slider info={info} change={ChangeInformation} remove={remove} />
                    </div>
                  </div>
                  {info.permis === 1 ? (
                    <div className="padd" style={{ display: "flex", justifyContent: "center", marginTop: "51px" }}>
                      <FormDialog changeMsg={changeMsg} />
                      <Button
                        variant="contained"
                        onClick={() => {
                          send(info, changeMsg, changeWaiting, ChangeInformation, props.changeUser);
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexFlow: "column", alignItems: "center", backgroundColor: "white", boxShadow: "none" }}>
                <NotFound style={{ width: "60%" }} />
                <p style={{ fontFamily: "none", fontSize: "2.5vw", fontWeight: "lighter", color: "grey", letterSpacing: "4.5px" }}>
                  {"Sorry... Username not found"}
                </p>
              </div>
            )}
            <MsgAlert error={msg.type} msg={msg.string} op={msg.open} onClose={() => handleClose()} />
          </div>
          <div className="waitingScreen" style={{ display: waiting }}>
            <div className="waitingEcon">
              <CircularProgress size="8rem" />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export { Profile };

import axios from "axios";
import { Validate } from "./checkinfo_compte";

function Valide(information, changeMsg) {
  let array = [];
  let state = 0;
  if (!Validate("Name", information.firstName)) {
    array.push("First Name must be alpha and more than 2 caractere");
  } else if (!Validate("Name", information.lastName)) {
    array.push("Last Name must be alpha and more than 2 caractere");
  }
  if (!Validate("Username", information.userName)) {
    array.push("user name invalid 2 caractere atleast");
  }
  if (!Validate("Email", information.email)) {
    array.push("Email invalid");
  }
  if (array.length > 0) changeMsg({ open: true, type: "error", string: array });
  else state = 1;
  return state;
}

function checkInformation(information, changeMsg) {
  if (information.permis === 1) {
    if (
      information.birthDay !== "" &&
      information.description.trim() !== "" &&
      information.email !== "" &&
      information.firstName !== "" &&
      information.gender.trim() !== "" &&
      information.lastName !== "" &&
      information.latitude !== "" &&
      information.longitude !== "" &&
      information.userName !== "" &&
      information.City.trim() !== "" &&
      information.interest.length > 0 &&
      information.lookinFor.length > 0
    ) {
      return Valide(information, changeMsg);
    } else {
      changeMsg({ open: true, type: "error", string: "Please Fill al the zones!" });
      return 0;
    }
  } else return 0;
}

function send(information, changeMsg, changeWaiting, ChangeInformation, changeUser) {
  if (checkInformation(information, changeMsg) === 1) {
    changeWaiting("block");
    axios.post("/Authentication/updateinformation", { information }).then((res) => {
      if (res.data === "images") changeMsg({ open: true, type: "error", string: "Images Invalid!" });
      else if (res.data === "dateError") changeMsg({ open: true, type: "error", string: "Age must be between 18 and 130" });
      else if (res.data === "onDate") changeMsg({ open: true, type: "error", string: "The Information Are on date" });
      else if (res.data === "username") changeMsg({ open: true, type: "error", string: "The Username already exist" });
      else if (res.data === "email") changeMsg({ open: true, type: "error", string: "The Email already exist" });
      else if (res.data === "error") changeMsg({ open: true, type: "error", string: "Something wrong try later" });
      else {
        let newArray = [];
        let newUserInfo = res.data;
        if (res.data.Image) {
          res.data.Image.forEach((element) => {
            if (element.indexOf("https") === -1) newArray.push(`http://${window.location.href.split("/")[2].split(":")[0]}:5000${element}`);
            else newArray.push(element);
          });
        }
        if (newArray[0]) newUserInfo["Image"] = "/" + newArray[0].split("/")[3] + "/" + newArray[0].split("/")[4];
        ChangeInformation((oldvalues) => ({ ...oldvalues, images: newArray }));
        changeMsg({ open: true, type: "success", string: "Profile has been updated" });
        if (newArray.length > 0) newUserInfo["Image"] = newArray[0];
        else newUserInfo["Image"] = "[]";
        changeUser(newUserInfo);
      }
      changeWaiting("none");
    });
  }
}

export { send };

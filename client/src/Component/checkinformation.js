import axios from "axios";

var information = {};

function fillInfo(interest, defau, geo) {
  return new Promise((resolve) => {
    var input_ = document.querySelectorAll("input");
    var textarea = document.querySelectorAll("textarea");
    var img = document.querySelectorAll(".img_file");

    information = {
      birthDay: "",
      gender: "",
      lookinFor: [],
      description: "",
      interest: [],
      images: [],
      latitude: null,
      longitude: null,
      ip: null,
    };
    information.birthDay = input_[0].value;
    information.description = textarea[0].value;
    if (input_[1].value === "0") information.gender = "Male";
    else if (input_[1].value === "1") information.gender = "Female";
    else if (input_[1].value === "2") information.gender = "Other";
    if (input_[2].value === "2") {
      information.lookinFor.push("Male");
      information.lookinFor.push("Female");
    } else if (input_[2].value === "0") information.lookinFor.push("Male");
    else if (input_[2].value === "1") information.lookinFor.push("Female");
    information.interest = interest;
    if (img.length > 0) {
      information.images.push(img[defau].src);
      for (var i = 0; i < img.length; i++) if (i !== defau) information.images.push(img[i].src);
    }

    if (geo !== null) {
      information.latitude = geo.latitude;
      information.longitude = geo.longitude;
      resolve(information);
    } else {
      axios.get("https://ipinfo.io/json?token=700ab019065edb").then((res) => {
        information.ip = res.data.ip;
        resolve(information);
      });
    }
  });
}

async function check(changeMsg, interest, defau, ctx, changeWaiting, geo) {
  var input_ = document.querySelectorAll("input");
  var textarea = document.querySelectorAll("textarea");
  if (interest.length <= 0 || input_[0].value === "" || textarea[0].value === "" || (input_[1].value === "" && input_[2].value === ""))
    changeMsg({ state: true, type: "error", msg: "Please fill all the zones" });
  var img = document.querySelectorAll(".img_file");
  if (interest.length <= 0 || input_[0].value === "" || textarea[0].value === "" || (input_[1].value === "" && input_[2].value === ""))
    changeMsg({ state: true, type: "error", msg: "Please fill all the zones" });
  else if (img.length > 0 && defau === -1) changeMsg({ state: true, type: "error", msg: "you must choose a default image" });
  else {
    changeWaiting("block");
    fillInfo(interest, defau, geo).then((info) => {
      ctx.ref.reconfigAxios();
      axios.post("/Authentication/information", { info }).then((res) => {
        if (res.data === "dateError") changeMsg({ state: true, type: "error", msg: "Age must be between 18 and 130" });
        else if (res.data === "images") changeMsg({ state: true, type: "error", msg: "Images invalide" });
        else if (res.data === "error" || res.data === "token invalid" || res.data === "User not authenticated" || res.data === "Access token expired")
          changeMsg({ state: true, type: "error", msg: "Something is wrong please retry later" });
        else {
          ctx.changeIsLogin("Login");
        }
        changeWaiting("none");
      });
    });
  }
}

export { check };

const mysql = require("./mysql");
var nodemailer = require("nodemailer");
var md5 = require("md5");
const fs = require("fs");
const information = require("./server_information");
const { Validate } = require("../tools/validate");
const axios = require("axios");
const cityList = require("../../client/src/city.json");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "camagruservice9@gmail.com",
    pass: "manarabdessamad123",
  },
});

function ifNotBlock(IdUserOwner, IdUserReceiver) {
  return new Promise(async (resolve) => {
    const result1 = await mysql.select("Blacklist", "*", {
      IdUserOwner: IdUserOwner,
      IdUserReceiver: IdUserReceiver,
    });
    const result2 = await mysql.select("Blacklist", "*", {
      IdUserOwner: IdUserReceiver,
      IdUserReceiver: IdUserOwner,
    });
    if (!result1[0] && !result2[0]) resolve(true);
    else resolve(false);
  });
}
async function checkAllow(array) {
  let sql = "SELECT * FROM Users WHERE IdUserOwner=? AND JWT=?";
  const result = await mysql.query(sql, [array.userInfo.IdUserOwner, array.userInfo.JWT]);
  if (result.length > 0) {
    if (result[0].IsActive === "2") return "Allow1";
    else return "Allow2";
  } else return "notAllow";
}

function checkValidCreate(array) {
  if (
    Validate("Name", array.firstName) &&
    Validate("Name", array.lastName) &&
    Validate("Username", array.userName) &&
    Validate("Email", array.email) &&
    Validate("Password", array.pass1) &&
    array.pass1 === array.pass2
  ) {
    return 0;
  } else return 1;
}

async function Create(array, host) {
  if (checkValidCreate(array) == 0) {
    let req = "SELECT * FROM `Users` WHERE `UserName` =? OR `Email`=?";

    const result = await mysql.query(req, [array.userName, array.email]);
    if (result.length >= 1) {
      if (result[0].UserName == array.userName) return "username";
      else if (result[0].Email == array.email) return "email";
    } else {
      let date = md5(Date.now());
      mysql.insert("Users", {
        UserName: array.userName.trim(),
        Email: array.email.trim(),
        FirstName: array.firstName.trim(),
        LastName: array.lastName.trim(),
        Password: md5(array.pass1),
        Token: date,
        IsActive: date,
      });
      var mailOptions = {
        from: "camagruservice9@gmail.com",
        to: array.email,
        subject: "validate account",
        html: `<a href=http://${host.split(":")[0]}:5000/login?act=${date}>Click here<a> to verify your account.`,
      };
      transporter.sendMail(mailOptions);
      return date;
    }
  } else return "KO";
}
async function Login(array) {
  const obj = { Username: array.Username, Password: md5(array.Password) };
  var state = "0";
  result = await mysql.select("Users", "*", obj);
  if (result.length > 0) {
    if (result[0].IsActive == "1") state = { token: { IdUserOwner: result[0].IdUserOwner, username: result[0].UserName } };
    else if (result[0].IsActive == "2")
      state = {
        token: { IdUserOwner: result[0].IdUserOwner, username: result[0].UserName },
      };
    else state = "2";
  }
  return state;
}
async function resetpass(array) {
  if (array.token) {
    let sql = "SELECT * from Users WHERE Token=?";
    let result = await mysql.query(sql, [array.token]);
    if (result.length > 0) {
      if (Validate("Password", array.pass1) && array.pass2 === array.pass1) {
        let sql = "UPDATE Users set Password=? WHERE Token=?";
        mysql.query(sql, [md5(array.pass1), array.token]);
        return "success";
      } else return "KO";
    } else return "KO";
  } else return "KO";
}
async function sendmail(array, host) {
  if (array.Email && Validate("Email", array.Email)) {
    let sql = "SELECT * FROM Users WHERE email=?";
    let result = await mysql.query(sql, [array.Email]);
    if (result.length > 0) {
      if (result[0].IsActive === "1" || result[0].IsActive === "2") {
        let token = md5(Date.now());
        let sql = "UPDATE Users SET Token=? WHERE email=?";
        mysql.query(sql, [token, array.Email]);
        var mailOptions = {
          from: "camagruservice9@gmail.com",
          to: array.Email,
          subject: "Reset password",
          html: `<a href=http://${host.split(":")[0]}:3000/resetpass?token=${token}>Click here<a> to Reset your password.`,
        };
        transporter.sendMail(mailOptions);
        return "OK";
      } else return "Email not verified";
    } else return "Email invalide";
  } else return "Email invalide";
}
async function checkWhatChanged(array, user) {
  if (
    array.userName &&
    array.firstName &&
    array.lastName &&
    array.email &&
    array.description &&
    array.gender &&
    array.birthDay &&
    array.interest &&
    array.lookinFor &&
    array.City &&
    array.images
  ) {
    let state = false;
    let sql = "Select * from Users WHERE IdUserOwner = ?";
    const result = await mysql.query(sql, [user]);
    let images = [];
    array.images.forEach((element) => {
      if (element.indexOf("https") === -1) images.push("/" + element.split("/")[3] + "/" + element.split("/")[4]);
      else images.push(element);
    });
    if (
      array.userName !== result[0].UserName ||
      array.firstName !== result[0].FirstName ||
      array.lastName !== result[0].LastName ||
      array.email !== result[0].Email ||
      array.description.trim() !== result[0].Biography ||
      array.gender !== result[0].Gender ||
      array.birthDay !== JSON.stringify(result[0].DataBirthday).split("T")[0].replace('"', "") ||
      JSON.stringify(array.interest) !== result[0].ListInterest ||
      array.lookinFor.toString().replace(",", " ") !== result[0].Sexual ||
      JSON.stringify(images) !== result[0].Images ||
      array.City !== result[0].City
    )
      state = true;
    return state;
  }
  return "KO";
}

async function newData64(images) {
  let array = [];
  images.forEach((element) => {
    if (element) {
      if (element.split("/").length === 5 && element.indexOf("https") === -1) {
        let extension = element.split("/")[4].split(".")[1];
        if (fs.existsSync(`./images/${element.split("/")[4]}`))
          array.push(`data:image/${extension};base64,${fs.readFileSync(`./images/${element.split("/")[4]}`, "base64")}`);
      } else array.push(element);
    } else array.push("error");
  });
  return array;
}

async function getPostion(array, user) {
  return new Promise(async (resolve) => {
    const result = await mysql.query("Select * from Users WHERE IdUserOwner = ?", [user]);

    if (result[0].City === array.City) {
      resolve({ City: result[0].City, lat: result[0].Latitude, lon: result[0].Longitude });
    } else {
      axios
        .get(`http://api.positionstack.com/v1/forward?access_key=bfa8540a9dbc1011df9cbcb27489e9e1&query=${array.City}`)
        .then((res) => {
          resolve({ City: res.data.data[0].name, lat: res.data.data[0].latitude, lon: res.data.data[0].longitude });
        })
        .catch(() => {
          resolve({ City: array.City, lat: result[0].Latitude, lon: result[0].Longitude });
        });
    }
  });
}
async function updateInfo(array, user) {
  if (
    array.userName &&
    array.firstName &&
    array.lastName &&
    array.email &&
    array.birthDay &&
    array.gender &&
    array.lookinFor &&
    array.description &&
    array.interest &&
    array.images
  ) {
    if (Validate("Name", array.firstName) && Validate("Name", array.lastName) && Validate("Username", array.userName) && Validate("Email", array.email)) {
      if ((await information.checkData(array)) === true) {
        const newImages = await newData64(array.images);
        const image = information.checkimages(newImages);
        if (image === "error") return "images";
        else {
          if (information.checkDate(array.birthDay) === false) return "dateError";
          else {
            let state = await checkWhatChanged(array, user);
            if (state === false) return "onDate";
            else {
              if (cityList.indexOf(array.City) === -1) return "error";
              else {
                let result = await mysql.query("SELECT * FROM `Users` WHERE (`UserName` =? OR `Email`=?) AND IdUserOwner!=?", [
                  array.userName,
                  array.email,
                  user,
                ]);
                if (result.length >= 1) {
                  if (result[0].UserName == array.userName) return "username";
                  else if (result[0].Email == array.email) return "email";
                } else {
                  let result = await mysql.query("SELECT * FROM `Users` WHERE IdUserOwner=?", [user]);
                  let images_path = [];
                  let postion = await getPostion(array, user);
                  if (image !== "noImage") images_path = await information.uploadimage({ images: newImages });
                  oldImages = JSON.parse(result[0].Images);
                  oldImages.forEach((element) => {
                    if (element.indexOf("http") === -1)
                      if (fs.existsSync(`.${element}`))
                        fs.unlink(`.${element}`, function (err) {
                          if (err) throw err;
                        });
                  });
                  mysql.update(
                    "Users",
                    {
                      UserName: array.userName,
                      FirstName: array.firstName,
                      LastName: array.lastName,
                      Email: array.email,
                      DataBirthday: array.birthDay,
                      Gender: array.gender,
                      Sexual: array.lookinFor.toString().replace(",", " "),
                      Biography: array.description.trim(),
                      ListInterest: JSON.stringify(array.interest),
                      City: array.City,
                      Latitude: postion.lat,
                      Longitude: postion.lon,
                      Images: JSON.stringify(images_path),
                    },
                    {
                      IdUserOwner: user,
                    }
                  );
                  return { Image: images_path, UserName: array.userName, LastName: array.lastName, FirstName: array.firstName };
                }
              }
            }
          }
        }
      } else return "error";
    } else return "error";
  } else return "error";
}
async function checkToken(array) {
  let date = md5(Date.now());
  let req = "SELECT * FROM `Users` WHERE Token = ?";
  if (array.tok) {
    let result = await mysql.query(req, [array.tok.toString()]);
    if (result.length > 0) {
      let sql = "UPDATE `Users` SET Token=? WHERE Token=?";
      mysql.query(sql, [date, array.tok]);
      return "verify";
    } else return "KO";
  } else if (array.act) {
    let result = await mysql.query(req, [array.act.toString()]);
    if (result.length > 0) {
      let sql = "UPDATE `Users` SET Token=? WHERE Token=?";
      mysql.query(sql, [date, array.act]);
      return "created";
    } else return "KO";
  } else if (array.token) {
    let result = await mysql.query(req, [array.token.toString()]);
    if (result.length > 0) {
      let sql = "UPDATE `Users` SET Token=? WHERE Token=?";
      mysql.query(sql, [date, array.token]);
      return "resetpass";
    } else return "KO";
  } else return "KO";
}
module.exports = {
  checkAllow,
  checkValidCreate,
  Create,
  Login,
  resetpass,
  sendmail,
  updateInfo,
  checkToken,
  ifNotBlock,
  ...information,
};

var Jimp = require("jimp");
const axios = require("axios");
const mysql = require("./mysql");
const fs = require("fs");

async function fetchDataJSON(country, latitude, longitude, ip) {
  if (!latitude && ip) {
    const res = await axios.get(`http://ip-api.com/json/${ip}`);
    if (res.data.status === "fail") return "error";
    else
      return {
        Latitude: res.data.lat,
        Longitude: res.data.lon,
        City: res.data.city,
      };
  } else if (latitude && longitude && !country) return fetchCity(country, latitude, longitude);
  return new Promise((resolve) => {
    resolve({ City: country, Latitude: latitude, Longitude: longitude });
  });
}

function fetchCity(country, latitude, longitude) {
  return new Promise(async (resolve) => {
    if (country) resolve(country);
    else {
      const res = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=a9a78ca780d3456a9b8bf2b3e790a4b4`);
      resolve({
        City: res.data.results[0].components.city,
        Latitude: latitude,
        Longitude: longitude,
      });
    }
  });
}
async function getCity(array) {
  let ip = array.ip;
  let city;
  let position_info = await fetchDataJSON(city, array.latitude, array.longitude, ip);
  return position_info;
}

function checkimages(images) {
  return new Promise((resolve) => {
    let arr = [];
    if (images.length > 0)
      images.forEach((image) => {
        let base64Data = image.split(",");
        if (base64Data.length > 1) {
          const buffer = Buffer.from(base64Data[1], "base64");
          Jimp.read(buffer, (err, res) => {
            if (err) {
              resolve("error");
            } else {
              arr.push("ok");
            }
            if (arr.length === images.length) resolve("ok");
          });
        } else resolve("error");
      });
    else resolve("noImage");
  });
}

async function checkData(array) {
  let state = true;

  let date = new Date(array.birthDay);
  if (typeof array.lookinFor === "object" && typeof array.interest === "object" && typeof array.images === "object") {
    const arr = array.lookinFor.filter((items) => items !== "Male" && items !== "Female");
    const inter = array.interest.filter((items) => items !== "");
    if (typeof array.birthDay !== "string" && isNaN(date.getTime())) state = false;
    if (typeof array.description !== "string" || array.description.trim() === "" || array.description.trim().length > 250) state = false;
    if (array.gender !== "Female" && array.gender !== "Male" && array.gender !== "Other") state = false;
    if (arr.length > 0) state = false;
    if (array.interest.length <= 0 && array.interest.length > 5 && JSON.stringify(array.interest).length > 100) state = false;
    if (array.interest.length !== inter.length) state = false;
    if (array.images.length < 0) state = false;
    if (isNaN(array.latitude) || array.latitude > 90 || array.latitude < -90) state = false;
    if (isNaN(array.longitude) || array.longitude > 180 || array.longitude < -180) state = false;
  } else state = false;
  return state;
}

async function uploadimage(array) {
  let names = [];
  for (var i = 0; i < array.images.length; i++) {
    if (array.images[i].indexOf("https") === -1) {
      const extension = array.images[i].split("/")[1].split(";")[0];
      base64Data = array.images[i].replace("data:image/" + extension + ";base64,", "");
      let name = "/images/" + Date.now() + i + "." + extension;
      fs.writeFileSync("." + name, base64Data, "base64", function (err) {
        if (err) throw err;
      });
      names.push(name);
    } else names.push(array.images[i]);
  }

  return names;
}

function checkDate(date) {
  let date1 = date.split("-");
  let date2 = new Date(Date.now());

  var difference_year = date2.getFullYear() - date1[0];
  var difference_month = date2.getMonth() + 1 - date1[1];
  var difference_day = date2.getDate() - date1[2];

  if (difference_month < 0 || (difference_month === 0 && difference_day < 0)) {
    difference_year--;
  }
  if (difference_year > 130 || difference_year < 18) return false;
  else return true;
}

async function information(array, user) {
  if (user.IsActive === "2") {
    if (
      array.birthDay &&
      array.gender &&
      array.description &&
      array.interest &&
      array.images &&
      array.lookinFor &&
      ((array.latitude && array.longitude) || array.ip)
    ) {
      let state = await checkData(array);
      if (state === true) {
        let state = await checkimages(array.images);
        if (state === "error") {
          return "images";
        } else {
          if (checkDate(array.birthDay) === false) return "dateError";
          else {
            let position_info = await getCity(array);
            if (position_info === "error") return "errorIp";
            else {
              let images_path = await uploadimage(array);
              mysql.update(
                "Users",
                {
                  DataBirthday: new Date(array.birthDay),
                  Gender: array.gender,
                  Sexual: array.lookinFor.toString().replace(",", " "),
                  Biography: array.description.trim(),
                  ListInterest: JSON.stringify(array.interest),
                  Images: JSON.stringify(images_path),
                  Latitude: position_info.Latitude,
                  Longitude: position_info.Longitude,
                  City: position_info.City,
                  IsActive: "1",
                },
                {
                  IdUserOwner: user.IdUserOwner,
                  IsActive: "2",
                }
              );
              let result = await mysql.query("SELECT * FROM Users WHERE IdUserOwner=?", [user.IdUserOwner]);
              let firstImage = images_path[0] ? images_path[0] : "[]";
              let infoUser = {
                FirstName: result[0].FirstName,
                LastName: result[0].LastName,
                UserName: result[0].UserName,
                Image: firstImage,
              };
              return infoUser;
            }
          }
        }
      } else return "error";
    } else return "error";
  } else return "error";
}

module.exports = {
  information,
  checkDate,
  uploadimage,
  checkData,
  checkimages,
  fetchCity,
  fetchDataJSON,
};

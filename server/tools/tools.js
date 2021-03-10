const axios = require("axios");
const Jimp = require("jimp");
const dataUser = require("./functions_user");
const mysql = require("./mysql");

function init(app, obj) {
  for (const [key, value] of Object.entries(obj)) app.locals[key] = value;
}
function Validate(name, value) {
  const list = {
    Name: /^[a-zA-Z0-9]{2,30}$/g.test(value) && value ? true : false,
    Username: /^[a-zA-Z0-9]{2,15}[\-\_\.]{0,1}[a-zA-Z0-9]{2,15}$/g.test(value) && value ? true : false,
    Email:
      /^[a-zA-Z0-9]{1,10}[\-\_\.]{0,1}[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}[\-\_]{0,1}[a-zA-Z0-9]{1,5}.[a-zA-Z0-9]{1,5}[\.]{0,1}[a-zA-Z0-9]{1,5}$/g.test(value) &&
      value
        ? true
        : false,
    Password: (() => {
      const hasOneLowerCase = /[a-z]{1,}/g.test(value);
      const hasOneUpperCase = /[A-Z]{1,}/g.test(value);
      const hasOneNumber = /[0-9]{1,}/g.test(value);
      return value && hasOneLowerCase && hasOneUpperCase && hasOneNumber && /^[ -~]{8,30}$/g.test(value) ? true : false;
    })(),
  };
  return list[name];
}
function sendResponse(res, code, message, json) {
  res.status(code);
  if (json) res.json(message);
  else res.send(message);
  res.end();
}
function handleError(err, req, res, next) {
  if (err) {
    req.app.locals.sendResponse(res, 400, "Bad Request");
  } else next();
}

async function notification(req, Type, UserOwner, UserReceiver) {
  const locals = req.app.locals;
  const IdUserOwner = await locals.getIdUserOwner(UserOwner);
  const IdUserReceiver = await locals.getIdUserOwner(UserReceiver);
  const ifNotBlock = await locals.ifNotBlock(IdUserOwner, IdUserReceiver, locals);
  if (IdUserOwner && IdUserReceiver && ifNotBlock) {
    let result = {
      insertId: null,
    };
    if (Type !== "addFriend") {
      result = await locals.insert("Notifications", {
        IdUserOwner,
        IdUserReceiver,
        Type,
      });
      if (Type !== "removeFriend")
        locals.insert("History", {
          IdUserOwner,
          IdUserReceiver,
          Content: `You ${Type} ${UserReceiver}`,
        });
    }
    if (locals.sockets && locals.sockets.length > 0 && locals.sockets[IdUserReceiver]) {
      const user = await locals.select("Users", ["IdUserOwner", "Images", "UserName", "LastLogin", "Active"], { IdUserOwner });
      if (Type === "addFriend" || Type === "LikedBack") {
        const messages = await locals.query(
          'SELECT IdMessages As "id",IdUserOwner,Content,DateCreation As "date" FROM Messages WHERE (IdUserOwner=? AND idUserReceiver=?) OR (IdUserOwner=? AND IdUserReceiver=?) ORDER BY DateCreation DESC LIMIT 30',
          [IdUserOwner, IdUserReceiver, IdUserReceiver, IdUserOwner]
        );
        const IsRead = await locals.select("Messages", "COUNT(IsRead) AS IsRead", {
          IdUserReceiver: req.userInfo.IdUserOwner,
          IsRead: 0,
        });
        user[0].IsRead = IsRead.length > 0 ? IsRead[0].IsRead : 0;
        user[0].messages = messages;
      }
      user[0].Images = JSON.parse(user[0].Images)[0];
      locals.sockets[IdUserReceiver].map((item) =>
        item.emit(
          "notice",
          JSON.stringify({
            user: user.length > 0 ? user[0] : user,
            Type,
            IdNotification: result.insertId,
            DateCreation: new Date().toISOString(),
          })
        )
      );
    }
  }
}
function checkIfHasOneImage(req, res, next) {
  if (JSON.parse(req.userInfo.Images).length > 0) next();
  else res.app.locals.sendResponse(res, 200, "You Need At lest One Image to do This Action");
}
module.exports = {
  sendResponse,
  init,
  handleError,
  sendResponse,
  Validate,
  notification,
  checkIfHasOneImage,
  ...dataUser,
};

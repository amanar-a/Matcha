const express = require("express");
const router = express.Router();
const haversine = require("haversine-distance");

router.get("/BlockUser/:UserName", async (req, res) => {
  const locals = req.app.locals;

  const idUserName = await locals.getIdUserOwner([req.params.UserName]);
  const ifBlock = await locals.ifNotBlock(req.user, idUserName);
  if (ifBlock) {
    locals.insert("Blacklist", { IdUserOwner: req.user, IdUserReceiver: idUserName });
    locals.query("Delete FROM Friends WHERE (IdUserOwner=? AND IdUserReceiver=?) or (IdUserOwner=? AND IdUserReceiver=?)", [
      req.user,
      idUserName,
      idUserName,
      req.user,
    ]);
    locals.query("Delete FROM History WHERE (IdUserOwner=? AND IdUserReceiver=?) or (IdUserOwner=? AND IdUserReceiver=?)", [
      req.user,
      idUserName,
      idUserName,
      req.user,
    ]);
    locals.query("Delete FROM Messages WHERE (IdUserOwner=? AND IdUserReceiver=?) or (IdUserOwner=? AND IdUserReceiver=?)", [
      req.user,
      idUserName,
      idUserName,
      req.user,
    ]);
    locals.query("Delete FROM Notifications WHERE (IdUserOwner=? AND IdUserReceiver=?) or (IdUserOwner=? AND IdUserReceiver=?)", [
      req.user,
      idUserName,
      idUserName,
      req.user,
    ]);
    locals.sendResponse(res, 200, "User Has Been Blocked");
  } else {
    locals.sendResponse(res, 200, "User Already Blocked");
  }
});
router.get("/checkProfile/:userName", async (req, res) => {
  const locals = req.app.locals;
  let userInfo = {};
  let match;
  let result = await locals.query("Select * from Users Where UserName=? AND IsActive=1", [req.params.userName]);
  if (result.length > 0) {
    let ifBlock = await locals.query("SELECT * FROM Blacklist WHERE (IdUserOwner=? AND IdUserReceiver=?) or (IdUserOwner=? AND IdUserReceiver=?)", [
      req.user,
      result[0].IdUserOwner,
      result[0].IdUserOwner,
      req.user,
    ]);
    if (ifBlock.length === 0) {
      if (req.user !== result[0].IdUserOwner) match = await locals.checkMatch(req.user, result[0].IdUserOwner);
      let friends = await locals.getFriends(result[0].IdUserOwner);
      let ifReport = await locals.checkUserNotReport({ IdUserOwner: req.user, IdUserReceiver: result[0].IdUserOwner });
      let Rating = await locals.query(
        "Select AVG(RatingValue) as RatingAvg,(SELECT RatingValue from Rating WHERE IdUserOwner=? AND IdUserReceiver=?) as RatingValue From Rating where IdUserReceiver=?",
        [req.user, result[0].IdUserOwner, result[0].IdUserOwner]
      );
      userInfo = {
        userName: result[0].UserName,
        firstName: result[0].FirstName,
        lastName: result[0].LastName,
        email: result[0].Email,
        birthDay: JSON.stringify(result[0].DataBirthday).split("T")[0].replace('"', ""),
        gender: result[0].Gender,
        lookinFor: result[0].Sexual.split(" "),
        description: result[0].Biography,
        latitude: result[0].Latitude,
        longitude: result[0].Longitude,
        interest: JSON.parse(result[0].ListInterest),
        images: JSON.parse(result[0].Images),
        City: result[0].City,
        friends: friends[0].numberOfFriends,
        match: req.user !== result[0].IdUserOwner ? match[0].isMatch : 0,
        reported: ifReport,
        RatingAvg: Rating[0].RatingAvg !== null ? Rating[0].RatingAvg : 0,
        RatingValue: Rating[0].RatingValue !== null ? Rating[0].RatingValue : 0,
        Distance: haversine({ lat: req.userInfo.Latitude, lng: req.userInfo.Longitude }, { lat: result[0].Latitude, lng: result[0].Longitude }) / 1000,
        Online: result[0].Active ? "1" : result[0].LastLogin,
        permis: req.user === result[0].IdUserOwner ? 1 : 0,
      };
      if (req.userInfo.UserName !== result[0].UserName) locals.notification(res, "View", req.userInfo.UserName, result[0].UserName);
    } else userInfo = { state: null };
  } else userInfo = { state: null };
  locals.sendResponse(res, 200, userInfo);
});

router.get("/Report/:userName", async (req, res) => {
  const locals = req.app.locals;
  const idUserName = await locals.getIdUserOwner(req.params.userName);
  const ifReport = await locals.checkUserNotReport({ IdUserOwner: req.user, IdUserReceiver: idUserName });
  let msg;

  if (ifReport === 0) {
    locals.insert("Report", { IdUserOwner: req.user, IdUserReceiver: idUserName });
    locals.insert("History", { IdUserOwner: req.user, IdUserReceiver: idUserName, Content: `you Report ${req.params.userName}` });
    msg = "User has been reported";
  } else {
    msg = "User already been reported";
  }
  locals.sendResponse(res, 200, msg);
});
router.post("/getInfoUser", async (req, res) => {
  const locals = req.app.locals;

  const result = await locals.query("Select * from Users where IdUserOwner=?", [req.user]);
  let info = {
    UserName: result[0].UserName,
    FirstName: result[0].FirstName,
    LastName: result[0].LastName,
    Image: result[0].Images !== "[]" ? JSON.parse(result[0].Images)[0] : "[]",
  };
  locals.sendResponse(res, 200, info);
});

router.get("/unBlock/:userName", async (req, res) => {
  const locals = req.app.locals;

  let idUser = await locals.getIdUserOwner(req.params.userName);
  let result = await locals.delete("Blacklist", { IdUserOwner: req.user, IdUserReceiver: idUser });
  if (result.affectedRows === 1) locals.sendResponse(res, 200, "User UnBlocked");
  else locals.sendResponse(res, 200, "error");
});
module.exports = router;

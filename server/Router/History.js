const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const locals = req.app.locals;
  let infoHistory = {};
  let Blacklist = {};
  let arrayInfo = [];
  let information = {
    history: [],
    blacklist: [],
  };

  let history = await locals.query(
    "SELECT DateCreation,Content,UserName,Images FROM History h,Users u WHERE h.IdUserOwner=? AND h.IdUserReceiver=u.IdUserOwner ORDER BY DateCreation DESC",
    [req.user]
  );
  let blockedList = await locals.query(
    "SELECT b.IdUserReceiver, DateBlock,Images,UserName FROM Blacklist b,Users u WHERE b.IdUserOwner=? AND b.IdUserReceiver=u.IdUserOwner ORDER BY DateBlock DESC",
    [req.user]
  );
  if (history.length > 0) {
    history.forEach((element) => {
      infoHistory = {
        actionOwner: element.UserName,
        date: element.DateCreation,
        Content: element.Content,
        Image: JSON.parse(element.Images) !== "[]" ? JSON.parse(element.Images)[0] : null,
      };
      arrayInfo.push(infoHistory);
    });
    information.history = arrayInfo;
  }
  arrayInfo = [];
  if (blockedList.length > 0) {
    blockedList.forEach((element) => {
      Blacklist = {
        blockedUser: element.UserName,
        Image: JSON.parse(element.Images) !== "[]" ? JSON.parse(element.Images)[0] : null,
      };
      arrayInfo.push(Blacklist);
    });
    information.blacklist = arrayInfo;
  }
  locals.sendResponse(res, 200, information);
});

module.exports = router;

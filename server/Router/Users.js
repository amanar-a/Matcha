const express = require("express");
const router = express.Router();
const haversine = require("haversine-distance");
const { auth } = require("./Authentication");
require("dotenv").config({
  path: __dirname + "/../.env",
});

router.post("/", auth, async function (req, res) {
  const { Latitude, Longitude } = req.userInfo;
  const { list, age, name, location, rating, sort, start, length } = req.body;
  const locals = req.app.locals;
  if (
    (!name || (name && name.length <= 255)) &&
    list instanceof Array &&
    list.length <= 5 &&
    list.toString().length <= 255 &&
    location instanceof Array &&
    location.length === 2 &&
    location[0] >= 0 &&
    location[1] <= 1000 &&
    sort &&
    sort.hasOwnProperty("Age") &&
    sort.hasOwnProperty("distance") &&
    sort.hasOwnProperty("listInterest") &&
    sort.hasOwnProperty("rating") &&
    start >= 0 &&
    length > 0
  ) {
    let filterResult = await locals.filter({ IdUserOwner: req.userInfo.IdUserOwner, name, age, rating, sexual: req.userInfo.Sexual });
    let newFilterResult = [];
    const listInterest = [...list, ...JSON.parse(req.userInfo.ListInterest)];
    if (filterResult && filterResult.length > 0) {
      filterResult.map((item) => {
        item.rating = item.rating === null ? 0 : item.rating;
        item.distance = haversine({ lat: item.Latitude, lng: item.Longitude }, { lat: Latitude, lng: Longitude });
        const km = item.distance / 1000;
        if ((location[1] === 1000 && km >= location[0]) || (km >= location[0] && km <= location[1])) newFilterResult.push(item);
      });
      function cmp(a, b) {
        const keysNeedToCompare = ["distance", "rating", "Age"];
        let count1 = 0,
          count2 = 0;
        if (sort.listInterest)
          listInterest.map((item) => {
            if (JSON.parse(a.ListInterest).indexOf(item) > -1) count1++;
            if (JSON.parse(b.ListInterest).indexOf(item) > -1) count2++;
          });
        for (const key of Object.keys(a)) {
          if (keysNeedToCompare.indexOf(key) > -1 && sort[key]) {
            const inc = key === "rating" ? 1 : -1;
            if (a[key] > b[key]) count1 += inc;
            else if (a[key] < b[key]) count2 += inc;
          }
        }
        return count2 - count1;
      }
      newFilterResult.sort(cmp);
      newFilterResult = newFilterResult.slice(start, length + start);
      if (newFilterResult.length < length) newFilterResult.push("limit");
      locals.sendResponse(res, 200, newFilterResult, true);
    } else locals.sendResponse(res, 200, "None");
  } else locals.sendResponse(res, 200, "bad request");
});

router.get("/listInterest", auth, async function (req, res) {
  const result = await req.app.locals.select("Users", "ListInterest", { IsActive: 1 });
  const myList = await req.app.locals.select("Users", "ListInterest", {
    IdUserOwner: req.userInfo.IdUserOwner,
  });
  let listInterest = [];
  result.map((item) => (item.ListInterest ? listInterest.push(...JSON.parse(item.ListInterest)) : 0));
  listInterest = [...new Set(listInterest)];
  req.app.locals.sendResponse(
    res,
    200,
    {
      list: listInterest,
      active: myList.length > 0 ? JSON.parse(myList[0].ListInterest) : [],
    },
    true
  );
});

module.exports = router;

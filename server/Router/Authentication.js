const express = require("express");
const router = express.Router();
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const mysql = require("../tools/mysql");

require("dotenv").config({ path: __dirname + "/../.env" });

async function auth(req, res, next) {
  const authorization = req.headers["authorization"];
  const locals = req.app.locals;
  if (authorization) {
    if (authorization.split(" ").length > 1) {
      jwt.verify(authorization.split(" ")[1], process.env.JWT_KEY, async (err, payload) => {
        const result = await locals.select("Users", "*", { JWT: authorization.split(" ")[1] });
        if (result.length > 0) {
          if (payload) {
            req.userInfo = result[0];
            req.user = result[0].IdUserOwner;
            next();
          } else if (err.message === "jwt expired") locals.sendResponse(res, 200, "Access token expired");
          else locals.sendResponse(res, 200, "User not authenticated");
        } else locals.sendResponse(res, 200, "token invalid");
      });
    } else locals.sendResponse(res, 200, "token invalid");
  } else {
    locals.sendResponse(res, 400, "token not found");
  }
}
router.get("/Logout", auth, function (req, res) {
  if (req.userInfo) {
    req.app.locals.update("Users", { Active: 0 }, { JWT: req.userInfo.JWT });
    req.app.locals.sendResponse(res, 200, "You're now logout");
  } else req.app.locals.sendResponse(res, 403, "Something wrong please try again");
});
router.post("/login", async function (request, response) {
  const locals = request.app.locals;

  if (request.body.Username && request.body.Password) {
    locals.Login(request.body).then(async (res) => {
      if (res !== "0" && res !== "2") {
        const accessToken = jwt.sign(res.token, process.env.JWT_KEY);
        await mysql.update("Users", { JWT: accessToken }, { IdUserOwner: res.token.IdUserOwner });
        response.send({ token: accessToken, InfoUser: res.infoUser });
      } else response.send(res);
      response.end();
    });
  } else response.end();
});
router.post("/checkMsg", async function (request, response) {
  const locals = request.app.locals;

  if (request.body.token || request.body.act || request.body.tok) {
    locals.checkToken(request.body).then((res) => {
      response.send(res);
      response.end();
    });
  } else response.end();
});
router.post("/sendResetPass", async function (request, response) {
  const locals = request.app.locals;
  if (request.body) {
    locals.sendmail(request.body, request.headers.host).then((res) => {
      response.send(res);
      response.end();
    });
  } else response.end();
});
router.post("/resetpass", async function (request, response) {
  const locals = request.app.locals;
  if (request.body) {
    locals.resetpass(request.body).then((res) => {
      response.send(res);
      response.end();
    });
  } else response.end();
});
router.post("/createaccount", async function (request, response) {
  const locals = request.app.locals;

  if (request.body) {
    locals.Create(request.body, request.headers.host).then((res) => {
      response.send(res);
      response.end();
    });
  } else response.end();
});
router.post("/checkifallow", auth, async function (request, response) {
  const locals = request.app.locals;

  locals.checkAllow(request).then((res) => {
    response.send(res);
    response.end();
  });
});

router.post("/information", auth, async function (request, response) {
  const locals = request.app.locals;

  if (request.body.info) {
    locals.information(request.body.info, request.userInfo).then((res) => {
      locals.sendResponse(response, 200, res);
    });
  } else locals.sendResponse(response, 200, "error");
});
router.post("/updateinformation", auth, async function (request, response) {
  const locals = request.app.locals;

  if (request.body.information) {
    locals.updateInfo(request.body.information, request.user).then((res) => {
      locals.sendResponse(response, 200, res);
    });
  } else locals.sendResponse(response, 200, "KO");
});

router.post("/updatepassword", auth, async function (request, response) {
  if (request.body.newPass1 && request.body.newPass2 && request.body.oldPass) {
    if (/^(?=.*[0-9])(?=.*[A-Z])[ -~]{8,30}$/g.test(request.body.newPass1)) {
      if (request.body.newPass1 === request.body.newPass2) {
        let result = await mysql.query("Select * from Users WHERE IdUserOwner=?", [request.user]);
        if (result[0].Password === md5(request.body.oldPass)) {
          mysql.update("Users", { Password: md5(request.body.newPass1) }, { IdUserOwner: request.user });
        } else response.send("oldPass");
      } else response.send("error");
    } else response.send("error");
  } else response.send("error");
  response.end();
});

module.exports = { Authentication: router, auth };

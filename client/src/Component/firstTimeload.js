import axios from "axios";

function firstTime(changeMsg) {
  let string = {};
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("tok") || urlParams.get("act") || urlParams.get("token")) {
    if (urlParams.get("tok")) {
      string = { tok: urlParams.get("tok") };
    } else if (urlParams.get("act")) {
      string = { act: urlParams.get("act") };
    } else if (urlParams.get("token")) {
      string = { token: urlParams.get("token") };
    }
    axios.post("Authentication/checkMsg", string).then((res) => {
      if (res.data === "verify") {
        changeMsg({
          state: true,
          type: "success",
          msg: "Account has been verified",
        });
      } else if (res.data === "created") {
        changeMsg({
          state: true,
          type: "success",
          msg: "Account created please verify your email",
        });
      } else if (res.data === "resetpass") {
        changeMsg({
          state: true,
          type: "success",
          msg: "Password has been changed",
        });
      }
    });
  }
}

export { firstTime };

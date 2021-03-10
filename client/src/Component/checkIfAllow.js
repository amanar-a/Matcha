import axios from "axios";

function checkIfAllow() {
  return new Promise((resolve, reject) => {
    if (localStorage.getItem("token")) {
      axios.post("/Authentication/checkifallow").then((res) => {
        resolve(res.data);
      });
    } else resolve("notAllow");
  });
}

export { checkIfAllow };

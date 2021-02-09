const express = require("express");
const app = express();
const port = 3000;
const scraper = require("./scraper");
const fs = require("fs");
const path = require("path");

app.get("/search", async (req, res) => {
  let rawdata = fs.readFileSync("jobs.json");
  let parsedJson = JSON.parse(rawdata);
  parsedJson.data = [];
  const backToJSON = JSON.stringify(parsedJson); //reserialize to JSON
  // console.log(_data);
  fs.writeFileSync("jobs.json", backToJSON);

  await scraper();
  fs.readFile("./jobs.json", (err, json) => {
    let obj = JSON.parse(json);
    res.render("index", {
      data: {
        userQuery: req.params.userQuery,
        searchResults: obj.data,
        loggedIn: true,
        username: "Ghostface Killah",
      },
    });
  });
});

app.use("/public", express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  let rawdata = fs.readFileSync("jobs.json");
  let parsedJson = JSON.parse(rawdata);

  res.render("index", {
    data: {
      userQuery: req.params.userQuery,
      searchResults: parsedJson.data,
      loggedIn: true,
      username: "Ghostface Killah",
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here
  process.exit(1);
});

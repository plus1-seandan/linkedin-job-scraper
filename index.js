const express = require("express");
const app = express();
const port = 3000;
const scraper = require("./scraper");
const fs = require("fs");

app.get("/", async (req, res) => {
  await scraper();
  fs.readFile("./jobs.json", (err, json) => {
    let obj = JSON.parse(json);
    res.json(obj);
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

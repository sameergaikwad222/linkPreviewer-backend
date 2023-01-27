const express = require("express");
const app = express();
const urlRoute = require("./Route/url");
var bodyParser = require("body-parser");
let envObj = {};
var env = process.argv[2] || "dev";
switch (env) {
  case "dev":
    envObj = require("./config/config.json")["dev"];
    break;
  case "prod":
    envObj = require("./config/config.json")["prod"];
    break;
}
const PORT = envObj.PORT || 3000;

console.log(envObj);

app.use(bodyParser.json());
app.use("/api/v1/", urlRoute);

app.get("/", (req, res) => {
  res.send("Hello From Link Preview App");
});

app.listen(PORT, () => {
  console.log(`App is running on localhost:${PORT}`);
});

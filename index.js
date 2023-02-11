const express = require("express");
const app = express();
const urlRoute = require("./Route/url");
var bodyParser = require("body-parser");
const { connectDatabase } = require("./src/database");
let env =
  process.argv[2] === "prod"
    ? require("./src/config/config.json")["prod"]
    : require("./src/config/config.json")["dev"];

const PORT = env.PORT || 3000;

app.use(bodyParser.json());
app.use("/api/v1/", urlRoute);

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is running on localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));

const express = require("express");

const router = express.Router();
let { getData } = require("../appData");

router.get("/", (req, res) => {
  res.send("From URL Route");
});

router.post("/getUrlData", async (req, res) => {
  let respArray = [];
  let urlData = [...req.body.urlData];
  respArray = await getData(urlData);
  res.status(200).json(respArray);
});

module.exports = router;

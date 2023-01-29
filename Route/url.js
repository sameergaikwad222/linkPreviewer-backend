const express = require("express");
const {
  validateUrlSchema,
} = require("../middlewares/validations/joiValidations");
const router = express.Router();
let { getData } = require("../src/appData");

router.get("/", (req, res) => {
  res.send("Hello From Link Preview App");
});

router.post("/getUrlData", validateUrlSchema, async (req, res) => {
  let respArray = [];
  let urlData = [...req.body.urlData];
  respArray = await getData(urlData);

  respArray.length > 0
    ? res.status(200).json(respArray)
    : res.status(500).json({ error: "No data found" });
});

module.exports = router;

const express = require("express");
const {
  validateUrlSchema,
} = require("../src/middlewares/validations/joiValidations");

const LinkPreview = require("../src/controllers/index");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello From Link Preview App");
});

router.post(
  "/getUrlData",
  validateUrlSchema,
  LinkPreview.Controller.linkFetchAndUpdate
);

module.exports = router;

const mongoose = require("mongoose");

const urlSchema = mongoose.Schema({
  url: String,
  title: String,
  type: String,
  image: String,
  imageAlt: String,
  desc: String,
  site_name: String,
  favicon: String,
});

const URL = mongoose.model("URL", urlSchema);

module.exports = { URL };

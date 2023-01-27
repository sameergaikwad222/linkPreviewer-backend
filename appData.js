const axios = require("axios");
const cheerio = require("cheerio");

function getHeadData(rawString) {
  if (rawString.indexOf("<head>") < 0) {
    return;
  }
  rawString = rawString.substring(
    rawString.indexOf("<head>"),
    rawString.indexOf("</head>") + 7
  );
  return rawString;
}

async function getData(urls = []) {
  let metaData = [];
  let promiseObjectForAll = [];
  urls.forEach((urlLink) => {
    let linkPromise = axios({ method: "get", url: urlLink });

    promiseObjectForAll.push(linkPromise);
  });

  await Promise.all(promiseObjectForAll).then((resp) => {
    resp.forEach((r) => {
      let previewObject = {
        url: "",
        title: "",
        type: "",
        image: "",
        imageAlt: "",
        desc: "",
        site_name: "",
        favicon: "",
      };
      let headData = "";
      headData += getHeadData(r.data);
      const $ = cheerio.load(headData);
      previewObject.url = $("meta[property='og:url']").attr("content")
        ? $("meta[property='og:url']").attr("content")
        : "";
      previewObject.title = $("meta[property='og:title']").attr("content")
        ? $("meta[property='og:title']").attr("content")
        : "";
      previewObject.type = $("meta[property='og:type']").attr("content")
        ? $("meta[property='og:type']").attr("content")
        : "";
      previewObject.image = $("meta[property='og:image']").attr("content")
        ? $("meta[property='og:image']").attr("content")
        : "";
      previewObject.imageAlt = $("meta[property='og:image:alt']").attr(
        "content"
      )
        ? $("meta[property='og:image:alt']").attr("content")
        : "SomeImage";
      previewObject.desc = $("meta[property='og:description']").attr("content")
        ? $("meta[property='og:description']").attr("content")
        : "";
      previewObject.site_name = $("meta[property='og:site_name']").attr(
        "content"
      )
        ? $("meta[property='og:site_name']").attr("content")
        : "";
      previewObject.favicon = $('link[rel~="icon"]').prop("href")
        ? $('link[rel~="icon"]').prop("href")
        : "";

      metaData.push(previewObject);
    });
  });

  return metaData;
}

module.exports = { getData };

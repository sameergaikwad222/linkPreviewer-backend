const axios = require("axios");
const util = require("util");
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
const { URL } = require("./Models/URLS");
const { resolve } = require("path");
const logger = require("./Loggers/logger");
async function getData(urls = []) {
  let metaData = [];
  let metaDataURLs = [];
  let existingURLs = [];
  let existingURLData = [];
  let finalData = [];
  let promiseObjectForAll = [];

  try {
    const data = await URL.find(
      {
        url: {
          $in: urls,
        },
      },
      { _id: 0, __v: 0 }
    );

    if (data) {
      //Copy existing data into an Array
      existingURLData = existingURLData.concat(data);
      existingURLs = existingURLs.concat(data);
      existingURLs = existingURLs.map((uObj) => uObj.url);
    }

    metaDataURLs = urls.filter((url) => !existingURLs.includes(url));

    //Insert any new URl into MetaData
    if (metaDataURLs.length > 0) {
      metaDataURLs.forEach((urlLink) => {
        let linkPromise = axios({ method: "get", url: urlLink });
        promiseObjectForAll.push(linkPromise);
      });

      if (promiseObjectForAll.length > 0) {
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
            previewObject.url = r.config.url;
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
            previewObject.desc = $("meta[property='og:description']").attr(
              "content"
            )
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

        //Clean Meta Data
        metaData = metaData.filter((meta) => {
          return !(meta.title === "");
        });

        if (metaData.length > 0 && metaData[0]) {
          URL.insertMany(metaData)
            .then(function () {
              logger.info(`${metaData.length} Data inserted`); // Success
            })
            .catch(function (error) {
              logger.error(error); // Failure
            });
        }
      }
    }

    finalData = [...metaData, ...existingURLData];
    return finalData.length > 0 ? finalData : [];
  } catch (error) {
    logger.error(error); // Failure
    return [];
  }
}

module.exports = { getData };

const fs = require("fs");
const path = require("path");

const textFile10Kb = require("./../../10kb.txt");

/**
 * Returns a random number between start (inclusive) and start (exclusive)
 */
function getRandomNumber(start, end) {
  return Math.round(Math.random() * (end - start) + start);
}

function getRandomSizeString() {
  try {
    const decideSize = getRandomNumber(1, 1000); // file size from 10kb to 10mb

    console.log("file size will be approximately " + decideSize * 10 + " kbs");

    let copyText = "";

    for (let i = 0; i < decideSize; i++) {
      copyText += textFile10Kb;
    }

    return copyText;
  } catch (err) {
    console.log("err in getRandomSizeString", err);
    throw err;
  }
}

function entryForTheData(content, filename) {
  try {
    const writeStream = fs.createWriteStream(
      path.resolve(__dirname, "../../" + filename),
      {
        flags: "a",
      },
    );
    writeStream.write(content);
  } catch (err) {
    console.log("err in entryForTheData", err);
    throw err;
  }
}

module.exports = {
  getRandomSizeString,
  entryForTheData,
};


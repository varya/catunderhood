const head = require("ramda").head;
const core = require("@actions/core");
const authors = require("../../authors");
const fs = require("fs");
const getTweets = require("../../helpers/get-tweets");

const { username } = head(authors);

const infoPath = `./dump/${username}-info.json`;
const mediaPath = `./dump/${username}-media.json`;

try {
  if (fs.existsSync(infoPath) && fs.existsSync(mediaPath)) {
    core.exportVariable("AUTHOR_DATA_EXISTS", true);
  }
} catch (err) {
  console.error(err);
}

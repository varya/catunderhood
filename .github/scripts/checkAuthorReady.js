const head = require("ramda").head;
const core = require("@actions/core");
const underhood = require("../../.underhoodrc.json").underhood;
const authors = require("../../authors");
const fs = require("fs");
const tokens = require("twitter-tokens");
const getTweets = require("../../helpers/get-tweets");

const { username } = head(authors);

const tweets = [];
const tweetsSinceId = authors[0].last;

getTweets(tokens, underhood, tweetsSinceId, (err, newTweetsRaw) => {
  if (err) throw err;
  const authorReady = newTweetsRaw.length > 1 ? true : false;
  core.exportVariable("AUTHOR_READY", authorReady);
});

import log from "../../helpers/log";
import { outputFile } from "fs-extra";
import { isEmpty, concat, reverse, last, dissoc, map, head } from "ramda";
import moment from "moment";
import dec from "bignum-dec";
import { sync as rm } from "rimraf";

import { underhood } from "../../.underhoodrc.json";
import authors from "../../authors";

import tokens from "twitter-tokens";
import getTweets from "../../helpers/get-tweets";
import getInfo from "get-twitter-info";
import saveMedia from "../../helpers/save-media";
import getFollowers from "get-twitter-followers";
import twitterMentions from "twitter-mentions";

import ensureFilesForFirstUpdate from "../../helpers/ensure-author-files";
import getAuthorArea from "../../helpers/get-author-area";
import saveAuthorArea from "../../helpers/save-author-area";

const { username } = head(authors);

// ensureFilesForFirstUpdate(username, ["tweets"]);

import { writeFile } from "fs";

const newUsername = process.argv.slice(2)[0]; //new author

if (!newUsername) {
  console.log("Please provide a username of a person who will take the shift");
  process.exit();
}

const tweets = [];
const mentions = [];

const saveLastTweetId = (tweets) => {
  const lastTweetId = isEmpty(tweets) ? tweetsSinceId : last(tweets).id_str;

  /* Assign new author */

  const newStartDate = moment(new Date(authors[0].start))
    .add(1, "w")
    .format("DD MMMM YYYY");

  const newAuthors = [
    { username: newUsername, start: newStartDate, post: false },
    Object.assign(authors.shift(), { last: lastTweetId, post: true }),
    ...authors,
  ];

  writeFile(
    `./authors.js`,
    "export default " + JSON.stringify(newAuthors, null, 2),
    (err) => console.log("err", err)
  );
};

const tweetsSinceId = authors[1].last;

/* Save data for the author who is finished */
getTweets(tokens, underhood, tweetsSinceId, (err, newTweetsRaw) => {
  if (err) throw err;
  const concattedTweets = concat(tweets, reverse(newTweetsRaw));
  saveAuthorArea(username, "tweets", { tweets: concattedTweets });
  saveLastTweetId(concattedTweets);
});

getFollowers(tokens, underhood, (err, followersWithStatuses) => {
  if (err) throw err;
  const followers = map(dissoc("status"), followersWithStatuses);
  saveAuthorArea(username, "followers", { followers });
});

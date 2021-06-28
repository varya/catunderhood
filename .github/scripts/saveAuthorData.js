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

import { writeFile } from "fs";

const { username } = head(authors);

getInfo(tokens, underhood, (err, info) => {
  if (err) throw err;
  saveAuthorArea(username, "info", info);
});

// rm(`./dump/images/${username}*`);
saveMedia(tokens, underhood, username, (err, media) => {
  if (err) throw err;
  saveAuthorArea(username, "media", media);
});

const fs = require("fs");
const Twitter = require("twitter");
const RSS = require("rss");
const tweetToHTML = require("tweet-to-html");

const photoConfig = {
  photoSize: "large" // Any size supported by the `media` entity (thumb, small, medium...)
};

module.exports = function(vorpal) {
  vorpal
    .command("twitter-to-rss")
    .description("Create a RSS feed from your Twitter home timeline")
    .action(function(args, callback) {
      const {
        consumer_key,
        consumer_secret,
        access_token_key,
        access_token_secret,
        feedCount,
        feedTitle,
        feedFilePath
      } = vorpal.config.twitter_rss;

      //From https://apps.twitter.com/
      const client = new Twitter({
        consumer_key,
        consumer_secret,
        access_token_key,
        access_token_secret
      });

      const params = {
        count: feedCount,
        //https://developer.twitter.com/en/docs/tweets/tweet-updates
        tweet_mode: "extended"
      };
      // https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-home_timeline.html
      client.get("statuses/home_timeline", params, function(error, tweets) {
        if (!error) {
          const feedOptions = {
            title: feedTitle
          };
          const feed = new RSS(feedOptions);
          tweets.forEach(tweet => {
            const rssItem = tweetToRssItem(tweet);
            feed.item(rssItem);
          });

          const xml = feed.xml({
            indent: true
          });
          fs.writeFileSync(feedFilePath, xml);
        } else {
          console.error(error);
        }
        callback();
      });
    });
};

function tweetToRssItem(tweet) {
  const description = tweetToHTML.parse(tweet, photoConfig).html;

  return {
    title: tweet.full_text,
    description: description,
    url: `https://twitter.com/i/web/status/${tweet.id_str}`,
    guid: tweet.id_str,
    author: tweet.user.name,
    date: tweet.created_at
  };
}

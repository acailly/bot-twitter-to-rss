const fs = require('fs')
const Twitter = require('twitter')
const RSS = require('rss');

module.exports = function (vorpal) {
  vorpal
    .command('twitter-to-rss')
    .description('Create a RSS feed from your Twitter home timeline')
    .action(function (args, callback) {
      const {
        consumer_key,
        consumer_secret,
        access_token_key,
        access_token_secret,
        feedCount,
        feedTitle,
        feedFilePath
      } = vorpal.config.twitter_rss

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
        tweet_mode: 'extended'
      }
      // https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-home_timeline.html
      client.get('statuses/home_timeline', params, function (error, tweets) {
        if (!error) {
          const feedOptions = {
            title: feedTitle
          }
          const feed = new RSS(feedOptions)
          tweets.forEach(tweet => feed.item(tweetToRssItem(tweet)))
          const xml = feed.xml({
            indent: true
          })
          fs.writeFileSync(feedFilePath, xml)
        }
        callback()
      });
    })
}

function tweetToRssItem(tweet) {
  return {
    title: tweet.full_text,
    description: tweet.full_text,
    url: `https://twitter.com/statuses/${tweet.id_str}`,
    guid: tweet.id_str,
    author: tweet.user.name,
    date: tweet.created_at
  }
}
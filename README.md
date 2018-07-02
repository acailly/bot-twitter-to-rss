# bot-twitter-to-rss

Create a RSS feed from your Twitter home timeline

## Usage

```
Usage: twitter-to-rss [options]

  Create a RSS feed from your Twitter home timeline

  Options:

    --help  output usage information
```

## Config (config.yaml)

```yaml
twitter_rss:
  consumer_key: 'your_consumer_key'
  consumer_secret: 'your_consumer_secret'
  access_token_key: 'your_access_token_key'
  access_token_secret: 'your_access_token_secret'
  feedCount: 30 # max 200
  feedTitle: 'Twitter Home Timeline'
  feedFilePath: './twitter-home-timeline-feed.xml'
```

## How do I get my token?

Go to https://apps.twitter.com/, create an app and get its tokens

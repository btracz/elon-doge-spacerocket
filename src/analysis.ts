import { Tweet } from "./types/twitter-types";
import { formatTweet } from "./utils";

export const TWEET_TOPICS = {
  DOGE: "Dogecoin",
  CRYPTOS: "Cryptos",
  TESLA: "Tesla",
  STARLINK: "Starlink",
  SPACE_X: "SpaceX",
  OTHER: "other",
}

const TWITTER_USERNAME_PATTERN = /@(?=.*\w)[\w]{1,15}/g;

export const TOPIC_PATTERNS = {
  [TWEET_TOPICS.DOGE]:
    /.*(doge(\s|\.|$)|dogecoin|Ðoge|ðoge|Ðogecoin|ðogecoin).*/gi,
  [TWEET_TOPICS.CRYPTOS]:
    /.*(crypto\s|cryptos|bitcoin|ethereum|btc|eth\s|cryptocurrency|cryptocurrencies).*/gi,
  [TWEET_TOPICS.TESLA]: /.*(tesla|tsla).*/gi,
  [TWEET_TOPICS.STARLINK]: /.*(starlink|star\slink).*/gi,
  [TWEET_TOPICS.SPACE_X]: /.*(spacex|space\sx).*/gi,
};

export const analyzeTweetTopic = (tweet: Tweet) => {
  const fullConversation = formatTweet(tweet).join(" ");
  const fullConversationWithoutUsernames = fullConversation.replace(
    TWITTER_USERNAME_PATTERN,
    ""
  );

  Object.keys(TWEET_TOPICS).some((key: string) => {
    const topicRegex = (TOPIC_PATTERNS as any)[(TWEET_TOPICS as any)[key]];
    if (!topicRegex) {
      return false;
    }

    if (topicRegex.test(tweet.text)) {
      tweet.topic = {
        value: (TWEET_TOPICS as any)[key],
        direct: true,
      };
      return true;
    } else if (topicRegex.test(fullConversationWithoutUsernames)) {
      tweet.topic = {
        value: (TWEET_TOPICS as any)[key],
        direct: false,
      };
      return true;
    }

    return false;
  });
};

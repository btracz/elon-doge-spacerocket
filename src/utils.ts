import { Tweet } from "./types/twitter-types";

export const formatTweet = (tweet: Tweet) => {
  const linesToPrint = [];

  let currentTweet = tweet;

  if (currentTweet.parent) {
    // CONVERSATION MODE
    while (currentTweet?.text) {
      linesToPrint.push(
        `- <b>${currentTweet.users[0].name} {@${currentTweet.users[0].username}} :</b> ${currentTweet?.text}`
      );
      currentTweet = currentTweet.parent;
    }
  }

  if (currentTweet.quotation) {
    linesToPrint.push(
      `<i>${currentTweet.quotation.users[0].name} {@${currentTweet.quotation.users[0].username}} : "${currentTweet.quotation.text}"</i>`
    );
  }

  // TODO : MIXED

  return linesToPrint.reverse();
};

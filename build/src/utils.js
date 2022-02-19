"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTweet = void 0;
const formatTweet = (tweet) => {
    const linesToPrint = [];
    let currentTweet = tweet;
    while (currentTweet === null || currentTweet === void 0 ? void 0 : currentTweet.text) {
        linesToPrint.push(`- ${currentTweet === null || currentTweet === void 0 ? void 0 : currentTweet.text}`);
        currentTweet = currentTweet.parent;
    }
    return linesToPrint.reverse();
};
exports.formatTweet = formatTweet;

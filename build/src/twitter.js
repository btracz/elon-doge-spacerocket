"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTweetDetails = void 0;
const conf_json_1 = __importDefault(require("../conf.json"));
const twitter_v2_1 = __importDefault(require("twitter-v2"));
const Twitter_1 = require("./types/Twitter");
const twitterClient = new twitter_v2_1.default({
    bearer_token: (_a = conf_json_1.default === null || conf_json_1.default === void 0 ? void 0 : conf_json_1.default.twitter) === null || _a === void 0 ? void 0 : _a.token,
});
const getTweetDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield twitterClient.get("tweets", {
        ids: id,
        expansions: ["referenced_tweets.id", "author_id"],
    });
    const tweet = data[0];
    if (tweet.referenced_tweets && tweet.referenced_tweets.length > 0) {
        const parent = tweet.referenced_tweets.find((t) => t.type === Twitter_1.TWEET_TYPES.REPLY);
        if (parent && parent.id) {
            tweet.parent = yield (0, exports.getTweetDetails)(parent.id);
        }
    }
    return tweet;
});
exports.getTweetDetails = getTweetDetails;

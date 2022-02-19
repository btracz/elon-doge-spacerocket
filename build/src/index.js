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
Object.defineProperty(exports, "__esModule", { value: true });
const needle_1 = __importDefault(require("needle"));
const dayjs_1 = __importDefault(require("dayjs"));
const conf_json_1 = __importDefault(require("../conf.json"));
// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const { token } = conf_json_1.default.twitter;
// Open a realtime stream of Tweets, filtered according to rules
// https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/quick-start
const mailer_1 = require("./mailer");
const twitter_1 = require("./twitter");
const utils_1 = require("./utils");
const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL = "https://api.twitter.com/2/tweets/search/stream";
// this sets up two rules - the value is the search terms to match on, and the tag is an identifier that
// will be applied to the Tweets return to show which rule they matched
// with a standard project with Basic Access, you can add up to 25 concurrent rules to your stream, and
// each rule can be up to 512 characters long
// Edit rules as desired below
const rules = [
    {
        value: "from:elonmusk",
    },
];
function getAllRules() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, needle_1.default)("get", rulesURL, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        if (response.statusCode !== 200) {
            console.log("Error:", response.statusMessage, response.statusCode);
            throw new Error(response.body);
        }
        return response.body;
    });
}
function deleteAllRules(rules) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(rules.data)) {
            return null;
        }
        const ids = rules.data.map((rule) => rule.id);
        const data = {
            delete: {
                ids: ids,
            },
        };
        const response = yield (0, needle_1.default)("post", rulesURL, data, {
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${token}`,
            },
        });
        if (response.statusCode !== 200) {
            throw new Error(response.body);
        }
        return response.body;
    });
}
function setRules() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            add: rules,
        };
        const response = yield (0, needle_1.default)("post", rulesURL, data, {
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${token}`,
            },
        });
        if (response.statusCode !== 201) {
            throw new Error(response.body);
        }
        return response.body;
    });
}
function streamConnect(retryAttempt) {
    const stream = needle_1.default.get(streamURL, {
        headers: {
            "User-Agent": "v2FilterStreamJS",
            Authorization: `Bearer ${token}`,
        },
        timeout: 20000,
    });
    stream
        .on("data", (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            const json = JSON.parse(data);
            console.log((0, dayjs_1.default)().format, "Elon's tweet payload", json);
            // find tweet details and parent tweet
            const tweet = yield (0, twitter_1.getTweetDetails)(json.data.id);
            console.log((0, dayjs_1.default)().format, "Elon's tweet details", tweet);
            if (tweet) {
                (0, mailer_1.sendTweetAlert)((0, utils_1.formatTweet)(tweet));
            }
            // A successful connection resets retry count.
            retryAttempt = 0;
        }
        catch (e) {
            if (data.detail ===
                "This stream is currently at the maximum allowed connection limit.") {
                console.log(data.detail);
                process.exit(1);
            }
            else {
                // Keep alive signal received. Do nothing.
            }
        }
    }))
        .on("err", (error) => {
        if (error.code !== "ECONNRESET") {
            console.log(error.code);
            process.exit(1);
        }
        else {
            // This reconnection logic will attempt to reconnect when a disconnection is detected.
            // To avoid rate limits, this logic implements exponential backoff, so the wait time
            // will increase if the client cannot reconnect to the stream.
            setTimeout(() => {
                console.warn("A connection error occurred. Reconnecting...");
                streamConnect(++retryAttempt);
            }, 2 ** retryAttempt);
        }
    });
    return stream;
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    let currentRules;
    try {
        // Gets the complete list of rules currently applied to the stream
        currentRules = yield getAllRules();
        // Delete all rules. Comment the line below if you want to keep your existing rules.
        yield deleteAllRules(currentRules);
        // Add rules to the stream. Comment the line below if you don't want to add new rules.
        yield setRules();
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
    // Listen to the stream.
    // const stream = streamConnect(0);
    console.log("Listening to Elon");
    const tweet = yield (0, twitter_1.getTweetDetails)("1494909260303515649");
    console.log("old tweet", (0, utils_1.formatTweet)(tweet));
    // process.on("beforeExit", () => stream.removeAllListeners());
}))();

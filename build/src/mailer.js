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
exports.sendTweetAlert = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dayjs_1 = __importDefault(require("dayjs"));
const localizedFormat_1 = __importDefault(require("dayjs/plugin/localizedFormat"));
dayjs_1.default.extend(localizedFormat_1.default);
const conf_json_1 = require("../conf.json");
const transporter = nodemailer_1.default.createTransport(conf_json_1.smtpTransport);
const sendTweetAlert = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: conf_json_1.mailSender,
        to: conf_json_1.mailRecipient,
        subject: `[Elon Musk] tweeted`,
        html: `
      <p>${payload === null || payload === void 0 ? void 0 : payload.join("<br />")}</p>`,
    });
});
exports.sendTweetAlert = sendTweetAlert;

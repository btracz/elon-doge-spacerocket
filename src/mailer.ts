import nodemailer from "nodemailer";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

import { smtpTransport, mailSender, mailRecipient } from "../conf.json";
import { Tweet } from "./types/twitter-types";
import { formatTweet } from "./utils";

const transporter = nodemailer.createTransport(smtpTransport);

export const sendTweetAlert = async (tweet: Tweet) => {
  const payload = formatTweet(tweet);
  if (!payload || payload.length === 0) {
    return;
  }

  let subject = `[Elon Musk] ${
    payload.length > 1 ? `replied to a tweet` : `tweeted`
  }`;

  if (tweet.topic) {
    if (tweet.topic.direct) {
      subject += " directly";
    }
    subject += ` about ${tweet.topic.value}`;
  }

  const mail = {
    from: mailSender,
    to: mailRecipient,
    subject,
    html: `
      <p>${payload
        .map((line) => line.replace(/\n/g, "<br />"))
        .join("<br />")}</p>`,
  };
  console.log("mail to send", mail);

  if (process.env.NODE_ENV === "production") {
    await transporter.sendMail(mail);
    console.log("mail sent");
  }
};

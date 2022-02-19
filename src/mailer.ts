import nodemailer from "nodemailer";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

import { smtpTransport, mailSender, mailRecipient } from "../conf.json";

const transporter = nodemailer.createTransport(smtpTransport);

export const sendTweetAlert = async (payload: string[]) => {
  if (
    !payload ||
    payload.length === 0 ||
    process.env.NODE_ENV !== "production"
  ) {
    return;
  }
  await transporter.sendMail({
    from: mailSender,
    to: mailRecipient,
    subject: `[Elon Musk] ${
      payload.length > 1 ? `replied to a tweet` : `tweeted`
    }`,
    html: `
      <p>${payload
        .map((line) => line.replace(/\n/g, "<br />"))
        .join("<br />")}</p>`,
  });
};

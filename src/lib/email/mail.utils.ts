import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.NODE_ENV !== "development",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
} as SMTPTransport.Options);

type sendEmailTo = {
  sender: string;
  receipients: string[];
  subject: string;
  text: string;
  html: string;
};

export const sendEmail = async (details: sendEmailTo) => {
  const { sender, receipients, subject, text, html } = details;
  return await transport.sendMail({
    from: sender,
    to: receipients,
    html: html,
    text: text,
    subject: subject,
  });
};

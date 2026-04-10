import nodemailer from "nodemailer";
import { env } from "./env.js";

export function createMailer() {
  const hasSmtpConfig =
    env.smtp.host && env.smtp.port && env.smtp.user && env.smtp.pass;

  if (!hasSmtpConfig) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}
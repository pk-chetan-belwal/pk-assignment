import { MailerInterface } from '../interfaces/mail';

export const mailConfig = () => ({
  mailConfig: {
    host: process.env.MAIL_HOST,
    auth: process.env.MAIL_AUTH === 'true',
    driver: process.env.MAIL_DRIVER,
    port: process.env.MAIL_PORT,
    mailUserAuth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  } as MailerInterface,
});

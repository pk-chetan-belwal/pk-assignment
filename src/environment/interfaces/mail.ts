export interface MailerInterface {
  host: string;
  port: string;
  driver: string;
  auth: boolean;
  mailUserAuth?: {
    user: string;
    pass: string;
  };
}

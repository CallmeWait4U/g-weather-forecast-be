import { Address } from 'nodemailer/lib/mailer';

export type MailerDTO = {
  from?: Address;
  recipients: Address[];
  subject: string;
  html?: string;
  text?: string;
  placeholderReplacements?: Record<string, string>;
  attachments?: Express.Multer.File[];
};

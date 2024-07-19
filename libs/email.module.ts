import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerDTO } from 'interfaces/mailer.dto';
import { join } from 'path';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail(mailer: MailerDTO) {
    const { from, recipients, subject } = mailer;
    const result = await this.mailerService.sendMail({
      from: from ?? {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('DEFAULT_MAIL_FROM'),
      },
      to: recipients,
      subject,
      html: mailer.html,
      attachments: mailer.attachments
        ? mailer.attachments.map((attachment) => ({
            filename: attachment.originalname,
            content: attachment.buffer,
            contentType: attachment.mimetype,
            contentTransferEncoding: 'base64',
          }))
        : [],
    });
    return result;
  }
}

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          service: 'gmail',
          secure: true,
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASSWORD'),
          },
        },
        template: {
          dir: join(__dirname, '../mail/templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailerInterface } from '../../environment/interfaces/mail';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMailerOptions(): Promise<MailerOptions> | MailerOptions {
    const mailerConfig = this.configService.get<MailerInterface>('mailConfig');
    const mailerOptions: MailerOptions = {};

    switch (mailerConfig.driver) {
      case 'smtp': {
        mailerOptions.transport = {
          host: mailerConfig.host,
          port: Number(mailerConfig.port) || 1025,
          secure: mailerConfig.port === '465', // true for 465, false for other ports
          auth: mailerConfig.auth ? mailerConfig.mailUserAuth : undefined,
        };
        mailerOptions.template = {
          dir: join(process.cwd(), 'views', 'emails'),
          adapter: new HandlebarsAdapter(),
        };
        return mailerOptions;
      }
      default: {
        throw new Error(`Unsupported mail driver: ${mailerConfig.driver}`);
      }
    }
  }
}

import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailerConfigService } from './services/mailer-config.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
  ],
})
export class EmailModule {}

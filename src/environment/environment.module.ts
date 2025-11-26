import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { sequelizeConfig } from './configs/sequelize-config';
import { appConfig } from './configs/app-config';
import { mailConfig } from './configs/mail-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [sequelizeConfig, appConfig, mailConfig],
    }),
  ],
})
export class EnvironmentModule {}

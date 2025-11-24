import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { modelCollection } from './model-collection';
import { RepositoryModule } from './repository/repository.module';
import { DatabaseConfigService } from './database-config.service';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: DatabaseConfigService,
      name: 'default',
      inject: [ConfigModule],
    }),

    SequelizeModule.forFeature(modelCollection),
    RepositoryModule,
  ],
  providers: [DatabaseConfigService],
  exports: [SequelizeModule, RepositoryModule],
})
export class DatabaseModule {}

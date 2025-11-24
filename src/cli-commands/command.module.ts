import { Module } from '@nestjs/common';
import { MakeMigrationCommand } from './commands/migration/make-migration.command';
import { RunMigrationCommand } from './commands/migration/run-migration.command';
import { RollbackMigrationCommand } from './commands/migration/rollback-migration.command';
import { SeederCommand } from './commands/seeding/seeder.command';
import { RoleSeed } from './commands/seeding/seeds/role.seed';
import { AdminSeed } from './commands/seeding/seeds/admin.seed';

@Module({
  providers: [
    MakeMigrationCommand,
    RunMigrationCommand,
    RollbackMigrationCommand,
    SeederCommand,
    RoleSeed,
    AdminSeed,
  ],
})
export class CommandModule {}

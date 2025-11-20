/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unsafe-return */
import { InjectConnection } from '@nestjs/sequelize';
import { Command, CommandRunner } from 'nest-commander';
import { join } from 'path';
import { Sequelize } from 'sequelize';
import { MigrationMeta, SequelizeStorage, Umzug } from 'umzug';

@Command({
  name: 'run:migration',
  description: 'Runs the migrations',
})
export class RunMigrationCommand extends CommandRunner {
  constructor(@InjectConnection() private readonly connection: Sequelize) {
    super();
  }
  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const migrationPath = join(
      process.cwd(),
      'src',
      'database',
      'migrations',
      '*.ts',
    ).replace(/\\/g, '/');
    const umzug = new Umzug({
      migrations: {
        glob: migrationPath,
        resolve: ({ path, name, context }) => {
          path = path.replace(/\\/g, '/');
          return {
            name,
            up: async () =>
              import(path).then((migration) =>
                migration.up(context, this.connection.Sequelize),
              ),
            down: async () =>
              import(path).then((migration) =>
                migration.down(context, this.connection.Sequelize),
              ),
          };
        },
      },
      context: this.connection.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize: this.connection }),
      logger: console,
    });
    try {
      const migrationsMeta: MigrationMeta[] = await umzug.up();
      if (migrationsMeta.length === 0) {
        console.error('No migrations to Run');
      }
    } catch (error) {
      console.log(error);
    }
  }
}

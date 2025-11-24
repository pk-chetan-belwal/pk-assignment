import { Command, CommandRunner, Option } from 'nest-commander';
import { SeedInterfaceConstruct } from './seed';
import { ModuleRef } from '@nestjs/core';
import { RoleSeed } from './seeds/role.seed';
import { AdminSeed } from './seeds/admin.seed';

const availableSeeds: Record<string, SeedInterfaceConstruct[]> = {
  all: [RoleSeed, AdminSeed],
  roles: [RoleSeed],
  admins: [AdminSeed],
};

@Command({
  name: 'seeder:seed',
  description: 'Seeds Data into Database',
})
export class SeederCommand extends CommandRunner {
  constructor(private readonly moduleRef: ModuleRef) {
    super();
  }
  static seederMap: SeedInterfaceConstruct[] = [];

  public async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    this.addSeedToSeedMap(options || {});
    for (const seeder of SeederCommand.seederMap) {
      const seederInstance =
        this.moduleRef.get<InstanceType<SeedInterfaceConstruct>>(seeder);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      await seederInstance.seed();
    }
    return;
  }

  @Option({
    required: false,
    name: 'all',
    description: 'Seeds everything',
    flags: '--all',
  })
  parseAll(): boolean {
    return true;
  }

  @Option({
    required: false,
    name: 'roles',
    description: 'Seeds roles',
    flags: '--roles',
  })
  parseRoles(): boolean {
    return true;
  }

  @Option({
    required: false,
    name: 'admins',
    description: 'Seeds admin users',
    flags: '--admins',
  })
  parseAdmins(): boolean {
    return true;
  }

  private addSeedToSeedMap(seedToBeSeeded: Record<string, boolean>) {
    for (const [key, value] of Object.entries(seedToBeSeeded)) {
      if (value && availableSeeds[key]) {
        SeederCommand.seederMap.push(...availableSeeds[key]);
      }
    }
  }
}

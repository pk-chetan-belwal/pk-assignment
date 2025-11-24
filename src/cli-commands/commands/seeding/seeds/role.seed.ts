import { Injectable } from '@nestjs/common';
import { RoleInfo } from '../../../../database/models/role/role.mode';
import { RoleRepository } from '../../../../database/repository/role.repository';
import { Seed } from '../seed';

@Injectable()
export class RoleSeed extends Seed {
  constructor(private readonly roleRepository: RoleRepository) {
    super();
  }

  async seed(): Promise<boolean> {
    console.log('Seeding Roles...');
    await Promise.all(
      Object.values(RoleInfo).map((role) => {
        return this.roleRepository.findOrCreate(role);
      }),
    );

    return true;
  }
}

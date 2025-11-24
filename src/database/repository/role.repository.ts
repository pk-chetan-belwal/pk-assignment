import { InjectModel } from '@nestjs/sequelize';
import { RoleModel } from '../models/role/role.mode';
import { Transaction } from 'sequelize';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(RoleModel) private readonly roleModel: typeof RoleModel,
  ) {}

  /**
   * Create Role
   * @param roleInfo
   * @param transaction
   * @returns
   */
  public createRole(
    roleInfo: Partial<RoleModel>,
    transaction?: Transaction,
  ): Promise<RoleModel> {
    return this.roleModel.create(roleInfo, {
      transaction,
    });
  }

  /**
   * Find or Create Role
   * @param roleInfo
   * @param transaction
   * @returns
   */
  public findOrCreate(
    roleInfo: Partial<RoleModel>,
    transaction?: Transaction,
  ): Promise<[RoleModel, boolean]> {
    return this.roleModel.findOrCreate({
      where: { name: roleInfo.name },
      defaults: roleInfo,
      transaction,
    });
  }
}

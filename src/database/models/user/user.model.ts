import {
  BelongsToMany,
  Column,
  DefaultScope,
  Table,
  Unique,
} from 'sequelize-typescript';
import { BaseModel } from '../base.model';
import { RoleModel } from '../role/role.mode';
import { UserRoleModel } from '../user-roles/user-role.model';

@DefaultScope(() => ({
  include: [
    {
      model: RoleModel,
      as: 'roles',
    },
  ],
}))
@Table({ tableName: 'users' })
export class UserModel extends BaseModel<UserModel> {
  @Column
  public name: string;

  @Unique
  @Column
  public email: string;

  @Column
  public password: string;

  @BelongsToMany(() => RoleModel, () => UserRoleModel)
  public roles: RoleModel[];
}

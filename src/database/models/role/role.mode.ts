import { BelongsToMany, Column, Table } from 'sequelize-typescript';
import { BaseModel } from '../base.model';
import { UserRoleModel } from '../user-roles/user-role.model';
import { UserModel } from '../user/user.model';

export enum Role {
  ADMIN = 'Admin',
  USER = 'User',
}

export const RoleInfo = {
  [Role.ADMIN]: {
    id: 1,
    name: Role.ADMIN,
  },
  [Role.USER]: {
    id: 2,
    name: Role.USER,
  },
};

@Table({ tableName: 'roles' })
export class RoleModel extends BaseModel<RoleModel> {
  @Column
  public name: Role;

  @BelongsToMany(() => UserModel, () => UserRoleModel)
  public users: UserModel[];
}

import { Column, ForeignKey, Table } from 'sequelize-typescript';
import { UserModel } from '../user/user.model';
import { BaseModel } from '../base.model';
import { RoleModel } from '../role/role.mode';

@Table({ tableName: 'user_roles' })
export class UserRoleModel extends BaseModel<UserRoleModel> {
  @ForeignKey(() => UserModel)
  @Column
  public user_id: number;

  @ForeignKey(() => RoleModel)
  @Column
  public role_id: number;
}

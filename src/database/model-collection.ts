import { BaseModel } from './models/base.model';
import { DateModel } from './models/date.model';
import { RoleModel } from './models/role/role.mode';
import { UserRoleModel } from './models/user-roles/user-role.model';
import { UserModel } from './models/user/user.model';

export const modelCollection = [
  BaseModel,
  DateModel,
  UserModel,
  RoleModel,
  UserRoleModel,
];

import { SetMetadata } from '@nestjs/common';
import { Role } from '../../database/models/role/role.mode';

export const RoleDecorator = (role: Role[]) => SetMetadata('role', role);

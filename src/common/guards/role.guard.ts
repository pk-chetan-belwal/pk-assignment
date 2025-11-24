import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role, RoleModel } from '../../database/models/role/role.mode';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as
      | { id: number; name: string; roles: RoleModel[] }
      | undefined;

    if (!user || !user.roles || user.roles.length === 0) {
      throw new UnauthorizedException('User does not have the required roles');
    }

    const hasRequiredRole = user.roles.some((role) =>
      requiredRoles.includes(role.name),
    );

    if (!hasRequiredRole) {
      throw new UnauthorizedException(
        `User does not have any of the required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}

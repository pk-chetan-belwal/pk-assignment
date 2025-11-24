import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleResource } from './role.resource';

export class UserResource {
  @ApiProperty()
  @Expose()
  public email: string;

  @ApiProperty()
  @Expose()
  public name: string;

  @ApiProperty({
    type: RoleResource,
    isArray: true,
  })
  @Type(() => RoleResource)
  @Expose()
  public roles: RoleResource;
}

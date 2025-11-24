import { ApiProperty } from '@nestjs/swagger';
import { PaginateBaseResource } from './paginate-base.resource';
import { Expose, Type } from 'class-transformer';
import { UserResource } from './user.resource';

export class UserPaginateResource extends PaginateBaseResource {
  @ApiProperty({ isArray: true })
  @Expose()
  @Type(() => UserResource)
  public data: UserResource[];
}

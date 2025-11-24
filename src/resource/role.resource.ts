import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RoleResource {
  @ApiProperty()
  @Expose()
  public name: string;
}

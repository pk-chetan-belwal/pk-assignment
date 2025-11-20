import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResource {
  @ApiProperty()
  @Expose()
  public email: string;

  @ApiProperty()
  @Expose()
  public name: string;
}

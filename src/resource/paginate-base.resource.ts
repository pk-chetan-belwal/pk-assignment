import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export abstract class PaginateBaseResource {
  abstract data;

  @ApiProperty()
  @Expose()
  lastPage: number;

  @ApiProperty()
  @Expose()
  totalRecords: number;

  @ApiProperty()
  @Expose()
  currentPage: number;

  @ApiProperty()
  @Expose()
  hasMorePages: boolean;
}

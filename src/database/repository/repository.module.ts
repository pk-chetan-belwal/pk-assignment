import { Module } from '@nestjs/common';
import { UsersRepository } from './user.repository';

@Module({
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class RepositoryModule {}

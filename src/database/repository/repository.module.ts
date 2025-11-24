import { Module } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { RoleRepository } from './role.repository';

@Module({
  providers: [UsersRepository, RoleRepository],
  exports: [UsersRepository, RoleRepository],
})
export class RepositoryModule {}

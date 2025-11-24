import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersRepository } from '../database/repository/user.repository';
import { UserController } from './controllers/user.controller';
@Module({
  controllers: [UserController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}

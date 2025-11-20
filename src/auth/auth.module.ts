import { Global, Module } from '@nestjs/common';
import { MatchValidator } from './validator/match.validator';
import { UsersModule } from '../users/users.module';
import { UserAlreadyExistsValidator } from './validator/user-already-exists.validator';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { BcryptService } from './bcrypt/bcrypt.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from '../database/repository/auth.repository';

@Global()
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [
    BcryptService,
    MatchValidator,
    UserAlreadyExistsValidator,
    AuthService,
    JwtStrategy,
    AuthRepository,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

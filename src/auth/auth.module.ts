import { Global, Module } from '@nestjs/common';
import { MatchValidator } from './validator/match.validator';
import { UsersModule } from '../users/users.module';
import { UserAlreadyExistsValidator } from './validator/user-already-exists.validator';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { BcryptService } from './bcrypt/bcrypt.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SendMailJob } from './jobs/send-mail.job';

@Global()
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET',
      signOptions: { expiresIn: '3600000s' },
    }),
  ],
  providers: [
    BcryptService,
    MatchValidator,
    UserAlreadyExistsValidator,
    AuthService,
    JwtStrategy,
    SendMailJob,
  ],
  controllers: [AuthController],
  exports: [AuthService, BcryptService, JwtModule],
})
export class AuthModule {}

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../../database/repository/user.repository';
import { UserModel } from '../../database/models/user/user.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SignedUrlStrategy extends PassportStrategy(
  Strategy,
  'signed-url',
) {
  constructor(private readonly userRepo: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET',
    });
  }

  async validate(payload: { user_id: number }): Promise<UserModel> {
    return this.userRepo.findById(payload.user_id);
  }
}

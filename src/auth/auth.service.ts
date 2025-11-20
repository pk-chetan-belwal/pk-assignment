import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dtos/signup.dto';
import { BcryptService } from './bcrypt/bcrypt.service';
import { AuthRepository } from '../database/repository/auth.repository';
import { UserModel } from '../database/models/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: BcryptService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async handleSignupRequest(signupDto: SignupDto): Promise<UserModel> {
    const { password, ...userData } = signupDto;

    const hashedPassword = await this.hashService.createHash(password);

    const user = this.authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  public async handleLoginRequest(
    email: string,
    password: string,
  ): Promise<string> {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new UnprocessableEntityException({
        constraints: { email: 'Invalid email or password' },
      });
    }

    const isPasswordValid = await this.hashService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnprocessableEntityException({
        constraints: { password: 'Invalid email or password' },
      });
    }
    const payload = {
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }
}

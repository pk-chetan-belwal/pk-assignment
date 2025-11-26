import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dtos/signup.dto';
import { BcryptService } from './bcrypt/bcrypt.service';
import { UserModel } from '../database/models/user/user.model';
import { UsersRepository } from '../database/repository/user.repository';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SENDMAILJOB } from './jobs/send-mail.job';
import { Transaction } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: BcryptService,
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    @InjectQueue('emailQueue') private readonly emailQueue: Queue,
  ) {}

  public async handleSignupRequest(signupDto: SignupDto): Promise<UserModel> {
    const { password, ...userData } = signupDto;

    const hashedPassword = await this.hashService.createHash(password);

    const user: UserModel = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    await user.$add('roles', [2]); // Assigning User Role

    await this.emailQueue.add(SENDMAILJOB, {
      user_id: user.id,
    });

    return user;
  }

  public async handleLoginRequest(
    email: string,
    password: string,
  ): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
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
      id: user.id,
    };

    return this.jwtService.sign(payload);
  }

  public verifyUser(
    user: UserModel,
    transaction?: Transaction,
  ): Promise<UserModel> {
    return user
      .set({
        verified: true,
      })
      .save({ transaction });
  }
}

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

  /**
   * Handles signup request and creates a new user
   * @param signupDto - Signup request data
   * @returns - Newly created user
   */
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

  /**
   * Handles a login request.
   * Verifies the user by checking the email and password.
   * If the user is verified, returns a JWT token containing the user ID.
   * If the user is not verified, throws an UnprocessableEntityException with the appropriate error message.
   * @throws UnprocessableEntityException if the user is not verified
   */
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

    if (!user?.verified) {
      throw new UnprocessableEntityException(
        'Please verify your email before logging in',
      );
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

  /**
   * Verify a user by marking the verified field as true
   * @param user The user to be verified
   * @param transaction The transaction to use for the query
   * @returns The updated user
   */
  public verifyUser(
    user: UserModel,
    transaction?: Transaction,
  ): Promise<UserModel> {
    return this.userRepository.updateUser(
      user,
      { verified: true },
      transaction,
    );
  }
}

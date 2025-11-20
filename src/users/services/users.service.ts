import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../database/repository/user.repository';
import { UserModel } from '../../database/models/user/user.model';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  /**
   * Finds a user by email.
   * @param email
   * @returns
   */
  public async findByEmail(email: string): Promise<UserModel> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    return user;
  }

  /**
   * Finds a user by id.
   * @param id
   * @returns
   */

  public async findById(id: number): Promise<UserModel> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    return user;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../models/user/user.model';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
  ) {}

  /**
   * Finds User by email.
   * @param email
   * @returns
   */
  public async findByEmail(email: string): Promise<UserModel | null> {
    return this.userModel.findOne({ where: { email } });
  }

  /**
   * Finds User by id.
   * @param id
   * @returns
   */
  public async findById(id: number): Promise<UserModel | null> {
    return this.userModel.findByPk(id);
  }
}

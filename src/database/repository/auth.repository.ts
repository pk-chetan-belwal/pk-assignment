import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../models/user/user.model';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
  ) {}

  public async createUser(userData: Partial<UserModel>): Promise<UserModel> {
    return this.userModel.create(userData);
  }

  public async findUserByEmail(email: string): Promise<UserModel | null> {
    return this.userModel.findOne({ where: { email } });
  }
}

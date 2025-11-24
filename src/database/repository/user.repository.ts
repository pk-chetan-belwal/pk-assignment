import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../models/user/user.model';
import { Transaction } from 'sequelize';
import Paginator, { PaginateResponse } from '../../common/utils/paginator';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
  ) {}

  /**
   * Create User
   * @param userData
   * @returns
   */
  public async createUser(
    userInfo: Partial<UserModel>,
    transaction?: Transaction,
  ): Promise<UserModel> {
    return this.userModel.create(userInfo, { transaction });
  }

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

  /**
   * Find or Create User
   * @param userInfo
   * @returns
   */
  public findOrCreateUser(
    userInfo: Partial<UserModel>,
    transaction?: Transaction,
  ): Promise<[UserModel, boolean]> {
    return this.userModel.findOrCreate({
      where: { email: userInfo.email },
      defaults: userInfo,
      transaction,
    });
  }

  /**
   * Return all users in the app
   * @returns
   */
  public async getAllUsers(transaction?: Transaction): Promise<UserModel[]> {
    return this.userModel.scope(['defaultScope']).findAll({ transaction });
  }

  /**
   * Find all users with pagination
   * @param page
   * @param offset
   * @param transaction
   * @returns
   */
  public findAllPaginate(
    page: number = 1,
    offset: number = 2,
    transaction?: Transaction,
  ): Promise<PaginateResponse<UserModel>> {
    const paginate = new Paginator(this.userModel);
    return paginate.paginate({ transaction }, page, offset);
  }
}

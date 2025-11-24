import { Injectable } from '@nestjs/common';
import { Seed } from '../seed';
import { UsersRepository } from '../../../../database/repository/user.repository';
import { BcryptService } from '../../../../auth/bcrypt/bcrypt.service';
import { UserModel } from '../../../../database/models/user/user.model';

@Injectable()
export class AdminSeed extends Seed {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly hashService: BcryptService,
  ) {
    super();
  }
  async seed(): Promise<boolean> {
    console.log('Seeding Admins...');
    const user: [UserModel, boolean] = await this.userRepo.findOrCreateUser({
      email: 'super@paktolus.com',
      password: await this.hashService.createHash('Rubi@123'),
      name: 'Super Admin',
    });
    await user[0].$add('roles', [1]); // Assigning Admin Role

    return true;
  }
}

import { UserModel } from '../../../database/models/user/user.model';

export const userStub = (): UserModel =>
  ({
    id: 1,
    name: 'dummy-user',
    email: 'dummy@gmail.com',
    created_at: new Date('2025-11-24T10:12:33.075Z'),
    updated_at: new Date('2025-11-24T10:12:33.075Z'),
  }) as UserModel;

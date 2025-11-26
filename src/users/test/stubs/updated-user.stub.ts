import { UserModel } from '../../../database/models/user/user.model';

export const updatedUserStub = (): UserModel =>
  ({
    id: 1,
    name: 'abc',
    email: 'dummy@gmail.com',
    created_at: new Date('2025-11-24T10:12:33.075Z'),
    updated_at: new Date('2025-11-24T10:12:33.075Z'),
  }) as UserModel;

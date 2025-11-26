import { PaginateResponse } from '../../../common/utils/paginator';
import { UserModel } from '../../../database/models/user/user.model';

export const createUserStub = (id: number, suffix: string = ''): UserModel =>
  ({
    id,
    name: `Test User ${suffix || id}`,
    email: `test${suffix || id}@example.com`,
    roles: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }) as UserModel;

export const userPaginationStub = (): PaginateResponse<UserModel> => ({
  currentPage: 1,
  hasMorePages: false,
  lastPage: 1,
  totalRecords: 1,
  data: [createUserStub(1)],
});

export const multipleUsersPaginationStub = (
  page: number = 1,
  limit: number = 10,
  totalUsers: number = 25,
): PaginateResponse<UserModel> => {
  const totalPages = Math.ceil(totalUsers / limit);
  const hasMorePages = page < totalPages;

  // Generate users for the current page
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalUsers);

  const users: UserModel[] = [];
  for (let i = startIndex; i < endIndex; i++) {
    users.push(createUserStub(i + 1, `Page${page}-${i + 1}`));
  }

  return {
    currentPage: page,
    hasMorePages,
    lastPage: totalPages,
    totalRecords: totalUsers,
    data: users,
  };
};

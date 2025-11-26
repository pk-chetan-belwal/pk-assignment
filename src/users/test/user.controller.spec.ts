import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UsersService } from '../services/users.service';
import { userStub } from './stubs/user.stub';
import { UserModel } from '../../database/models/user/user.model';
import {
  userPaginationStub,
  multipleUsersPaginationStub,
} from './stubs/user-pagination.stub';
import { UserUpdateDto } from '../dtos/user-update.dto';
import { updatedUserStub } from './stubs/updated-user.stub';

jest.mock('../services/users.service');

describe('UserController', () => {
  let userController: UserController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UsersService],
      imports: [],
    }).compile();
    userController = moduleRef.get<UserController>(UserController);
    usersService = moduleRef.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    describe('when getUser is called', () => {
      let user: UserModel;

      beforeEach(async () => {
        jest.spyOn(usersService, 'findById').mockResolvedValue(userStub());
        user = await userController.getUser(userStub());
      });

      test('it should call userService with correct id', () => {
        expect(usersService.findById).toHaveBeenCalledWith(userStub().id);
      });

      test('it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('getUsers', () => {
    describe('when getUsers is called with page 1 and limit 10', () => {
      let users;

      beforeEach(async () => {
        jest
          .spyOn(usersService, 'getAllUsersPaginate')
          .mockResolvedValue(userPaginationStub());
        users = await userController.getUsers(1, 10);
      });

      test('it should call userService with correct parameters', () => {
        expect(usersService.getAllUsersPaginate).toHaveBeenCalledWith(1, 10);
      });

      test('it should return paginated response', () => {
        expect(users).toEqual(userPaginationStub());
      });

      test('it should return correct pagination metadata', () => {
        expect(users.currentPage).toBe(1);
        expect(users.totalRecords).toBe(1);
        expect(users.lastPage).toBe(1);
        expect(users.hasMorePages).toBe(false);
      });

      test('it should return array of users in data property', () => {
        expect(Array.isArray(users.data)).toBe(true);
        expect(users.data.length).toBe(1);
      });
    });

    describe('when getUsers is called with multiple pages', () => {
      let users;

      beforeEach(async () => {
        jest
          .spyOn(usersService, 'getAllUsersPaginate')
          .mockResolvedValue(multipleUsersPaginationStub(1, 5));
        users = await userController.getUsers(1, 5);
      });

      test('it should indicate more pages are available', () => {
        expect(users.hasMorePages).toBe(true);
      });

      test('it should return correct page information', () => {
        expect(users.currentPage).toBe(1);
        expect(users.lastPage).toBeGreaterThan(1);
        expect(users.totalRecords).toBeGreaterThan(5);
      });

      test('it should return correct number of users per page', () => {
        expect(users.data.length).toBeLessThanOrEqual(5);
      });
    });

    describe('when getUsers is called for page 2', () => {
      let users;

      beforeEach(async () => {
        jest
          .spyOn(usersService, 'getAllUsersPaginate')
          .mockResolvedValue(multipleUsersPaginationStub(2, 5));
        users = await userController.getUsers(2, 5);
      });

      test('it should call service with page 2', () => {
        expect(usersService.getAllUsersPaginate).toHaveBeenCalledWith(2, 5);
      });

      test('it should return page 2 data', () => {
        expect(users.currentPage).toBe(2);
      });
    });

    describe('when getUsers is called for last page', () => {
      let users;

      beforeEach(async () => {
        const lastPageResponse = multipleUsersPaginationStub(5, 5);
        lastPageResponse.hasMorePages = false;

        jest
          .spyOn(usersService, 'getAllUsersPaginate')
          .mockResolvedValue(lastPageResponse);
        users = await userController.getUsers(3, 5);
      });

      test('it should indicate no more pages available', () => {
        expect(users.hasMorePages).toBe(false);
      });

      test('it should be on the last page', () => {
        expect(users.currentPage).toBe(users.lastPage);
      });
    });

    describe('when getUsers is called with different page sizes', () => {
      test('it should handle page size of 20', async () => {
        jest
          .spyOn(usersService, 'getAllUsersPaginate')
          .mockResolvedValue(multipleUsersPaginationStub(1, 20));

        const users = await userController.getUsers(1, 20);

        expect(usersService.getAllUsersPaginate).toHaveBeenCalledWith(1, 20);
        expect(users.data.length).toBeLessThanOrEqual(20);
      });

      test('it should handle page size of 50', async () => {
        jest
          .spyOn(usersService, 'getAllUsersPaginate')
          .mockResolvedValue(multipleUsersPaginationStub(1, 50));

        const users = await userController.getUsers(1, 50);

        expect(usersService.getAllUsersPaginate).toHaveBeenCalledWith(1, 50);
        expect(users.data.length).toBeLessThanOrEqual(50);
      });
    });

    describe('when getUsers returns empty results', () => {
      let users;

      beforeEach(async () => {
        jest.spyOn(usersService, 'getAllUsersPaginate').mockResolvedValue({
          currentPage: 1,
          hasMorePages: false,
          lastPage: 0,
          totalRecords: 0,
          data: [],
        });
        users = await userController.getUsers(1, 10);
      });

      test('it should return empty data array', () => {
        expect(users.data).toEqual([]);
        expect(users.data.length).toBe(0);
      });

      test('it should have totalRecords of 0', () => {
        expect(users.totalRecords).toBe(0);
      });

      test('it should have no more pages', () => {
        expect(users.hasMorePages).toBe(false);
      });
    });
  });

  describe('updateUser', () => {
    let user: UserModel;
    beforeEach(async () => {
      jest
        .spyOn(usersService, 'updateUser')
        .mockResolvedValue(updatedUserStub());
      user = await userController.updateUser(
        { name: 'abc' } as UserUpdateDto,
        userStub(),
      );
    });
    describe('when updateUser is called', () => {
      test('it should call the service', () => {
        expect(usersService.updateUser).toHaveBeenCalledWith(userStub(), {
          name: 'abc',
        });
      });

      test('it should return the updated user', () => {
        expect(user).toEqual(updatedUserStub());
      });
    });
  });
});

import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoleDecorator } from '../../common/decorator/role.decorator';
import { UsersService } from '../services/users.service';
import { Role } from '../../database/models/role/role.mode';
import { RoleGuard } from '../../common/guards/role.guard';
import { UserModel } from '../../database/models/user/user.model';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResource } from '../../resource/user.resource';
import { ResourceMap } from '../../common/decorator/resource-map.decorator';
import { ResourceConversionInterceptor } from '../../common/interceptor/resource.conversion.interceptor';
import { UserAuthGuard } from '../../auth/guards/user-auth/user-auth.guard';
import { AuthUser } from '../../auth/decorators/auth-user.decorator';
import { PaginateResponse } from '../../common/utils/paginator';
import { UserPaginateResource } from '../../resource/user-paginate.resource';
import { UserUpdateDto } from '../dtos/user-update.dto';

@ApiTags('Users')
@UseInterceptors(ResourceConversionInterceptor)
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @ApiResponse({
    type: UserPaginateResource,
  })
  @ResourceMap(UserPaginateResource)
  @UseGuards(RoleGuard)
  @RoleDecorator([Role.ADMIN])
  @Get('all')
  public getUsers(
    @Query('page')
    page: number = 1,
    @Query('limit') limit: number = 1,
  ): Promise<PaginateResponse<UserModel>> {
    return this.userService.getAllUsersPaginate(page, limit);
  }

  @ResourceMap(UserResource)
  @ApiResponse({
    type: UserResource,
  })
  @UseGuards(RoleGuard)
  @RoleDecorator([Role.ADMIN, Role.USER])
  @Get('me')
  public getUser(@AuthUser() user: UserModel): Promise<UserModel> {
    return this.userService.findById(user.id);
  }

  @ResourceMap(UserResource)
  @ApiResponse({
    type: UserResource,
  })
  @Patch('me')
  public updateUser(
    @Body() userUpdateDto: UserUpdateDto,
    @AuthUser() user: UserModel,
  ): Promise<UserModel> {
    return this.userService.updateUser(user, userUpdateDto);
  }
}

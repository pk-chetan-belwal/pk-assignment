import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Redirect,
  Render,
  UseInterceptors,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { UserModel } from '../database/models/user/user.model';
import { ResourceConversionInterceptor } from '../common/interceptor/resource.conversion.interceptor';
import { ResourceMap } from '../common/decorator/resource-map.decorator';
import { UserResource } from '../resource/user.resource';

@ApiTags('auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/signup')
  @Render('signup')
  @ApiExcludeEndpoint()
  public getSignupPage() {}

  @Post('signup')
  @UseInterceptors(ResourceConversionInterceptor)
  @ResourceMap(UserResource)
  @Redirect('login')
  public async signup(@Body() userInfo: SignupDto): Promise<UserModel> {
    return await this.authService.handleSignupRequest(userInfo);
  }

  @Get('/login')
  @Render('login')
  @ApiExcludeEndpoint()
  public getLoginPage() {}

  @Post('login')
  @Redirect('/dashboard')
  public async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ access_token: string }> {
    const token = await this.authService.handleLoginRequest(
      loginDto.email,
      loginDto.password,
    );
    return { access_token: token };
  }

  @Get('logout')
  @ApiExcludeEndpoint()
  @Render('logout')
  public getLogoutPage() {}

  @Post('logout')
  @Redirect('/auth/logout')
  @HttpCode(200)
  public logout() {
    return { message: 'Logged out successfully' };
  }
}

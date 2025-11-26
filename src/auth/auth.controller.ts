import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Redirect,
  Render,
  Res,
  UseGuards,
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
import { Response } from 'express';
import { AuthUser } from './decorators/auth-user.decorator';
import { SignedUrlValidGuard } from '../signed-url/guards/signed-url-valid.guard';

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
    return this.authService.handleSignupRequest(userInfo);
  }

  @Get('/login')
  @Render('login')
  @ApiExcludeEndpoint()
  public getLoginPage() {}

  @Post('login')
  public async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const token = await this.authService.handleLoginRequest(
      loginDto.email,
      loginDto.password,
    );

    return res.render('setToken', { access_token: token });
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

  @Get('verify-email')
  @UseGuards(SignedUrlValidGuard)
  @Redirect('login')
  public verifyEmail(@AuthUser() user: UserModel): Promise<UserModel> {
    return this.authService.verifyUser(user);
  }
}

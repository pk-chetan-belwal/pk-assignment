import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('dashboard')
export class DashboardController {
  @Get()
  @Render('dashboard')
  public getDashboardPage() {
    return {};
  }
}

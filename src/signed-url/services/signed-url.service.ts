import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppInterface } from '../../environment/interfaces/app';

@Injectable()
export class SignedUrlService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public generateSignedUrl(data: any, path: string): string {
    const appConfig = this.configService.get<AppInterface>('app');

    const token = this.jwtService.sign({ ...data }, { expiresIn: '1h' });

    return `${appConfig.base_url}/${path}?token=${token}`;
  }
}

import { Global, Module } from '@nestjs/common';
import { SignedUrlService } from './services/signed-url.service';
import { SignedUrlStrategy } from './strategy/signed-url.strategy';

@Global()
@Module({
  providers: [SignedUrlService, SignedUrlStrategy],
  exports: [SignedUrlService],
})
export class SignedUrlModule {}

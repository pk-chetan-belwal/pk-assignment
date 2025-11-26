import { AuthGuard } from '@nestjs/passport';

export class SignedUrlValidGuard extends AuthGuard('signed-url') {}

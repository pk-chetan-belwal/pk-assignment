import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UsersService } from '../../users/services/users.service';
import { SignedUrlService } from '../../signed-url/services/signed-url.service';

export const SENDMAILJOB = 'sendmailjob';
@Processor('emailQueue')
export class SendMailJob {
  constructor(
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
    private readonly signedUrlService: SignedUrlService,
  ) {}

  @Process(SENDMAILJOB)
  public async sendMailJob(job: Job<{ user_id: number }>) {
    const { user_id } = job.data;

    const user = await this.usersService.findById(user_id);

    await this.mailerService.sendMail({
      template: 'verification-mail',
      to: user.email,
      context: {
        userName: user.name,
        verificationLink: this.signedUrlService.generateSignedUrl(
          {
            user_id: user.id,
          },
          'auth/verify-email',
        ),
      },
    });
  }
}

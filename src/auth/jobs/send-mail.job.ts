import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UsersService } from '../../users/services/users.service';

export const SENDMAILJOB = 'sendmailjob';
@Processor('emailQueue')
export class SendMailJob {
  constructor(
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  @Process(SENDMAILJOB)
  public async sendMailJob(job: Job<{ user_id: number }>) {
    const { user_id } = job.data;

    const user = await this.usersService.findById(user_id);

    await this.mailerService.sendMail({
      template: 'verification-mail',
      to: user.email,
      context: {
        name: user.name,
        // url: ''
      },
    });
  }
}

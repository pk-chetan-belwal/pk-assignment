import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),

    BullModule.registerQueue({
      name: 'emailQueue',
    }),

    BullBoardModule.forRoot({
      adapter: ExpressAdapter,
      route: 'queues/management',
    }),

    BullBoardModule.forFeature({
      adapter: BullAdapter,
      name: 'emailQueue',
    }),
  ],
})
export class QueuesModule {}

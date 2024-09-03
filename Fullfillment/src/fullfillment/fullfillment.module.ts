import { Module } from '@nestjs/common';
import { FullfillmentService } from './fullfillment.service';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  providers: [FullfillmentService,RabbitmqService],
  exports: [FullfillmentService]
})
export class FullfillmentModule {}

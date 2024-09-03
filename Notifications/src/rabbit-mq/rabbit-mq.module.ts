// rabbitmq.module.ts
import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { ConfigProviderService } from 'src/utils/config';
import { EmailServices} from 'src/utils/sendMailFunction';
import { EmailService } from 'src/email/email.service';

@Module({
  providers: [RabbitMQService, ConfigProviderService,EmailServices,EmailService],
  exports: [RabbitMQService, ConfigProviderService, EmailServices, EmailService],
})
export class RabbitMQModule { }

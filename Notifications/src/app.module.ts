import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from './rabbit-mq/rabbit-mq.module';
import { EmailController } from './email/email.controller';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true
  }), RabbitMQModule, EmailModule],
  controllers: [AppController, EmailController],
  providers: [AppService],
  
})
export class AppModule {}



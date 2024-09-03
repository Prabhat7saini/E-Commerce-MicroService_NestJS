import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { FullfillmentController } from './fullfillment/fullfillment.controller';
import { FullfillmentModule } from './fullfillment/fullfillment.module';


@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env', // Loads environment variables from .env file
    isGlobal: true, // Makes the configuration globally available
  }), RabbitmqModule, FullfillmentModule,],
  controllers: [AppController, FullfillmentController],
  providers: [AppService,],
})
export class AppModule {}

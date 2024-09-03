import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MongoDB_URL'),
      }),
      inject: [ConfigService],
    }),
    OrderModule,
    RabbitMqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

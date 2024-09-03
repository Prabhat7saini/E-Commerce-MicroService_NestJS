import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentController } from './payment/payment.controller';
import { PaymentModule } from './payment/payment.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MongoDB_URL'),
      }),
      inject: [ConfigService],
    }), PaymentModule],
  controllers: [AppController, PaymentController],
  providers: [AppService, JwtStrategy],
})
export class AppModule { }

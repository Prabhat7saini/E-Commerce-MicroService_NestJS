import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentSchema, Paymnet } from './entities/payment.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Paymnet.name, schema: PaymentSchema }])],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}

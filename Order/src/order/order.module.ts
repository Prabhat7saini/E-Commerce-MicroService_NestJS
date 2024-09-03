import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.schema';
import { ProtectedController } from './protected.controller';
import { JwtStrategy } from './jwt.strategy';
import { RabbitMqModule } from 'src/rabbit-mq/rabbit-mq.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),RabbitMqModule],
  controllers: [OrderController,ProtectedController],
  providers: [OrderService,JwtStrategy]
})
export class OrderModule {}

import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, CreateOrderResponce } from './dto/create-Order.dto';
import { promises } from 'dns';
import { UpdateOrderDto, UpdateOrderResponse } from './dto/update-Order.dto';

@Controller('/order')
export class OrderController {
    constructor(private orderService: OrderService){}
    @Put('/update-order')
    async updateOrder(@Req() req:Request,@Body() updateOrderDto: UpdateOrderDto):Promise<UpdateOrderResponse> {

        return await this.orderService.updateOrder(updateOrderDto);
    }
}

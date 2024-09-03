import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Ensure correct import
import { OrderService } from './order.service';
import { CreateOrderDto, CreateOrderResponce } from './dto/create-Order.dto';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';

@Controller("/protected")
@UseGuards(AuthGuard("jwt")) // Specify the strategy name if needed
export class ProtectedController {
    constructor(private readonly orderService: OrderService) { }

    @Post(`/createOrder`)
    async createOrder(@Body() createOrderDto: CreateOrderDto,@Req() req:Request): Promise<CreateOrderResponce> {
        return this.orderService.createOrder(req,createOrderDto)
    }





}

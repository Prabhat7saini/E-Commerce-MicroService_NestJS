import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, CreatePaymentResponce } from './dto/create-Payment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('payment')
@UseGuards(AuthGuard("jwt")) 
export class PaymentController {
    constructor(private readonly paymentService: PaymentService){}

    @Post()
    async proccedPyament(@Req() req:Request,@Body() createPaymentDto:CreatePaymentDto):Promise<CreatePaymentResponce>{
        console.log(`createPaymentDto ${createPaymentDto}`)
        return this.paymentService.proccedPyamentRequetes(req,createPaymentDto);
    }
}

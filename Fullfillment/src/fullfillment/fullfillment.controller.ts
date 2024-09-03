import { Body, Controller, Param, Post } from '@nestjs/common';
import { FullfillmentService } from './fullfillment.service';
import { ObjectEncodingOptions } from 'fs';
import { BodyDto, ParamDto } from './dto/fullfillorder.dto';

@Controller('fullfillment')
export class FullfillmentController {
    constructor(private readonly fullfillmentService:FullfillmentService){}

    @Post(`/:orderId/:paymentId`)
    async fulfillOrder(@Param() param:ParamDto ,@Body() Body:BodyDto): Promise<void> {
        console.log(param,Body)
        await this.fullfillmentService.fulfillOrder(param.orderId,param.paymentId,Body);
    }
}

import { Controller, Post, Body } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';

@Controller('rabbitmq')
export class RabbitMQController {
    constructor(private readonly rabbitMQService: RabbitMQService) { }

    @Post('send-to-queue-1')
    async sendMessageToQueue1(@Body() data: any) {
        const pattern = 'pattern_1'; // Replace with your message pattern
        // return this.rabbitMQService.publish(pattern, data);
    }


}

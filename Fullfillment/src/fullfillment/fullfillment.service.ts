import { Body, Injectable } from '@nestjs/common';
import axios from 'axios';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { api } from 'src/config/api';
import { BodyDto } from './dto/fullfillorder.dto';

@Injectable()
export class FullfillmentService {
    constructor(private readonly rabbitmq: RabbitmqService) { }

    async fulfillOrder(orderId: string,  paymentId: string,@Body() bodyDto:BodyDto) {
        if (!orderId || !bodyDto.status) {
            throw new Error('Invalid input: orderId and status are required.');
        }

        try {
            // Perform the API request to update the order status
            await axios.put(api.Update_API, { orderId,status: bodyDto.status });
        } catch (error) {
            console.error('Error updating order status via API:', error);
            throw new Error('Failed to update order status. Please try again later.');
        }

        try {
            // Connect to RabbitMQ
            await this.rabbitmq.connect();

            // Prepare the message to publish
            const RMQ = {
                orderId,
                status:bodyDto.status,
                paymentId,
                email:bodyDto.email,
                totalAmount: bodyDto.totalAmount,
                type: 'orderFulfilled'
            };
            // cons

            // Publish the message to the RabbitMQ queue
            await this.rabbitmq.publish('mail_queue', RMQ);
        } catch (error) {
            console.error('Error interacting with RabbitMQ:', error);
            throw new Error('Failed to send message to RabbitMQ. Please try again later.');
        }
    }
}

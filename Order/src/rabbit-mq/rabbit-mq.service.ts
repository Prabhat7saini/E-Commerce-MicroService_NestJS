// rabbitmq.service.ts
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
    private connection: amqp.Connection;
    private channel: amqp.Channel;

    async connect() {
        this.connection = await amqp.connect('amqp://localhost');
        this.channel = await this.connection.createChannel();
    }

    async publish(queue: string, message: any) {
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

    async consume(queue: string, callback: (msg: amqp.ConsumeMessage | null) => void) {
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, callback, { noAck: true });
    }
}

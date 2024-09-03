// rabbitmq.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService {
    private connection: amqp.Connection;
    private channel: amqp.Channel | null = null; // Initialize as null
    private readonly logger = new Logger(RabbitmqService.name);

    async connect() {
        this.connection = await amqp.connect('amqp://localhost');
        // Ensure channel is created only if it doesn't exist
        if (!this.channel) {
            this.channel = await this.connection.createChannel();
            this.logger.log('Channel created');
        }
    }

    private async ensureChannel() {
        if (!this.channel) {
            await this.connect(); // Ensure connection is established
            this.channel = await this.connection.createChannel(); // Create channel if not existing
            this.logger.log('Channel created');
        }
    }

    async publish(queue: string, message: any) {
        await this.ensureChannel(); // Ensure channel is available
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

    async consume(queue: string, callback: (msg: amqp.ConsumeMessage | null) => void) {
        await this.ensureChannel(); // Ensure channel is available
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, callback, { noAck: true });
    }
}

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { ConfigProviderService } from '../utils/config';  // Adjust the import path
import { EmailServices } from 'src/utils/sendMailFunction';
import { EmailController } from 'src/email/email.controller';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RabbitMQService.name);
    private connection: Connection;
    private channel: Channel;

    constructor(private configProvider: ConfigProviderService,private emailService:EmailServices,private sendEmail:EmailService) { }

    async onModuleInit() {
        this.logConfigValues();  // Log config values when the module is initialized
        await this.connect();
        await this.startConsuming();
    }

    async onModuleDestroy() {
        await this.closeConnection();
    }

    private logConfigValues() {
        this.logger.log(`RabbitMQ URI: ${this.configProvider.uri}`);
        this.logger.log(`Queue Name: ${this.configProvider.queue}`);
    }

    private async connect() {
        try {
            // Connect to RabbitMQ
            this.connection = await connect(this.configProvider.uri);

            // Only create a new channel if one does not already exist
            if (!this.channel) {
                this.channel = await this.connection.createChannel();
                await this.channel.assertQueue(this.configProvider.queue);
                this.logger.log('Connected to RabbitMQ and queue is asserted.');
            }
        } catch (error) {
            this.logger.error('Failed to connect to RabbitMQ', error);
            throw error;
        }
    }

    private async startConsuming() {
        try {
            if (this.channel) {
                this.channel.consume(this.configProvider.queue, async(msg) => {
                    if (msg !== null) {
                        const content = msg.content.toString();
                        this.logger.log(`Received message: ${content}`);
                        const jsonformate = JSON.parse(content);
                      const htmlbody=  this.emailService.createEmailBody(jsonformate)
                        // this.sendEmail.sendMail(jsonformate.email,htmlbody)
                        console.log(`Received message type: ${jsonformate.type}`);
                        this.handleMessage(content);
                        this.channel.ack(msg); // Acknowledge that the message has been processed
                    }
                });
                this.logger.log('Started consuming messages.');
            } else {
                this.logger.error('Cannot start consuming messages because the channel does not exist.');
            }
        } catch (error) {
            this.logger.error('Failed to start consuming messages', error);
            throw error;
        }
    }

    private async handleMessage(message: string) {
        // Implement your message handling logic here
        this.logger.log(`Processing message: ${message}`);
        // For example, you might want to save it to a database or trigger some business logic
    }

    private async closeConnection() {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
    }
}

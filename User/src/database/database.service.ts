import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private readonly logger = new Logger(DatabaseService.name);

    constructor(@InjectConnection() private readonly connection: Connection) { }

    async onModuleInit() {
        this.logger.log('Initializing DatabaseService...');

        this.connection.on('connected', () => {
            this.logger.log('Successfully connected to MongoDB');
        });

        this.connection.on('error', (error) => {
            this.logger.error('Error connecting to MongoDB', error.stack);
        });

        this.connection.on('disconnected', () => {
            this.logger.log('Disconnected from MongoDB');
        });

        // Check initial connection status
        try {
            await this.connection.db.admin().ping();
            this.logger.log('Initial connection check successful');
        } catch (error) {
            this.logger.error('Initial connection check failed', error.stack);
        }
    }
}

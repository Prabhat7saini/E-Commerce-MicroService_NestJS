import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';
console.log(process.env.MongoDB_URL)
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async () => {
                const mongoDbUrl = process.env.MongoDB_URL;
                Logger.log(`MongoDB_URL: ${mongoDbUrl}`);

                if (!mongoDbUrl) {
                    Logger.error('MongoDB_URL is not defined!');
                }

                return {
                    uri: mongoDbUrl,
                    serverSelectionTimeoutMS: 30000, // Optional: configure if needed
                };
            },
        }),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule { }

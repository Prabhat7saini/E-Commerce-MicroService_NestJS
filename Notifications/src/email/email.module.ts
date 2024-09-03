import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigProviderService } from 'src/utils/config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  exports: [EmailService],
  providers: [EmailService, ConfigProviderService]
  
})
export class EmailModule {}

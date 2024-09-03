import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(private readonly emailService:EmailService){}
    @Get()
    async sendEmail(): Promise<void> {
        await this.emailService.sendMail('Prabhatsaini070@gmail.com', 'Test Email', 'This is a test email');
    }
}

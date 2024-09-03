import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigProviderService } from '../utils/config';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;

    constructor(private configProvider: ConfigProviderService) {
        try {
            // Log the nodemailer object to ensure it's imported correctly
            this.logger.log(`Nodemailer object: ${JSON.stringify(nodemailer)}`);

            if (!nodemailer.createTransport) {
                throw new Error('Nodemailer does not have createTransport method.');
            }

            // Log environment variables
            this.logger.log(`Mail user: ${this.configProvider.Mail_user}`);
            // Do not log sensitive information like passwords in production
            // this.logger.log(`Mail password: ${this.configProvider.Mail_password}`);

            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: this.configProvider.Mail_user,
                    pass: this.configProvider.Mail_password,
                },
            });

            this.logger.log('Transporter created successfully');
        } catch (error) {
            this.logger.error('Error creating transporter:', error.message);
        }
    }

    async sendMail(to: string, subject: string, html: string): Promise<void> {
        this.logger.log(`Sending mail to: ${to}`);
        const mailOptions: nodemailer.SendMailOptions = {
            from: this.configProvider.Mail_user,
            to,
            subject,
            html, // Always use HTML
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log('Mail sent successfully');
        } catch (error) {
            this.logger.error('Error sending mail:', error.message);
        }
    }
}

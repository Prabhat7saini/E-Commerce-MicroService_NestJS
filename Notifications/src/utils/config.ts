import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigProviderService {
    constructor(private configService: ConfigService) { }

    get PORT(): number {

        return Number(this.configService.get<string>('PORT'));
    }

    get Mail_user(): string {
        console.log("check", this.configService.get('Mail_user'));
        return this.configService.get<string>('Mail_user');
    }

    get Mail_host(): string {
        return this.configService.get<string>('Mail_host');
    }

    get Mail_password(): string {
        return this.configService.get<string>('Mail_password');
    }

    get smtp_port(): number {
        return Number(this.configService.get<string>('smtp_port'));
    }

    get uri(): string {
        return 'amqp://localhost';
    }

    get queue(): string {
        return 'mail_queue';
    }
}

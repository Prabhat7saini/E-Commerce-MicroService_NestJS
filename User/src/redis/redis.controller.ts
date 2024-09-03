import { Controller, Get, Param } from '@nestjs/common';
import { SomeService } from './redis.service';

@Controller('redis')
export class CacheController {
    constructor(private readonly someService: SomeService) { }

    @Get(':key')
    async get(@Param('key') key: string): Promise<string> {
        return this.someService.getValue(key);
    }

    @Get(':key/:value')
    async set(@Param('key') key: string, @Param('value') value: string): Promise<void> {
        await this.someService.setValue(key, value);
    }
}

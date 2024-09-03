import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Ensure correct import
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('protected')
@UseGuards(AuthGuard("jwt")) // Specify the strategy name if needed
export class ProtectedController {
    constructor(private readonly userService: UserService) { }

    @Post('/signUp')


    async createUser(
        @Body() createUserDto: CreateUserDto,

        @Req() req: Request
    ): Promise<{ success: boolean; message: string }> {
        // console.log("here")
        return this.userService.createUser(req, createUserDto);
    }
}

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

import { SendOtp, SendOtpResponse } from './dto/sendOtp.dto';
import { LoginResponse, LoginUser } from './dto/login-user.dto';



@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }
    @Post('/sendToken')
    sendToken(@Body() sendOtp: SendOtp): Promise<SendOtpResponse> {
   
        console.log(typeof sendOtp.email, "payload")
    
        return this.userService.sendToken(sendOtp)
    }
    @Post(`/login`)
    login(@Body() loginUser: LoginUser): Promise<LoginResponse> {
       return this.userService.Login(loginUser)

    }
}




import { ConflictException, Inject, Injectable, Logger, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interface/user.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/user.interface';
import { SendOtp, SendOtpResponse } from './dto/sendOtp.dto';
import { LoginResponse, LoginUser } from './dto/login-user.dto';
import { Redis } from 'ioredis';
import * as amqp from 'amqplib';

import { RabbitMQService } from 'src/rabbit-mq/rabbit-mq.service';
export interface CustomRequest extends Request {
    user?: JwtPayload
};
@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    private readonly saltRounds = 10;

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    async createUser(@Req() req: CustomRequest, createUserDto: CreateUserDto): Promise<{ success: boolean, message: string }> {
        try {
            const existingUser = await this.userModel.findOne({ email: req.user.email }).exec();
            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }

            const salt = await bcrypt.genSalt(this.saltRounds);
            const hashPassword = await bcrypt.hash(createUserDto.password, salt);

          const user=  await this.userModel.create({
                email: req.user.email,
                name: createUserDto.name,
                password: hashPassword
            });
            user.password=undefined;
            await this.rabbitMQService.connect();
            const RMq = {
                user,
                type: 'userCreate'
            }
            await this.rabbitMQService.publish("mail_queue", RMq);
            //  await this.rabbitMQService.consume('user_queue', this.handleMessage);
            return {
                success: true,
                message: "User created successfully"
            };
        } catch (error) {
            this.logger.error(`Error creating user: ${error.message}`, error.stack);
            throw new ConflictException(error.message);
        }
    }

    async sendToken(sendOtp: SendOtp): Promise<SendOtpResponse> {
        try {
            const existingUser = await this.userModel.findOne({ email: sendOtp.email }).exec();
            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }

            const payload = { email: sendOtp.email };
            const token = await this.generateToken(payload);

            return {
                success: true,
                status: 200,
                message: `Token created successfully`,
                token
            };
        } catch (error) {
            this.logger.error(`Error sending token: ${error.message}`, error.stack);
            throw new ConflictException(error.message);
        }
    }

    async generateToken(jwtPayload: JwtPayload): Promise<string> {
        try {
            return this.jwtService.sign(jwtPayload);
        } catch (error) {
            this.logger.error(`Error generating token: ${error.message}`, error.stack);
            throw new ConflictException('Error generating token');
        }
    }

    async Login(loginUser: LoginUser): Promise<LoginResponse> {
        try {
            
            const user = await this.userModel.findOne({ email: loginUser.email }).exec();
            if (!user) {
                throw new NotFoundException('User does not exist');
            }

            const isPasswordValid = await bcrypt.compare(loginUser.password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid password');
            }

            const payload: JwtPayload = {
                email: loginUser.email,
                userId: user._id as string,
            };
            const token = await this.generateToken(payload);

            user.password = undefined;
            // await this.redisClient.set(`user:${user._id}`, JSON.stringify(user), 'EX', 3600)
           

            return {
                token,
                success: true,
                user,
                message: 'Login successful'
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
                this.logger.warn(`Login error: ${error.message}`, error.stack);
            } else {
                this.logger.error(`Unexpected error during login: ${error.message}`, error.stack);
            }
            return {
                success: false,
                message: error.message || 'An error occurred during login'
            };
        }
    }
    private handleMessage(msg: amqp.ConsumeMessage | null) {
        if (msg) {
            console.log(msg,"message")
            const content = JSON.parse(msg.content.toString());
            console.log('Received message:', content);
            // Handle the message
        }
    }
}

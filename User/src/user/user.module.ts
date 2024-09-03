// src/user/user.module.ts

import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {UserSchema}  from "./entities/user.schema";
import { UserService } from './user.service';
import {  UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/utils/jwt.strategy';
import { ProtectedController } from './protected.controller';
import { RabbitMQModule } from 'src/rabbit-mq/rabbit-mq.module';

@Module({
  imports: [JwtModule.register({
    
    secret: "secret", 
    signOptions: { expiresIn: '60m' }, 
  }), MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), RabbitMQModule],
  providers: [UserService,JwtStrategy],
  controllers: [UserController,ProtectedController],
  exports: [UserService],
})
export class UserModule {}


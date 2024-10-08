// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request: Request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) return false;


        try {
            
            const payload = this.jwtService.verify(token);
            request.user = payload;
            return true;
        } catch (error){
            console.error('Token verification error:', error.message);
            return false;
        }
    }
}

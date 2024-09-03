import { Document } from 'mongoose';

export interface User extends Document {
    email: string;
    name: string;
    password:string
    // Add other fields as needed
}


export interface JwtPayload {
    userId?: string;
    email: string;
}
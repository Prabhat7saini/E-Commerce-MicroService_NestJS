import { IsEmail, IsNotEmpty } from "class-validator";

export class SendOtp {
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
    userId?:string;
}

export class SendOtpResponse{
    success: boolean;
    status: number;
    message: string;
    token:string
}
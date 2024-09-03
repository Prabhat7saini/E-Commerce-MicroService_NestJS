import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import {  IsPasswordComplex } from 'src/utils/is-password-complex.decorator';
import {User} from "../interface/user.interface"
export class LoginUser{
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email:string
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @IsPasswordComplex({ message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long' })
    password:string
}

export class LoginResponse{
    token?:string;
    user?:User;
    success:boolean;
    message:string
}
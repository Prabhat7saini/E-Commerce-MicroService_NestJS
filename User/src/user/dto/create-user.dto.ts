// src/user/dto/create-user.dto.ts

import {  IsNotEmpty, IsString } from 'class-validator';
import { IsAlphabetic, IsPasswordComplex } from 'src/utils/is-password-complex.decorator';

export class CreateUserDto {
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsAlphabetic({ message: 'Name must contain only letters and spaces' })
    name: string;

  

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @IsPasswordComplex({ message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long' })
    password: string;
}

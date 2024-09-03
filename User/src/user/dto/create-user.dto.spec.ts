// src/user/dto/create-user.dto.spec.ts

import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
    it('should fail validation if name contains numbers', async () => {
        const dto = new CreateUserDto();
        dto.name = 'Prabhat234'; // Invalid name

        dto.password = 'Password123!';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('name');
        expect(errors[0].constraints?.isAlphabetic).toBe('name must contain only letters and spaces and cannot include numbers');
    });

    it('should pass validation if name contains only letters and spaces', async () => {
        const dto = new CreateUserDto();
        dto.name = 'Prabhat'; // Valid name
        // dto.email = 'test@example.com';
        dto.password = 'Password123!';

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });
});

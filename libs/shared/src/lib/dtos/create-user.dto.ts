import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createUserSchema = z
	.object({
		email: z.email(),
		password: z.string().min(6),
	})
	.meta({
		description: 'Create User DTO',
		example: {
			email: 'me@somecompany.com',
			password: 'password123',
		},
	});

export class CreateUserDto extends createZodDto(createUserSchema) {}

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateUserSchema = z
	.object({
		email: z.email(),
	})
	.meta({
		description: 'Update User DTO',
		example: {
			email: 'me@somecompany.com',
		},
	});

export class UpdateUserDto extends createZodDto(updateUserSchema) {}

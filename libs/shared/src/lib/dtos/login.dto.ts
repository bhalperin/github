import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const loginSchema = z
	.object({
		email: z.email(),
		password: z.string().min(6),
	})
	.meta({
		description: 'Login DTO',
		example: {
			email: 'me@somecompany.com',
			password: 'password123',
		},
	});

// export type LoginDto = z.infer<typeof loginSchema>;
export class LoginDto extends createZodDto(loginSchema) {}

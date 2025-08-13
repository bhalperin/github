import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
	@IsString()
	@ApiProperty({
		type: String,
		example: 'me@somecompany.com',
	})
	email = '';

	@IsString()
	@ApiProperty({
		type: String,
		example: 'password123',
	})
	password = '';
}

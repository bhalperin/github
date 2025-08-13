import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
	@IsEmail()
	@IsOptional()
	@ApiProperty({
		type: String,
		example: 'me@somecompany.com',
	})
	email?: string;
}

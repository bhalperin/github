import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email = '';

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	password = '';
}

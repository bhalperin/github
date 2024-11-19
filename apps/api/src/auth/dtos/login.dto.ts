import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
	@ApiProperty()
	email = '';

	@ApiProperty()
	password = '';
}

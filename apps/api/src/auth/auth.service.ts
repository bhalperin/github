import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom, map } from 'rxjs';
import { User, UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

	async validateUser(username: string, password: string) {
		return await firstValueFrom<Partial<User>>(this.usersService.findOne(username).pipe(
			map((user) => {
				if (user?.password === password) {
					const { password, ...result } = user;

					return result;
				}

				return null;
			}),
		));
	}

	async login(user: User) {
		const payload = { username: user.username, sub: user.userId };

		return {
		  access_token: await this.jwtService.sign(payload),
		};
	}
}

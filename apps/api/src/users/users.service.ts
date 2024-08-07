import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

export type User = {
	userId: number;
	username: string;
	password: string;
};

@Injectable()
export class UsersService {
	#users = [
		{
			userId: 1,
			username: 'john',
			password: 'changeme',
		},
		{
			userId: 2,
			username: 'maria',
			password: 'guess',
		},
	];

	findOne(username: string): Observable<User | undefined> {
		return of(this.#users.find((user) => user.username === username));
	}
}

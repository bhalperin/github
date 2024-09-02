import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

export type User = {
	userId: number;
	email: string;
	password: string | null;
	refreshToken?: string;
};

@Injectable()
export class UsersService {
	#users = [
		{
			userId: 1,
			email: 'john@example.com',
			password: 'changeme',
		},
		{
			userId: 2,
			email: 'maria@example.com',
			password: 'guess',
		},
		{
			userId: 3,
			email: 'bhalperin@gmail.com',
			password: null,
		},
	] as User[];

	findOne(email: string): Observable<User | undefined> {
		return of(this.#users.find((user) => user.email === email));
	}
}

import { GhFullUser, GhUser } from '@gh/shared';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';

@Injectable()
export class AppService {
	readonly #baseGhApiUrl = 'https://api.github.com/';

	constructor(private httpService: HttpService) {}

	getData(): { message: string } {
		return { message: 'Hello API' };
	}

	getUsers(): Observable<AxiosResponse<GhUser[]>> {
		console.log('calling:', `${this.#baseGhApiUrl}users?since=0`);
		return this.httpService.get<AxiosResponse<GhUser[]>>(`${this.#baseGhApiUrl}users?since=0`).pipe(map(response => response.data));
	}

	getUser(login: string): Observable<AxiosResponse<GhFullUser>> {
		console.log('calling:', `${this.#baseGhApiUrl}users/${login}`);
		return this.httpService.get<AxiosResponse<GhFullUser>>(`${this.#baseGhApiUrl}users/${login}`).pipe(map(response => response.data));
	}
}

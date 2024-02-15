import { GhFullUser, GhUser, GhUserRepo } from '@gh/shared';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { EMPTY, Observable, expand, map, reduce } from 'rxjs';

@Injectable()
export class AppService {
	readonly #baseGhApiUrl = 'https://api.github.com/';

	constructor(private httpService: HttpService) {}

	getData(): { message: string } {
		return { message: 'Hello API' };
	}

	getUsers(): Observable<AxiosResponse<GhUser[]>> {
		const url = `${this.#baseGhApiUrl}users?since=0`;

		console.log('calling:', url);
		return this.httpService
			.get<AxiosResponse<GhUser[]>>(url)
			.pipe(map((response) => response.data));
	}

	getUser(login: string): Observable<AxiosResponse<GhFullUser>> {
		const url = `${this.#baseGhApiUrl}users/${login}`;

		console.log('calling:', url);
		return this.httpService
			.get<AxiosResponse<GhFullUser>>(url)
			.pipe(map((response) => response.data));
	}

	getUserRepos(
		login: string,
		page = 1,
		pageSize = 100,
	): Observable<AxiosResponse<GhUserRepo[]>> {
		const url = `${this.#baseGhApiUrl}users/${login}/repos?per_page=${pageSize}&page=${page}`;

		console.log('calling:', url);
		return this.httpService
			.get<AxiosResponse<GhUserRepo[]>>(url)
			.pipe(map((response) => response.data));
	}

	getAllUserRepos(login: string): Observable<GhUserRepo[]> {
		let page = 1;

		return this.getUserRepos(login, page++).pipe(
			map((response) => response.data),
			expand((response) =>
				response.length ? this.getUserRepos(login, page++) : EMPTY,
			),
			reduce((acc, curr) => acc.concat(...curr.data), [] as GhUserRepo[]),
		);
	}
}

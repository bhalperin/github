import { Test } from '@nestjs/testing';
import { GithubService } from './github.service';

describe('GithubService', () => {
	let service: GithubService;

	beforeAll(async () => {
		const app = await Test.createTestingModule({
			providers: [GithubService],
		}).compile();

		service = app.get<GithubService>(GithubService);
	});

	describe('getData', () => {
		it('should return "Hello API"', () => {
			expect(service.getData()).toEqual({ message: 'Hello API' });
		});
	});
});

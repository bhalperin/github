import { describe, expect, test } from 'vitest';

import { GhUserMock, GhUserRepoMock } from '@gh/shared/models';

import { vitestSetupTest } from 'core/utils/test/setup';

import { GhUserReposComponent } from './gh-user-repos.component';
import { GhUserReposPageObject } from './gh-user-repos.page-object';

describe('GhUserReposComponent', () => {
	const ghUserMock = new GhUserMock().withId(1).model;
	const ghUserReposMock = [
		new GhUserRepoMock().withId(1).withName('repo 1').withDescription('repo 1 description').model,
		new GhUserRepoMock().withId(2).withName('repo 2').withDescription('repo 2 description').model,
	];
	let po: GhUserReposPageObject;

	describe('When user repos are provided', () => {
		beforeEach(async () => {
			({ po } = await vitestSetupTest(GhUserReposPageObject, GhUserReposComponent, { user: ghUserMock, repos: ghUserReposMock }, []));
		});

		test('should display user repos count', () => {
			expect(po.userNameText).toBe(ghUserMock.login);
			expect(po.repoCount).toBeInTheDocument();
			expect(po.repoCountText).toBe(ghUserReposMock.length.toString());
		});
	});

	describe('When user repos are not provided', () => {
		beforeEach(async () => {
			({ po } = await vitestSetupTest(GhUserReposPageObject, GhUserReposComponent, { user: ghUserMock, repos: [] }, []));
		});

		test('should not display user repos count', () => {
			expect(po.userNameText).toBe(ghUserMock.login);
			expect(po.repoCount).not.toBeInTheDocument();
		});
	});
});

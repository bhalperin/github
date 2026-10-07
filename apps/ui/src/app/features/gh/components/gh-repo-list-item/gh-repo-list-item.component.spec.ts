import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, test, vi } from 'vitest';

import { GhRepoContributorMock, GhUserRepoMock } from '@gh/shared/models';

import { vitestSetupTest } from 'core/utils/test/setup';

import { GhService } from '../../services/gh.service';
import { GhRepoListItemComponent } from './gh-repo-list-item.component';
import { GhRepoListItemPageObject } from './gh-repo-list-item.page-object';

describe('GhRepoListItemComponent', () => {
	const ghParentRepoMock = new GhUserRepoMock().withId(2).withName('parent repo').model;
	const ghUserRepoMock = new GhUserRepoMock().withId(1).withName('repo 1').withDescription('repo 1 description').withParentRepo(ghParentRepoMock).model;
	const ghRepoContributorsMock = [
		new GhRepoContributorMock().withLogin('georgebush').withHtmlUrl('https://github.com/georgebush').model,
		new GhRepoContributorMock().withLogin('barackobama').withHtmlUrl('https://github.com/barackobama').model,
	];
	const ghRepoLanguagesMock = { TypeScript: 60, JavaScript: 40 };
	let component: GhRepoListItemComponent;
	let po: GhRepoListItemPageObject;
	let ghService: GhService;

	beforeEach(async () => {
		({ componentClassInstance: component, po } = await vitestSetupTest(GhRepoListItemPageObject, GhRepoListItemComponent, { user: () => undefined, repo: ghUserRepoMock }, [
			provideHttpClient(),
			provideHttpClientTesting(),
			GhService,
		]));
		ghService = TestBed.inject(GhService);
	});

	test('should display basic repo data without expanded details', async () => {
		const repo = component.repo();

		await expect.element(po.repoName).toBeInTheDocument();
		expect(po.repoNameText).toBe(repo.name);
		await expect.element(po.repoDescription).toBeInTheDocument();
		expect(po.repoDescriptionText).toBe(repo.description);
		expect(po.repoDetails).not.toBeVisible();
	});

	test('when clicking expand button, should call the methods that fetch the expanded data', async () => {
		const repo = component.repo();
		const repoSpy = vi.spyOn(ghService, 'getRepo').mockReturnValue(of(ghUserRepoMock));
		const repoContributorsSpy = vi.spyOn(ghService, 'getRepoContributors').mockReturnValue(of(ghRepoContributorsMock));
		const repoLanguagesSpy = vi.spyOn(ghService, 'getRepoLanguages').mockReturnValue(of(ghRepoLanguagesMock));

		po.showRepoDetails();

		expect(component.collapsed()).toBe(false);
		await vi.waitFor(() => {
			expect(repoSpy).toHaveBeenCalledWith(repo.owner.login, repo.name);
			expect(repoContributorsSpy).toHaveBeenCalledWith(repo.owner.login, repo.name);
			expect(repoLanguagesSpy).toHaveBeenCalledWith(repo.owner.login, repo.name);
		});
		expect(component.parentRepo()).toEqual(ghParentRepoMock);
		await expect.element(po.parentRepoFullName).toBeInTheDocument();
		expect(po.parentRepoFullNameText).toBe(ghParentRepoMock.full_name);
	});

	test('when clicking collapse button, should hide the expanded data', async () => {
		po.showRepoDetails();
		po.hideRepoDetails();

		expect(component.collapsed()).toBe(true);
		await expect.element(po.repoDetails).not.toBeVisible();
	});
});

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GhFullUserMock, GhUser, GhUserMock } from '@gh/shared/models';
import { of } from 'rxjs';
import { GhService } from 'services/gh.service';
import { createResourceMock } from 'utils/test/mock';
import { testSetup } from 'utils/test/setup';
import { describe, expect, test, vi } from 'vitest';
import { GhUsersComponent } from './gh-users.component';
import { GhUsersPageObject } from './gh-users.page-object';

describe('GhUsersComponent', () => {
	const usersMock = [new GhUserMock().withId(1).data, new GhUserMock().withId(2).data] as GhUser[];
	const userMock = new GhFullUserMock().withId(1);
	const resourceMock = createResourceMock<GhUser[]>([]);
	const ghServiceMock = {
		getUsers: vi.fn(),
		getUser: vi.fn(),
		getUsersResource: vi.fn().mockReturnValue(resourceMock),
		searchUsersResource: vi.fn().mockReturnValue(createResourceMock({ incomplete_results: false, total_count: 0, items: [] })),
	} as Partial<GhService>;
	const setup = () => {
		const { fixture, component } = testSetup(GhUsersComponent);

		return { fixture, component, po: new GhUsersPageObject(fixture) };
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GhUsersComponent],
			providers: [
				provideHttpClientTesting,
				{
					provide: GhService,
					useValue: ghServiceMock,
				},
			],
		}).compileComponents();

		vi.spyOn(ghServiceMock, 'getUser').mockReturnValue(of(userMock.data));

		// Mock resources are already set in ghServiceMock
	});

	test('should display no user cards when users are empty', () => {
		resourceMock.value.mockReturnValue([]);

		const { fixture, po } = setup();

		fixture.detectChanges();

		const userElements = po.getUserElements();

		expect(userElements.length).toBe(0);
	});

	test('should display the correct number of user cards when users are non-empty', () => {
		resourceMock.value.mockReturnValue(usersMock);

		const { fixture, po } = setup();

		fixture.detectChanges();

		const userElements = po.getUserElements();

		expect(userElements.length).toBe(2);
	});
});

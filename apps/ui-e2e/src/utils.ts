import { GhFullUserMock, GhUser, GhUserMock, GhUserRepoMock, GhRepoContributorMock } from '@gh/shared/models';
import { BrowserContext } from '@playwright/test';

export const EMAIL = 'user@example.com';
export const PASSWORD = 'topsecret';

export const addTokenCookies = async (context: BrowserContext) => {
	await context.addCookies([
		{
			name: 'access-token',
			value: 'FunnyString',
			domain: 'localhost',
			path: '/',
		},
		{
			name: 'refresh-token',
			value: 'AnotherFunnyString',
			domain: 'localhost',
			path: '/',
		},
	]);
};

export const ghUsersMock = [
	new GhUserMock()
		.withId(1)
		.withLogin('ghuser1')
		.withAvatarUrl('https://images.pexels.com/photos/416179/pexels-photo-416179.jpeg?auto=compress&cs=tinysrgb&w=600')
		.data,
	new GhUserMock()
		.withId(2)
		.withLogin('ghuser2')
		.withAvatarUrl('https://images.pexels.com/photos/349758/hummingbird-bird-birds-349758.jpeg?auto=compress&cs=tinysrgb&w=600')
		.data
] as GhUser[];

export const ghUserMock = new GhFullUserMock()
	.withLogin('ghuser1')
	.withName('John Smith')
	.withPublicRepos(3)
	.data;

export const ghUserReposMock = [
	new GhUserRepoMock()
		.withId(1)
		.withName('super web crawler')
		.withDescription('A lightning fast web crawler. Utilizing an innovative text compression algorithm.')
		.withParentRepo(new GhUserRepoMock().withFullName('inspiring repo').data)
		.data,
	new GhUserRepoMock()
		.withId(2)
		.withName('cool game')
		.withDescription('Retro Packman with some very cool modern day tricks.')
		.data,
	new GhUserRepoMock()
		.withId(3)
		.withName('simple learning machine')
		.withDescription('Demonstrating basic principles of machine lerning. Experiment ML with fun.')
		.data,
];

export const ghRepoContributorsMock = [
	new GhRepoContributorMock()
		.withId(1)
		.withLogin('john doe')
		.data,
	new GhRepoContributorMock()
		.withId(2)
		.withLogin('jane doe')
		.data,
	new GhRepoContributorMock()
		.withId(1)
		.withLogin('James Cook')
		.data,
];

export const ghRepoLanguagesMock = {
	TypeScript: 1200,
	Go: 300,
	Python: 400,
} as Record<string, number>;

import { GhFullUser, GhUser, GhUserMock, GhFullUserMock } from '@gh/shared';
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

export const ghbUsersMock = [
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
	.withPublicRepos(23)
	.data;

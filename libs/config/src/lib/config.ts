import { registerAs } from '@nestjs/config';

export const globalConfig = registerAs('config', () => ({
	jwt: {
		accessToken: {
			secret: process.env['JWT_ACCESS_TOKEN_SECRET'],
			expiry: process.env['JWT_ACCESS_TOKEN_EXPIRY'] ?? '1h',
		},
		refreshToken: {
			secret: process.env['JWT_REFRESH_TOKEN_SECRET'],
			expiry: process.env['JWT_REFRESH_TOKEN_EXPIRY'] ?? '2h',
		},
	},
	google: {
		clientId: process.env['GOOGLE_CLIENT_ID'],
		clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
		callbackUrl: process.env['GOOGLE_CALLBACK_URL'],
	},
	crypt: {
		saltRounds: process.env['SAL_ROUNDS'] ?? 10,
	},
	webApp: {
		url: process.env['WEBAPP_BASEURL'],
	},
	database: {
		url: process.env['DATABASE_URL'],
	},
}));

type JwtOptions = {
	secret?: string;
	expiry?: string | number;
};

type JwtConstants = {
	accessToken: JwtOptions;
	refreshToken: JwtOptions;
};

export const jwtConstants = {
	accessToken: {},
	refreshToken: {}
} as JwtConstants;

export const setJwtConstants = () => {
	jwtConstants.accessToken.secret = process.env['JWT_ACCESS_TOKEN_SECRET'];
	jwtConstants.accessToken.expiry = process.env['JWT_ACCESS_TOKEN_EXPIRY'];
	jwtConstants.refreshToken.secret = process.env['JWT_REFRESH_TOKEN_SECRET'];
	jwtConstants.refreshToken.expiry = process.env['JWT_REFRESH_TOKEN_EXPIRY'];
};

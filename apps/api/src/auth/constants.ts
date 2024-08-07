type JwtConstants = {
	secret?: string;
	expiry?: string | number;
}

export const jwtConstants: JwtConstants = {};

export const setJwtConstants = () => {
	jwtConstants.secret = process.env['JWT_SECRET'];
	jwtConstants.expiry = process.env['JWT_EXPIRY'];
};

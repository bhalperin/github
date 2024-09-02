export enum AuthKeys {
	AccessToken = 'access-token',
	RefreshToken = 'refresh-token',
}

export type AuthProfile = {
	accessToken: string;
	refreshToken: string;
};

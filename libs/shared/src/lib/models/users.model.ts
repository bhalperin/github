export type GhUser = {
	avatar_url: string;
	html_url: string;
	id: number;
	login: string;
};

export type GhFullUser = GhUser & {
	bio: string;
	blog: string;
	location: string;
	name: string;
	public_repos: number;
};

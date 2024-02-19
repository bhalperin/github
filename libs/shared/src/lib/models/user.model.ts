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

export type GhUserRepo = {
	description: string;
	full_name: string;
	id: number;
	html_url: string;
	name: string;
	owner: {
		login: string;
	};
	parent?: GhUserRepo;
	pushed_at: string;
	pushed_at_date: Date;
};

export type GhRepoContributor = {
	avatar_url: string;
	html_url: string;
	id: number;
	login: string;
};

export type GhRepoLanguages = Record<string, number>;

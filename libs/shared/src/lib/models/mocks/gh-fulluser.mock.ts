import { GhFullUser } from '../user.model';
import { ModelMock } from './model.mock';

export class GhFullUserMock extends ModelMock<GhFullUser> {
	constructor() {
		super();
		this.data = {
			avatar_url: '',
			html_url: 'http://www.google.com',
			id: 1,
			login: '',
			bio: '',
			blog: '',
			location: '',
			name: '',
			public_repos: 0
		};
	}

	withAvatarUrl(avatarUrl: string): GhFullUserMock {
		this.data.avatar_url = avatarUrl;

		return this;
	}

	withHtmlUrl(htmlUrl: string): GhFullUserMock {
		this.data.html_url = htmlUrl;

		return this;
	}

	withId(id: number): GhFullUserMock {
		this.data.id = id;

		return this;
	}

	withLogin(login: string): GhFullUserMock {
		this.data.login = login;

		return this;
	}

	withName(name: string): GhFullUserMock {
		this.data.name = name;

		return this;
	}

	withPublicRepos(publicRepos: number): GhFullUserMock {
		this.data.public_repos = publicRepos;

		return this;
	}
}

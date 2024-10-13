import { GhRepoContributor } from '../user.model';
import { ModelMock } from './model.mock';

export class GhRepoContributorMock extends ModelMock<GhRepoContributor> {
	constructor() {
		super();
		this.data = {
			id: 1,
			login: 'contributor',
			avatar_url: 'https://github.com',
			html_url: 'https://github.com',
		};
	}

	withId(id: number): GhRepoContributorMock {
		this.data.id = id;

		return this;
	}

	withLogin(login: string): GhRepoContributorMock {
		this.data.login = login;

		return this;
	}

	withAvatarUrl(avatarUrl: string): GhRepoContributorMock {
		this.data.avatar_url = avatarUrl;

		return this;
	}

	withHtmlUrl(htmlUrl: string): GhRepoContributorMock {
		this.data.html_url = htmlUrl;

		return this;
	}
}

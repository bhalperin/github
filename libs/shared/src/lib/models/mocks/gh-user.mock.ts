import { GhUser } from '../user.model';
import { ModelMock } from './model.mock';

export class GhUserMock extends ModelMock<GhUser> {
	constructor() {
		super();
		this.data = {
			avatar_url: '',
			html_url: 'http://www.google.com',
			id: 1,
			login: ''
		};
	}

	withAvatarUrl(avatarUrl: string): GhUserMock {
		this.data.avatar_url = avatarUrl;

		return this;
	}

	withHtmlUrl(htmlUrl: string): GhUserMock {
		this.data.html_url = htmlUrl;

		return this;
	}

	withId(id: number): GhUserMock {
		this.data.id = id;

		return this;
	}

	withLogin(login: string): GhUserMock {
		this.data.login = login;

		return this;
	}
}

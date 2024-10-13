import { GhUserRepo } from '../user.model';
import { ModelMock } from './model.mock';

export class GhUserRepoMock extends ModelMock<GhUserRepo> {
	constructor() {
		super();
		this.data = {
			id: 1,
			name: 'repo',
			full_name: 'github_user/repo',
			description: 'my first repo',
			html_url: 'https://github.com',
			owner: {
				login: 'github_user'
			},
			pushed_at: '2022-05-27T22:55:35Z'
		};
	}

	withId(id: number): GhUserRepoMock {
		this.data.id = id;

		return this;
	}

	withName(name: string): GhUserRepoMock {
		this.data.name = name;

		return this;
	}

	withFullName(fullName: string): GhUserRepoMock {
		this.data.full_name = fullName;

		return this;
	}

	withDescription(description: string): GhUserRepoMock {
		this.data.description = description;

		return this;
	}

	withHtmlUrl(htmlUrl: string): GhUserRepoMock {
		this.data.html_url = htmlUrl;

		return this;
	}

	withPushedAtDate(pushedAtDate: Date): GhUserRepoMock {
		this.data.pushed_at_date = pushedAtDate;

		return this;
	}

	withParentRepo(parentRepo: GhUserRepo): GhUserRepoMock {
		this.data.parent = parentRepo;

		return this;
	}
}

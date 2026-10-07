import { GhRepoLanguages } from '../user.model';
import { ModelMock } from './model.mock';

export class GhRepoLanguagesMock extends ModelMock<GhRepoLanguages> {
	constructor() {
		super();
		this.data = {};
	}

	withLanguage(language: string, count: number): GhRepoLanguagesMock {
		this.data[language] = count;

		return this;
	}
}

import { page } from 'vitest/browser';

export class GhUsersPageObject {
	ghUsersToolbarLocator = page.getByTestId('toolbar');
	previousPageButtonLocator = page.getByTestId('previous-page-button');
	nextPageButtonLocator = page.getByTestId('next-page-button');
	flipUsersToFrontButtonLocator = page.getByTestId('flip-users-to-front-button');
	ghUserLocators = page.getByTestId('gh-user');
	ghUsersErrorLocator = page.getByTestId('gh-users-error');
}

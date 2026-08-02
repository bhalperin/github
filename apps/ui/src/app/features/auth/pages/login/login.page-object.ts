import { page } from 'vitest/browser';

export class LoginPageObject {
	emailLocator = page.getByTestId('email');
	passwordLocator = page.getByTestId('password');
	submitButtonLocator = page.getByTestId('submit');
	spinnerLocator = page.getByTestId('spinner');
	loginGoogleButtonLocator = page.getByTestId('login-google');
	connectionErrorLocator = page.getByTestId('db-connection-error');
	serverErrorLocator = page.getByTestId('server-error');
	invalidCredentialsErrorLocator = page.getByTestId('invalid-credentials');
}

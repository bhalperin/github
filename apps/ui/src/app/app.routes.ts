import { Route } from '@angular/router';

export const appRoutes: Route[] = [
	{
		path: 'about',
		loadComponent: () =>
			import('./components/about/about.component').then(
				(c) => c.AboutComponent,
			),
	},
	{
		path: 'users',
		loadComponent: () =>
			import('./components/gh-users/gh-users.component').then(
				(c) => c.GhUsersComponent,
			),
	},
	{
		path: 'login',
		loadComponent: () =>
			import('./components/login/login.component').then(
				(c) => c.LoginComponent,
			),
	},
];

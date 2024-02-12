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
			import('./components/users/users.component').then(
				(c) => c.UsersComponent,
			),
	},
];

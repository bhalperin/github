import { Route } from '@angular/router';

import { authGuard } from 'core/guards/auth/auth.guard';

export const appRoutes: Route[] = [
	{
		path: 'about',
		loadComponent: () => import('./features/about/about.component').then((c) => c.AboutComponent),
	},
	{
		path: 'users',
		loadComponent: () => import('./features/gh/pages/gh-users/gh-users.component').then((c) => c.GhUsersComponent),
		canActivate: [authGuard],
	},
	{
		path: 'login',
		loadComponent: () => import('./features/auth/pages/login/login.component').then((c) => c.LoginComponent),
	},
	{
		path: 'token-expired',
		loadComponent: () => import('./features/auth/pages/token-expired/token-expired.component').then((c) => c.TokenExpiredComponent),
		outlet: 'modal',
	},
];

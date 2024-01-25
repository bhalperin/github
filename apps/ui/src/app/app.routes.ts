import { Route } from '@angular/router';

export const appRoutes: Route[] = [
	{
		path: 'users',
		loadComponent: () => import('./components/users/users.component').then(c => c.UsersComponent)
	}
];

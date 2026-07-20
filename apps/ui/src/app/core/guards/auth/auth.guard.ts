import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AppRouter } from 'core/fw-extensions/app-router';
import { AuthService } from '../../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = async () => {
	const authService = inject(AuthService);
	const router = inject(AppRouter);

	if (!authService.authenticated) {
		await router.navigateToLogin();
	}

	return true;
};

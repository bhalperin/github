import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);

	if (/\/users/.test(req.url)) {
		const newReq = req.clone({
			headers: req.headers.set('Authorization', `Bearer ${authService.accessToken}`)
		});

		return next(newReq);
	}

	return next(req);
};

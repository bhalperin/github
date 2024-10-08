import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { IS_PUBLIC_API, IS_REFRESH_API } from 'utils/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	if (req.context.get(IS_PUBLIC_API) || req.context.get(IS_REFRESH_API)) {
		return next(req);
	}

	const authService = inject(AuthService);
	let newReq = req.clone({
		headers: req.headers.set('Authorization', `Bearer ${authService.accessToken}`),
	});

	return next(newReq).pipe(
		catchError((error: HttpErrorResponse) => {
			console.error('*** authInterceptor error = ', error);
			if (error.status === 401) {
				return authService.refresh(authService.refreshToken).pipe(
					tap(() => authService.saveCredentials()),
					switchMap(() => {
						authService.saveCredentials();
						newReq = req.clone({
							headers: req.headers.set('Authorization', `Bearer ${authService.accessToken}`),
						});

						return next(newReq);
					}),
				);
			}

			return throwError(() => new Error(error.message));
		}),
	);
};

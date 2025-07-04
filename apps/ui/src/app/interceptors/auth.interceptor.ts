import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppRouter } from 'fw-extensions/app-router';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { IS_PUBLIC_API, IS_REFRESH_API } from 'utils/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	if (req.context.get(IS_PUBLIC_API)) {
		return next(req);
	}

	const router = inject(AppRouter);
	const authService = inject(AuthService);
	let authReq = addToken(req, authService.accessToken);

	return next(authReq).pipe(
		catchError((error: HttpErrorResponse) => {
			console.error('*** authInterceptor error = ', error);
			if (error.status === 401) {
				if (req.context.get(IS_REFRESH_API)) {
					router.navigateToTokenExpired();

					return throwError(() => new Error(error.message));
				}
				return authService.refresh(authService.refreshToken).pipe(
					tap(() => authService.saveCredentials()),
					switchMap(() => {
						authService.saveCredentials();
						authReq = addToken(req, authService.accessToken);

						return next(authReq);
					}),
				);
			}

			return throwError(() => new Error(error.message));
		}),
	);
};

const addToken = (rquest: HttpRequest<unknown>, token: string) => {
	return rquest.clone({
		headers: rquest.headers.set('Authorization', `Bearer ${token}`),
	});
};


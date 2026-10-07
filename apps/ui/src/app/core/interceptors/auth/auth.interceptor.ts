import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, tap, throwError } from 'rxjs';

import { AppRouter } from 'core/fw-extensions/app-router';

import { AuthService } from '../../../features/auth/services/auth.service';
import { IS_PUBLIC_API, IS_REFRESH_API } from '../../utils/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	if (req.context.get(IS_PUBLIC_API)) {
		return next(req);
	}

	const router = inject(AppRouter);
	const authService = inject(AuthService);
	let authReq = addToken(req, authService.accessToken);

	return next(authReq).pipe(
		catchError((error: HttpErrorResponse) => {
			console.error('*** authInterceptor error =', error);
			if (error.status === HttpStatusCode.Unauthorized) {
				if (req.context.get(IS_REFRESH_API)) {
					return from(router.navigateToTokenExpired()).pipe(switchMap(() => throwError(() => error)));
				}
				return authService.refresh(authService.refreshToken).pipe(
					tap(() => authService.saveCredentials()),
					switchMap(() => {
						authReq = addToken(req, authService.accessToken);

						return next(authReq);
					}),
				);
			}

			return throwError(() => error);
		}),
	);
};

const addToken = (request: HttpRequest<unknown>, token: string) => {
	return request.clone({
		headers: request.headers.set('Authorization', `Bearer ${token}`),
	});
};

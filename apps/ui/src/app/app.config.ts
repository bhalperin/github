import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { AppRouter } from 'core/fw-extensions/app-router';
import { authInterceptor } from 'core/interceptors/auth/auth.interceptor';
import { errorInterceptor } from 'core/interceptors/error/error.interceptor';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(appRoutes, withComponentInputBinding()),
		provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
		provideZonelessChangeDetection(),
		{
			provide: Router,
			useClass: AppRouter,
		},
	],
};

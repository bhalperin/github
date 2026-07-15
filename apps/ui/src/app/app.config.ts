import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { errorInterceptor } from './core/error/error-interceptor';
import { AppRouter } from './fw-extensions/app-router';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(appRoutes, withComponentInputBinding()),
		provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
		provideZonelessChangeDetection(),
		{
			provide: Router,
			useClass: AppRouter,
		},
	],
};

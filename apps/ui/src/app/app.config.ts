import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { AppRouter } from './fw-extensions/app-router';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(appRoutes, withComponentInputBinding()),
		provideHttpClient(withInterceptors([authInterceptor])),
		provideExperimentalZonelessChangeDetection(),
		{
			provide: Router,
			useClass: AppRouter
		},
	],
};

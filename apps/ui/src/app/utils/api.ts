import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';

export const IS_PUBLIC_API = new HttpContextToken(() => false);
export const PUBLIC_API = new HttpContext().set(IS_PUBLIC_API, true);
export const IS_REFRESH_API = new HttpContextToken(() => false);
export const REFRESH_API = new HttpContext().set(IS_REFRESH_API, true);

export function publicGet(http: HttpClient, url: string) {
	return http.get(url, { context: PUBLIC_API});
}

export function publicPost<T>(http: HttpClient, url: string, body: T) {
	return http.post(url, body, { context: PUBLIC_API});
}

export function refreshPost<T>(http: HttpClient, url: string, body: T) {
	return http.post(url, body, { context: REFRESH_API});
}

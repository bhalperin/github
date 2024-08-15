import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class AppRouter extends Router {
	navigateToLogin() {
		this.navigateByUrl('/login');
	}

	navigateToUsers() {
		this.navigateByUrl('/users');
	}
}

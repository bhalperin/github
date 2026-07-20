import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class AppRouter extends Router {
	async navigateToLogin() {
		await this.navigateByUrl('/login');
	}

	async navigateToUsers() {
		await this.navigateByUrl('/users');
	}

	async navigateToTokenExpired() {
		await this.navigate([{ outlets: { modal: ['token-expired'] } }]);
	}
}

import { Injectable, inject } from "@angular/core";
import { AppStore } from '../store/app.store';

@Injectable({
	providedIn: 'root'
})
export class StoreService {
	readonly #store = inject(AppStore);

	constructor() {
		console.log('StoreService created!');
	}

	get authenticated() {
		return this.#store.isUserAuthenticated();
	}

	set authenticated(authenticated: boolean) {
		this.#store.authenticateUser(authenticated);
	}

	resetUserCards() {
		this.#store.resetUserCards();
	}

	isUserCardFlipped(id: number) {
		return this.#store.isUserCardFlipped(id);
	}

	updateUserCards(id: number, flipped: boolean) {
		this.#store.updateUserCards(id, flipped);
	}
}

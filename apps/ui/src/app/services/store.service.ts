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

	resetUserCards(): void {
		this.#store.resetUserCards();
	}

	isUserCardFlipped(id: number): boolean {
		return this.#store.isUserCardFlipped(id);
	}

	updateUserCards(id: number, flipped: boolean): void {
		this.#store.updateUserCards(id, flipped);
	}
}

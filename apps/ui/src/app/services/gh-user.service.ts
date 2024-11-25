import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class GhUserService {
	#userCardsShowFace$ = new BehaviorSubject<boolean>(false);
	userCardsShowFace$ = this.#userCardsShowFace$.asObservable();

	updateCardFaces(show: boolean): void {
		this.#userCardsShowFace$.next(show);
	}
}

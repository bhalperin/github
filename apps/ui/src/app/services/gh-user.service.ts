import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class GhUserService {
	#userCardsShowFace$ = new BehaviorSubject<boolean>(false);
	userCardsShowFace$ = this.#userCardsShowFace$.asObservable();

	showAllFaces(): void {
		this.#userCardsShowFace$.next(true);
	}
}

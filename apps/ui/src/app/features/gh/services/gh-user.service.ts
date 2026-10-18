import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Service()
export class GhUserService {
	readonly #userCardsShowFace$ = new BehaviorSubject<boolean>(false);
	readonly userCardsShowFace$ = this.#userCardsShowFace$.asObservable();

	updateCardFaces(show: boolean): void {
		this.#userCardsShowFace$.next(show);
	}
}

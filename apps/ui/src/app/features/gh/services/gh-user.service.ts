import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Service()
export class GhUserService {
	#userCardsShowFace$ = new BehaviorSubject<boolean>(false);
	userCardsShowFace$ = this.#userCardsShowFace$.asObservable();

	updateCardFaces(show: boolean): void {
		this.#userCardsShowFace$.next(show);
	}
}

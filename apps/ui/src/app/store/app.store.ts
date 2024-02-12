import {
	patchState,
	signalStore,
	withHooks,
	withMethods,
	withState,
} from '@ngrx/signals';

export type UserCardState = {
	id: number;
	flipped: boolean;
};

export type AppState = {
	users: {
		cards: UserCardState[];
	};
};

export const initialState = {
	users: {
		cards: [],
	},
} as AppState;

export const AppStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withMethods((state) => {
		return {
			resetUserCards: (): void => {
				patchState(state, { users: { cards: [] } });
			},
			isUserCardFlipped: (id: number): boolean => {
				return (
					state.users.cards().find((card) => card.id === id)?.flipped ?? false
				);
			},
			updateUserCards: (id: number, flipped: boolean): void => {
				const cards = [...state.users.cards()];
				const userCardState = cards.find((card) => card.id === id);

				if (flipped) {
					if (userCardState) {
						userCardState.flipped = true;
					} else {
						cards.push({ id, flipped });
					}
				} else if (userCardState) {
					userCardState.flipped = false;
				}

				patchState(state, { users: { cards } });
			},
		};
	}),
	withHooks({
		onInit(state) {
			console.log('initializing store:', state.users());
		},
		onDestroy() {
			console.log('destroying store');
		},
	}),
);

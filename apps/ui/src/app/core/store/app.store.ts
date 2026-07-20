import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';

export type UserCardState = {
	id: number;
	flipped: boolean;
};

export type AppState = {
	user: {
		authenticated: boolean;
	};
	gh: {
		users: {
			cards: UserCardState[];
		};
	};
};

export const initialState = {
	user: {
		authenticated: false,
	},
	gh: {
		users: {
			cards: [],
		},
	},
} as AppState;

export const AppStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withComputed((state) => ({
		isUserAuthenticated: computed(() => state.user().authenticated),
	})),
	withMethods((state) => ({
		authenticateUser: (authenticated: boolean) => patchState(state, { user: { authenticated } }),
		resetUserCards: () => {
			patchState(state, { gh: { users: { cards: [] } } });
		},
		isUserCardFlipped: (id: number) => state.gh.users.cards().find((card) => card.id === id)?.flipped ?? false,
		updateUserCards: (id: number, flipped: boolean) => {
			const cards = [...state.gh.users.cards()];
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

			patchState(state, { gh: { users: { cards } } });
		}
	})),
	withHooks({
		onInit(state) {
			console.log('initializing store:', state.gh.users());
		},
		onDestroy() {
			console.log('destroying store');
		},
	}),
);

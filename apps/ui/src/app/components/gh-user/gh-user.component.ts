import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, computed, inject, input, resource, signal, viewChild, viewChildren } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { GhFullUser, GhUser, GhUserRepo } from '@gh/shared/models';
import { firstValueFrom, tap } from 'rxjs';
import { GhUserService } from 'services/gh-user.service';
import { GhService } from 'services/gh.service';
import { StoreService } from 'services/store.service';
import { TooltipTriggerDirective } from '../../directives/tooltip-trigger/tooltip-trigger.directive';
import { GhUserReposComponent } from '../gh-user-repos/gh-user-repos.component';

@Component({
	selector: 'gh-user',
	templateUrl: './gh-user.component.html',
	styleUrl: './gh-user.component.scss',
	imports: [CommonModule, GhUserReposComponent, TooltipTriggerDirective],
})
export class GhUserComponent implements OnInit {
	readonly #storeService = inject(StoreService);
	readonly #ghService = inject(GhService);
	readonly #userService = inject(GhUserService);
	flipIcons = viewChildren<ElementRef<HTMLElement>>('flipIcon');
	reposModal = viewChild<ElementRef<HTMLElement>>('reposModal');
	user = input.required<GhUser>();
	fullUser = signal<GhFullUser | undefined>(undefined);
	userRepos = signal<GhUserRepo[]>([]);
	reposModalId = computed(() => `reposModal-${this.user().id}`);
	flipped = signal(false);
	flipClickedResource = resource({
		params: this.flipped,
		loader: ({ params }) => new Promise(() => {
			if (params && !this.fullUser()) {
				this.#getUser();
			}
		})
	});

	constructor() {
		toObservable(this.flipped)
			.pipe(takeUntilDestroyed())
			.subscribe((flipped) => this.#storeService.updateUserCards(this.user().id, flipped));
		this.#userService.userCardsShowFace$
			.pipe(
				takeUntilDestroyed(),
			)
			.subscribe((show) => {
				if (show && this.flipped()) {
					this.flipUser();
				}
			});
	}

	ngOnInit(): void {
		if (this.#storeService.isUserCardFlipped(this.user().id)) {
			this.flipIcons()[0]?.nativeElement.click();
		}
		this.reposModal()?.nativeElement.addEventListener('show.bs.modal', () => {
			if (!this.userRepos().length) {
				firstValueFrom(this.#ghService.getAllUserRepos(this.user().login))
					.then((response) => this.userRepos.set(response));
			}
		});
	}

	protected flipUser(): void {
		this.flipped.update((value) => !value);
	}

	#getUser(): void {
		firstValueFrom(this.#ghService.getUser(this.user().login)
			.pipe(
				tap((response) => this.fullUser.set(response)),
			));
	}
}

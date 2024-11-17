import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, computed, inject, input, signal } from '@angular/core';
import { GhFullUser, GhUser, GhUserRepo } from '@gh/shared';
import * as bootstrap from 'bootstrap';
import { firstValueFrom, tap } from 'rxjs';
import { GhUserService } from 'services/gh-user.service';
import { GhService } from 'services/gh.service';
import { StoreService } from 'services/store.service';
import { GhUserReposComponent } from '../gh-user-repos/gh-user-repos.component';

@Component({
	selector: 'gh-user',
	standalone: true,
	templateUrl: './gh-user.component.html',
	styleUrl: './gh-user.component.scss',
	imports: [CommonModule, GhUserReposComponent],
})
export class GhUserComponent implements OnInit {
	@ViewChild('flipIcon', { static: true }) flipIcon:
		| ElementRef<HTMLImageElement>
		| undefined;
	@ViewChild('reposModal', { static: true }) reposModal:
		| ElementRef<HTMLElement>
		| undefined;
	readonly #storeService = inject(StoreService);
	readonly #ghService = inject(GhService);
	readonly #userService = inject(GhUserService);
	user = input.required<GhUser>();
	fullUser = signal<GhFullUser | undefined>(undefined);
	userRepos = signal<GhUserRepo[]>([]);
	reposModalId = computed(() => `reposModal-${this.user().id}`);
	flipped = false;

	#enableTooltip(): void {
		const tooltipTriggerList = document.querySelectorAll(
			'[data-bs-toggle="tooltip"]',
		);

		tooltipTriggerList.forEach(
			(tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
		);
	}

	#getUser(): void {
		this.#ghService
			.getUser(this.user().login)
			.pipe(
				tap((response) => this.fullUser.set(response)),
			)
			.subscribe();
	}

	#flipUser(): void {
		this.flipped = !this.flipped;
		this.#enableTooltip();
	}

	ngOnInit(): void {
		if (this.#storeService.isUserCardFlipped(this.user().id)) {
			this.flipIcon?.nativeElement.click();
		}
		this.#enableTooltip();
		this.reposModal?.nativeElement.addEventListener('show.bs.modal', () => {
			if (!this.userRepos().length) {
				firstValueFrom(this.#ghService.getAllUserRepos(this.user().login))
					.then((response) => this.userRepos.set(response));
			}
		});
		this.#userService.userCardsShowFace$
			.pipe(
				tap((show) => {
					if (show && this.flipped) {
						this.#flipUser();
						this.#storeService.updateUserCards(
							this.user().id,
							false,
						);
					}
				}),
			)
			.subscribe();
	}

	protected flipClicked(ev: MouseEvent, frontClicked: boolean): void {
		ev.stopPropagation();
		bootstrap.Tooltip.getInstance(ev.target as HTMLElement)?.hide();

		if (frontClicked && !this.fullUser()) {
			this.#getUser();
		}

		this.#flipUser();
		this.#storeService.updateUserCards(this.user().id, this.flipped);
	}
}
